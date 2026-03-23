// services/email.service.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter with connection pooling
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  pool: true, // Enable connection pooling for multiple emails
  maxConnections: 5, // Limit simultaneous connections
  maxMessages: Infinity, // Unlimited messages per connection
});

/**
 * Send portfolio report email to a Clerk user
 * @param {string} userEmail - Email from Clerk user
 * @param {string} userName - User's name from Clerk
 * @param {object} portfolioData - Aggregated stock analysis data
 */
export async function sendPortfolioReport(userEmail, userName, portfolioData) {
  const { overallScore, stocks, summary } = portfolioData;
  
  // Determine sentiment color and emoji
  const getScoreColor = (score) => {
    if (score > 0.3) return { color: '#4caf50', emoji: '🟢', text: 'Bullish' };
    if (score < -0.3) return { color: '#f44336', emoji: '🔴', text: 'Bearish' };
    return { color: '#ff9800', emoji: '🟡', text: 'Neutral' };
  };
  
  const sentiment = getScoreColor(overallScore);
  
  // Generate HTML report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .score-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
        .score-value { font-size: 48px; font-weight: bold; color: ${sentiment.color}; }
        .stock-list { margin-top: 20px; }
        .stock-item { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid ${sentiment.color}; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .positive { color: #4caf50; }
        .negative { color: #f44336; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 FutureWise Portfolio Report</h1>
        <p>Your personalized stock sentiment analysis</p>
      </div>
      
      <div class="content">
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Here's your latest portfolio sentiment analysis:</p>
        
        <div class="score-card">
          <h2>Overall Portfolio Sentiment</h2>
          <div class="score-value">${sentiment.emoji} ${overallScore.toFixed(2)}%</div>
          <p style="font-size: 18px; color: ${sentiment.color};">${sentiment.text}</p>
          <p>${summary}</p>
        </div>
        
        <div class="stock-list">
          <h3>Individual Stock Analysis:</h3>
          ${stocks.map(stock => `
            <div class="stock-item">
              <h4 style="margin:0">${stock.symbol}</h4>
              <p style="margin:5px 0"><strong>Score:</strong> <span style="color: ${getScoreColor(stock.score).color}">${stock.score.toFixed(2)}</span></p>
              <p style="margin:5px 0"><strong>Summary:</strong> ${stock.summary}</p>
              ${stock.greenFlags?.length ? `
                <p style="margin:5px 0; color: #4caf50;">✅ ${stock.greenFlags.join(' • ')}</p>
              ` : ''}
              ${stock.redFlags?.length ? `
                <p style="margin:5px 0; color: #f44336;">⚠️ ${stock.redFlags.join(' • ')}</p>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        <p style="margin-top: 20px;">Log in to FutureWise for real-time updates and detailed analysis.</p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} FutureWise. All rights reserved.</p>
        <p>This is an automated report from your FutureWise portfolio.</p>
      </div>
    </body>
    </html>
  `;
  
  // Plain text alternative
  const textContent = `
FutureWise Portfolio Report for ${userName}

Overall Portfolio Sentiment: ${sentiment.emoji} ${overallScore.toFixed(2)} (${sentiment.text})
${summary}

Individual Stock Analysis:
${stocks.map(stock => `
- ${stock.symbol}: ${stock.score.toFixed(2)}
  ${stock.summary}
  ${stock.greenFlags?.length ? `  Positive: ${stock.greenFlags.join(', ')}` : ''}
  ${stock.redFlags?.length ? `  Negative: ${stock.redFlags.join(', ')}` : ''}
`).join('\n')}

Log in to FutureWise for real-time updates.
  `;
  
  // Send email
  try {
    const info = await transporter.sendMail({
      from: `"FutureWise" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: `📊 Your FutureWise Portfolio Report - ${new Date().toLocaleDateString()}`,
      text: textContent,
      html: htmlContent,
    });
    
    console.log('Portfolio report sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Close transporter when application shuts down
process.on('SIGTERM', async () => {
  await transporter.close();
});