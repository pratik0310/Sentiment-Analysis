import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { sendPortfolioReport } from '../services/email.service.js';

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Load multiple API keys from environment variable
const API_KEYS = process.env.GEMINI_API_KEY?.split(',').map(k => k.trim()) || [];

if (API_KEYS.length === 0) {
  console.error("No Gemini API keys found. Please set GEMINI_API_KEYS in .env");
}

console.log(`Loaded ${API_KEYS.length} Gemini API keys`);

// Key management variables
let currentKeyIndex = 0;
const keyFailureCount = new Map();
const keyDisabledUntil = new Map();
const KEY_FAILURE_LIMIT = 3;
const REQUEST_COUNTS = new Map(); // Track requests per key per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

// Store user request counts for rate limiting (optional)
const userRequestCounts = new Map();

// Helper function to get next available API key (round-robin with health check)
const getNextAvailableKey = () => {
  const startIndex = currentKeyIndex;
  let attempts = 0;
  
  while (attempts < API_KEYS.length) {
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    
    // Check if key is disabled
    const disabledUntil = keyDisabledUntil.get(key);
    if (disabledUntil && Date.now() < disabledUntil) {
      attempts++;
      continue;
    }
    
    // Check rate limit for this key (max 5 requests per minute for free tier)
    const keyRequests = REQUEST_COUNTS.get(key) || [];
    const now = Date.now();
    const recentRequests = keyRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= 5) {
      // Key has hit rate limit, try next
      attempts++;
      continue;
    }
    
    // Reset failure count if key was disabled and now available
    if (disabledUntil && Date.now() >= disabledUntil) {
      keyDisabledUntil.delete(key);
      keyFailureCount.set(key, 0);
    }
    
    return key;
  }
  
  // If all keys are rate limited or disabled, return the next one anyway and it will handle delay
  console.log("All keys are currently rate limited or disabled, using round-robin");
  return API_KEYS[currentKeyIndex % API_KEYS.length];
};

// Track request for rate limiting
const trackRequest = (key) => {
  const now = Date.now();
  const requests = REQUEST_COUNTS.get(key) || [];
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  recentRequests.push(now);
  REQUEST_COUNTS.set(key, recentRequests);
};

// Create a new Gemini client with a specific key
const getGeminiModel = (apiKey) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-3-flash" });
};

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API calls with retry logic and key rotation
async function makeGeminiRequestWithRetry(prompt, imageBuffer = null, maxRetries = 5) {
  const usedKeys = new Set();
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Get next available key
    const apiKey = getNextAvailableKey();
    
    // Skip if we've already tried this key in this request cycle
    if (usedKeys.has(apiKey)) {
      // If we've tried all keys, wait a bit and reset
      if (usedKeys.size >= API_KEYS.length) {
        console.log(" Tried all keys, waiting 5 seconds before retry cycle...");
        await delay(5000);
        usedKeys.clear();
      }
      continue;
    }
    usedKeys.add(apiKey);
    
    const model = getGeminiModel(apiKey);
    const keyPrefix = apiKey.substring(0, 8);
    
    try {
      console.log(` Attempt ${attempt + 1}/${maxRetries} with key ${keyPrefix}...`);
      
      // Track this request for rate limiting
      trackRequest(apiKey);
      
      let result;
      if (imageBuffer) {
        // Vision request
        result = await model.generateContent([
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBuffer.toString("base64")
            }
          }
        ]);
      } else {
        // Text-only request
        result = await model.generateContent(prompt);
      }
      
      // Success - reset failure count for this key
      keyFailureCount.set(apiKey, 0);
      console.log(` Key ${keyPrefix} succeeded`);
      return result;
      
    } catch (error) {
      console.log(` Key ${keyPrefix} failed:`, error.message);
      
      // Track failure
      const failures = (keyFailureCount.get(apiKey) || 0) + 1;
      keyFailureCount.set(apiKey, failures);
      
      if (error.status === 429) {
        // Rate limit - disable this key temporarily
        console.log(` Key ${keyPrefix} hit rate limit`);
        
        if (failures >= KEY_FAILURE_LIMIT) {
          // Exponential backoff for disable duration
          const disableSeconds = Math.min(300, Math.pow(2, failures - KEY_FAILURE_LIMIT) * 30);
          keyDisabledUntil.set(apiKey, Date.now() + (disableSeconds * 1000));
          console.log(` Key ${keyPrefix} disabled for ${disableSeconds}s after ${failures} failures`);
        }
        
        // Extract wait time from error if available
        const waitTime = error.errorDetails?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo')?.retryDelay;
        if (waitTime) {
          const waitMs = parseInt(waitTime) || 2000;
          console.log(` Waiting ${waitMs/1000}s as suggested by API...`);
          await delay(waitMs);
        } else {
          // Exponential backoff between retries
          const backoffMs = Math.min(30000, Math.pow(2, attempt) * 1000);
          console.log(` Backing off for ${backoffMs/1000}s...`);
          await delay(backoffMs);
        }
      } else if (error.status === 400 && error.message.includes("API key not valid")) {
        // Invalid key - disable it permanently for this session
        keyDisabledUntil.set(apiKey, Date.now() + (60 * 60 * 1000)); // Disable for 1 hour
        console.log(`Key ${keyPrefix} is invalid, disabling for 1 hour`);
      } else {
        // Non-rate-limit error, throw immediately
        throw error;
      }
    }
  }
  
  throw new Error(`All API keys failed after ${maxRetries} retries`);
}

