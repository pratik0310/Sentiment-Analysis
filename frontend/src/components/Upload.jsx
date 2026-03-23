import { useState } from "react";
import axios from "axios";
import { useUser } from '@clerk/clerk-react';

export default function Upload() {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview URL
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }

    const form = new FormData();
    form.append("image", file);

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/analyze", form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: {
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName || user?.username || 'Valued Investor',
          userId: user?.id
        }
      });

      console.log("Response:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || err.message || "Error analyzing image");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get sentiment color
  const getSentimentColor = (score) => {
    if (score > 0.3) return "#4caf50";
    if (score < -0.3) return "#f44336";
    return "#ff9800";
  };

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#1a1a1a",
      minHeight: "100vh",
      color: "#e0e0e0"
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px",
        borderBottom: "1px solid #333",
        paddingBottom: "15px"
      }}>
        <h1 style={{ color: "#fff", margin: 0 }}>
          📊 FutureWise Stock Sentiment Analysis
        </h1>
        
        {user && (
          <div style={{ 
            padding: "8px 15px", 
            backgroundColor: "#2d2d2d", 
            borderRadius: "20px",
            border: "1px solid #444"
          }}>
            <span style={{ color: "#4caf50" }}>👋</span> {user.fullName || user.username || 'Investor'}
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div style={{ 
        display: "grid",
        gridTemplateColumns: previewUrl ? "1fr 1fr" : "1fr",
        gap: "20px"
      }}>
        {/* Left Column - Upload Section */}
        <div style={{
          backgroundColor: "#2d2d2d",
          borderRadius: "8px",
          padding: "20px",
          border: "1px solid #444"
        }}>
          <h2 style={{ color: "#fff", marginTop: 0 }}>Upload Screenshot</h2>
          
          <div style={{ marginBottom: "20px" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              style={{
                color: "#e0e0e0",
                backgroundColor: "#333",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #555",
                width: "100%",
                cursor: "pointer"
              }}
            />
            
            <button 
              onClick={handleUpload}
              disabled={loading || !file}
              style={{
                marginTop: "15px",
                padding: "12px 24px",
                backgroundColor: loading ? "#444" : "#4a90e2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                width: "100%",
                transition: "background-color 0.3s"
              }}
            >
              {loading ? "🔍 Analyzing..." : "🚀 Analyze Stocks"}
            </button>
          </div>

          {loading && (
            <div style={{ 
              padding: "15px", 
              backgroundColor: "#333", 
              color: "#4a90e2",
              borderRadius: "6px",
              marginTop: "20px",
              border: "1px solid #4a90e2"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="spinner" style={{
                  border: "3px solid #333",
                  borderTop: "3px solid #4a90e2",
                  borderRight: "3px solid #4a90e2",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  animation: "spin 1s linear infinite",
                  marginRight: "15px"
                }}></div>
                <div>
                  <strong>Processing...</strong>
                  <div style={{ fontSize: "12px", marginTop: "5px", color: "#aaa" }}>
                    This may take a minute due to API rate limits
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ 
              padding: "15px", 
              backgroundColor: "#4a1c1c", 
              color: "#ff6b6b",
              borderRadius: "6px",
              marginTop: "20px",
              border: "1px solid #ff6b6b"
            }}>
              ❌ Error: {error}
            </div>
          )}
        </div>

        {/* Right Column - Image Preview */}
        {previewUrl && (
          <div style={{
            backgroundColor: "#2d2d2d",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #444"
          }}>
            <h2 style={{ color: "#fff", marginTop: 0 }}>Image Preview</h2>
            <div style={{
              backgroundColor: "#333",
              borderRadius: "4px",
              padding: "10px",
              display: "flex",
              justifyContent: "center"
            }}>
              <img 
                src={previewUrl} 
                alt="Uploaded screenshot"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "4px"
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && result.results && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ color: "#fff", marginBottom: "15px" }}>
            📈 Analysis Results for {result.stocksFound?.join(", ")}
          </h2>
          
          {/* Portfolio Summary */}
          {result.summary && (
            <div style={{
              padding: "20px",
              backgroundColor: "#2d2d2d",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #444",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", color: "#aaa" }}>Total Stocks</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#fff" }}>
                  {result.summary.total}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", color: "#aaa" }}>Analyzed</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#4caf50" }}>
                  {result.summary.analyzed}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", color: "#aaa" }}>Failed</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#f44336" }}>
                  {result.summary.failed}
                </div>
              </div>
            </div>
          )}
          
          {/* Stock Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "20px"
          }}>
            {result.results.map((item, i) => (
              <div key={i} style={{
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#2d2d2d",
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
              }}>
                <h3 style={{ 
                  margin: "0 0 15px 0", 
                  color: "#fff",
                  borderBottom: "1px solid #444",
                  paddingBottom: "10px"
                }}>
                  {item.stock}
                  {item.headlinesFound > 0 && (
                    <span style={{ 
                      fontSize: "12px", 
                      marginLeft: "10px",
                      color: "#aaa",
                      fontWeight: "normal"
                    }}>
                      {item.headlinesFound} articles
                    </span>
                  )}
                </h3>
                
                {item.error ? (
                  <div style={{ 
                    color: "#f44336",
                    padding: "10px",
                    backgroundColor: "#4a1c1c",
                    borderRadius: "4px"
                  }}>
                    Error: {item.error}
                  </div>
                ) : (
                  <>
                    {/* Score and Analysis Type */}
                    {item.analysis?.score !== undefined && (
                      <div style={{ 
                        marginBottom: "15px",
                        padding: "10px",
                        backgroundColor: "#333",
                        borderRadius: "4px"
                      }}>
                        <div style={{ 
                          fontSize: "24px", 
                          fontWeight: "bold",
                          color: getSentimentColor(item.analysis.score),
                          display: "inline-block"
                        }}>
                          {item.analysis.score.toFixed(2)}
                        </div>
                        {item.analysis.analysisType && (
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#aaa",
                            marginTop: "5px"
                          }}>
                            Analysis Type: {item.analysis.analysisType}
                            {item.analysis.confidence && ` • Confidence: ${item.analysis.confidence}`}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Red Flags (Negative) */}
                    {item.analysis?.redFlags?.length > 0 && (
                      <div style={{ marginBottom: "15px" }}>
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          marginBottom: "8px"
                        }}>
                          <span style={{ fontSize: "20px", marginRight: "8px" }}>🚩</span>
                          <strong style={{ color: "#f44336" }}>Red Flags</strong>
                        </div>
                        <ul style={{ 
                          margin: "0", 
                          paddingLeft: "35px",
                          listStyleType: "none"
                        }}>
                          {item.analysis.redFlags.map((flag, idx) => (
                            <li key={idx} style={{ 
                              color: "#ff8a80",
                              marginBottom: "5px",
                              position: "relative"
                            }}>
                              <span style={{ 
                                position: "absolute",
                                left: "-20px",
                                color: "#f44336"
                              }}>•</span>
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Green Flags (Positive) */}
                    {item.analysis?.greenFlags?.length > 0 && (
                      <div style={{ marginBottom: "15px" }}>
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          marginBottom: "8px"
                        }}>
                          <span style={{ fontSize: "20px", marginRight: "8px" }}>🏁</span>
                          <strong style={{ color: "#4caf50" }}>Green Flags</strong>
                        </div>
                        <ul style={{ 
                          margin: "0", 
                          paddingLeft: "35px",
                          listStyleType: "none"
                        }}>
                          {item.analysis.greenFlags.map((flag, idx) => (
                            <li key={idx} style={{ 
                              color: "#a5d6a5",
                              marginBottom: "5px",
                              position: "relative"
                            }}>
                              <span style={{ 
                                position: "absolute",
                                left: "-20px",
                                color: "#4caf50"
                              }}>•</span>
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Summary */}
                    {item.analysis?.summary && (
                      <div style={{ 
                        marginTop: "15px",
                        padding: "12px",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                        borderLeft: "4px solid #4a90e2"
                      }}>
                        <strong style={{ color: "#aaa", display: "block", marginBottom: "5px" }}>
                          Summary
                        </strong>
                        <p style={{ margin: "0", lineHeight: "1.6", color: "#e0e0e0" }}>
                          {item.analysis.summary}
                        </p>
                      </div>
                    )}

                    {/* Note */}
                    {item.analysis?.note && (
                      <div style={{ 
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "#888",
                        fontStyle: "italic",
                        padding: "8px",
                        backgroundColor: "#262626",
                        borderRadius: "4px"
                      }}>
                        📝 Note: {item.analysis.note}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input[type="file"]::-webkit-file-upload-button {
          background: #4a90e2;
          color: white;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
        }
        
        input[type="file"]::-webkit-file-upload-button:hover {
          background: #357abd;
        }
      `}</style>
    </div>
  );
}