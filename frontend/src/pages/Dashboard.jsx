import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useUser();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's analysis history
    setTimeout(() => {
      setAnalyses([
        { id: 1, stock: "TCS", score: 0.7, date: "2026-02-22", type: "direct" },
        { id: 2, stock: "INFY", score: -0.2, date: "2026-02-22", type: "sector" },
        { id: 3, stock: "NYKAA", score: 0.5, date: "2026-02-21", type: "direct" },
        { id: 4, stock: "RELIANCE", score: 0.3, date: "2026-02-21", type: "market" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score) => {
    if (score > 0.3) return "#4caf50";
    if (score < -0.3) return "#f44336";
    return "#ff9800";
  };

  return (
    <div>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "#2d2d2d",
          borderRadius: "12px",
          padding: "30px",
          marginBottom: "30px",
          border: "1px solid #444",
        }}
      >
        <h1 style={{ color: "#fff", margin: "0 0 10px 0" }}>
          Welcome back, {user?.fullName || user?.username}!
        </h1>
        <p style={{ color: "#aaa", margin: "0" }}>
          Here's your recent stock sentiment analysis activity.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}>
        {[
          { label: "Total Analyses", value: "24", icon: "" },
          { label: "Bullish Signals", value: "15", icon: "", color: "#4caf50" },
          { label: "Bearish Signals", value: "6", icon: "", color: "#f44336" },
          { label: "Neutral", value: "3", icon: "", color: "#ff9800" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
            style={{
              backgroundColor: "#2d2d2d",
              borderRadius: "10px",
              padding: "20px",
              border: "1px solid #444",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>{stat.icon}</div>
            <div style={{ color: "#aaa", fontSize: "14px" }}>{stat.label}</div>
            <div style={{ 
              fontSize: "28px", 
              fontWeight: "bold",
              color: stat.color || "#fff"
            }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Analyses Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          backgroundColor: "#2d2d2d",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #444",
        }}
      >
        <h2 style={{ color: "#fff", margin: "0 0 20px 0" }}>Recent Analyses</h2>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div className="spinner" style={{
              border: "3px solid #333",
              borderTop: "3px solid #4a90e2",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}></div>
            <p style={{ color: "#aaa" }}>Loading your analyses...</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #444" }}>
                  <th style={{ textAlign: "left", padding: "10px", color: "#aaa" }}>Stock</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#aaa" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#aaa" }}>Score</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#aaa" }}>Type</th>
                  <th style={{ textAlign: "left", padding: "10px", color: "#aaa" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    style={{ borderBottom: "1px solid #333" }}
                  >
                    <td style={{ padding: "15px 10px", color: "#fff" }}>{item.stock}</td>
                    <td style={{ padding: "15px 10px", color: "#aaa" }}>{item.date}</td>
                    <td style={{ padding: "15px 10px" }}>
                      <span style={{
                        color: getScoreColor(item.score),
                        fontWeight: "bold",
                        padding: "4px 8px",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                      }}>
                        {item.score > 0 ? '+' : ''}{item.score}
                      </span>
                    </td>
                    <td style={{ padding: "15px 10px" }}>
                      <span style={{
                        color: "#aaa",
                        backgroundColor: "#333",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: "15px 10px" }}>
                      <button
                        style={{
                          padding: "5px 12px",
                          backgroundColor: "transparent",
                          color: "#4a90e2",
                          border: "1px solid #4a90e2",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#4a90e2";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "#4a90e2";
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}