// Helper function to generate portfolio summary
function generatePortfolioSummary(results) {
  const avgScore = results.reduce((sum, r) => sum + (r.analysis?.score || 0), 0) / results.length;
  const positive = results.filter(r => (r.analysis?.score || 0) > 0.3).length;
  const negative = results.filter(r => (r.analysis?.score || 0) < -0.3).length;
  const neutral = results.length - positive - negative;
  
  if (avgScore > 0.3) {
    return `Your portfolio shows strong positive sentiment with ${positive} bullish stocks.`;
  } else if (avgScore < -0.3) {
    return `Your portfolio shows bearish sentiment with ${negative} stocks showing negative indicators.`;
  } else {
    return `Your portfolio sentiment is neutral with ${neutral} stocks showing balanced indicators.`;
  }
}

// Main analyze endpoint
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Get user info from request (sent from frontend)
    const userEmail = req.query.userEmail || req.body.userEmail;
    const userName = req.query.userName || req.body.userName || 'Valued Investor';
    const userId = req.query.userId || req.body.userId || 'anonymous';
    
    console.log(`👤 User: ${userName} (${userEmail}) making request`);

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imgBuffer = fs.readFileSync(req.file.path);
    
    console.log("📸 Image loaded, size:", imgBuffer.length, "bytes");
    console.log(`🔑 Available API keys: ${API_KEYS.length}`);

    // STEP 1: Extract stocks from image
    console.log("🔍 Calling Gemini API for stock extraction...");
    const visionResult = await makeGeminiRequestWithRetry(
      "Extract ONLY stock/company symbols from this screenshot. Return ONLY JSON array like [\"TCS\",\"INFY\"].",
      imgBuffer
    );

    let stocksText = visionResult.response.text();
    console.log("📝 Gemini Raw Response:", stocksText);

    // Clean and parse stocks
    stocksText = stocksText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = stocksText.match(/\[.*\]/s);
    if (!match) {
      return res.status(500).json({ error: "No stocks detected in response" });
    }

    const stocks = JSON.parse(match[0]);
    console.log("📊 Parsed stocks:", stocks);

    // STEP 2: Process sentiment for each stock
    let results = [];
    
    for (let i = 0; i < stocks.length; i++) {
      const stock = stocks[i];
      
      try {
        console.log(`\n📈 Processing ${stock} (${i + 1}/${stocks.length})...`);
        
        // Dynamic delay based on number of keys
        const delayTime = API_KEYS.length >= 4 ? 3000 : // 3 seconds with 4+ keys
                         API_KEYS.length >= 2 ? 6000 : // 6 seconds with 2-3 keys
                         12000; // 12 seconds with 1 key
        
        if (i > 0) {
          console.log(`⏱️ Waiting ${delayTime/1000} seconds before next request...`);
          await delay(delayTime);
        }

        // Fetch news
        console.log(`📰 Fetching news for ${stock}...`);
        const news = await axios.get(
          `https://newsapi.org/v2/everything?q=${stock}&apiKey=${process.env.NEWS_API_KEY}`
        );

        let headlines = "";
        if (news.data.articles && news.data.articles.length > 0) {
          headlines = news.data.articles
            .slice(0, 5)
            .map(a => `• ${a.title}`)
            .join("\n");
          console.log(`📰 Found ${news.data.articles.length} articles`);
        } else {
          headlines = "No recent news articles found for this stock.";
          console.log(`📰 No articles found`);
        }

        // Get sentiment analysis with improved prompt
        const sentiment = await makeGeminiRequestWithRetry(`
Analyze sentiment for ${stock} stock based on the following news headlines:

${headlines}

INSTRUCTIONS:
1. If headlines DIRECTLY mention ${stock}, analyze based on that news
2. If headlines are about ${stock}'s industry/sector, provide sector-based analysis
3. If headlines are general market news, provide market-context analysis
4. If NO relevant headlines exist, provide a NEUTRAL/DEFAULT analysis based on general market perception of ${stock}
5. ALWAYS return valid JSON - never return plain text

Return format:
{
  "score": 0.0,
  "analysisType": "direct|sector|market|default",
  "confidence": "high|medium|low",
  "greenFlags": [],
  "redFlags": [],
  "summary": "",
  "note": ""
}

RULES:
- score: -1.0 (very negative) to +1.0 (very positive), use 0.0 for neutral
- analysisType: what kind of analysis was possible
- confidence: how confident you are in the analysis
- greenFlags: positive observations (max 3)
- redFlags: negative observations (max 3)
- summary: brief 1-2 sentence conclusion
- note: any disclaimer about data quality/relevance
-convert score into percentage at last step and return in percentage format
- If no news is found, return a default analysis with score 0.0% and note about lack of data
-for negative give negative percentage

Example for no news:
{
  "score": 0.0%,
  "analysisType": "default",
  "confidence": "low",
  "greenFlags": ["No negative news available"],
  "redFlags": ["Limited information for analysis"],
  "summary": "Unable to determine sentiment due to lack of recent news about ${stock}.",
  "note": "Analysis based on general market perception"

}

Now analyze ${stock} and return ONLY the JSON object.
`);

        // Parse the sentiment response
        let sentimentText = sentiment.response.text();
        sentimentText = sentimentText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        
        try {
          const sentimentData = JSON.parse(sentimentText);
          results.push({
            stock,
            analysis: sentimentData,
            headlinesFound: news.data.articles?.length || 0
          });
          console.log(`✅ ${stock} analyzed: ${sentimentData.analysisType} (score: ${sentimentData.score})`);
        } catch (parseError) {
          console.log(`⚠️ Failed to parse JSON for ${stock}, using fallback`);
          results.push({
            stock,
            analysis: {
              score: 0.0,
              analysisType: "fallback",
              confidence: "low",
              greenFlags: ["Analysis completed with fallback"],
              redFlags: ["JSON parsing error"],
              summary: `Technical issue in analysis for ${stock}, using neutral score.`,
              note: "Fallback used due to parsing error"
            },
            headlinesFound: news.data.articles?.length || 0
          });
        }

      } catch (stockError) {
        console.error(`❌ Error processing ${stock}:`, stockError.message);
        
        // Provide fallback analysis even when API fails
        results.push({
          stock,
          error: stockError.message,
          analysis: {
            score: 0.0,
            analysisType: "error",
            confidence: "low",
            greenFlags: ["Analysis attempted"],
            redFlags: ["API error occurred"],
            summary: `Could not analyze ${stock} due to: ${stockError.message}. Using neutral sentiment.`,
            note: "Error fallback - analysis may not reflect actual market sentiment"
          },
          headlinesFound: 0
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    // Summary statistics
    const analyzedCount = results.filter(r => !r.error && r.analysis?.analysisType !== "error").length;
    console.log(`\n📊 Analysis complete: ${analyzedCount}/${stocks.length} stocks analyzed successfully`);
    
    // ==================== EMAIL FUNCTIONALITY ====================
    // Send email report if user email is provided
    if (userEmail && results.length > 0) {
      console.log(`📧 Preparing to send email to: ${userEmail}`);
      
      // Calculate overall portfolio score
      const overallScore = results.reduce((sum, r) => {
        return sum + (r.analysis?.score || 0);
      }, 0) / results.length;
      
      // Prepare portfolio data for email
      const portfolioData = {
        overallScore: overallScore*100/100,//convert to percentage  
        stocks: results.map(r => ({
          symbol: r.stock,
          score: r.analysis?.score || 0,
          summary: r.analysis?.summary || 'No analysis available',
          greenFlags: r.analysis?.greenFlags || [],
          redFlags: r.analysis?.redFlags || []
        })),
        summary: generatePortfolioSummary(results)
      };
      
      console.log("📧 Portfolio data prepared, sending email...");
      
      // Send email asynchronously (don't await - let it run in background)
      sendPortfolioReport(userEmail, userName, portfolioData)
        .then(result => {
          if (result.success) {
            console.log("✅ Email sent successfully:", result.messageId);
          } else {
            console.log("❌ Email failed:", result.error);
          }
        })
        .catch(err => {
          console.error("❌ Email error:", err.message);
        });
    } else {
      console.log("📧 No email sent - userEmail:", userEmail, "results:", results.length);
    }
    // ==================== END EMAIL FUNCTIONALITY ====================
    
    res.json({
      success: true,
      stocksFound: stocks,
      results: results,
      summary: {
        total: stocks.length,
        analyzed: analyzedCount,
        failed: stocks.length - analyzedCount
      }
    });

  } catch (err) {
    console.error("❌ Analyze Error:", err);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: "Analysis failed", 
      message: err.message,
      note: "Using fallback analysis where possible"
    });
  }
});

export default router;