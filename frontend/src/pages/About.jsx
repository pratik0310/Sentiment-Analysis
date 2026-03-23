import { motion } from "framer-motion";

export default function About() {
  const team = [
    { name: "Alex Chen", role: "CEO & Founder", bio: "10+ years in fintech and AI", icon: "👨‍💻" },
    { name: "Sarah Johnson", role: "Head of AI", bio: "PhD in Machine Learning", icon: "🤖" },
    { name: "Mike Patel", role: "Lead Engineer", bio: "Ex-Google, full-stack expert", icon: "⚡" },
    { name: "Priya Singh", role: "Product Manager", bio: "Fintech product specialist", icon: "📊" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#2d2d2d",
          borderRadius: "20px",
          marginBottom: "40px",
          border: "1px solid #444",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "48px", marginBottom: "20px" }}>
          About FutureWise
        </h1>
        <p style={{ color: "#aaa", fontSize: "18px", maxWidth: "800px", margin: "0 auto", lineHeight: "1.8" }}>
          We're on a mission to democratize stock market analysis using cutting-edge AI technology. 
          Our platform helps investors of all levels make smarter, data-driven decisions.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          marginBottom: "50px",
        }}
      >
        {[
          {
            title: "Our Mission",
            content: "To empower every investor with AI-powered insights that were once only available to institutional traders.",
            icon: "🎯"
          },
          {
            title: "Our Vision",
            content: "A world where sophisticated market analysis is accessible to everyone, leveling the playing field in finance.",
            icon: "👁️"
          },
          {
            title: "Our Values",
            content: "Transparency, innovation, and user-first design guide everything we build.",
            icon: "💎"
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            style={{
              backgroundColor: "#2d2d2d",
              borderRadius: "15px",
              padding: "30px",
              border: "1px solid #444",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>{item.icon}</div>
            <h2 style={{ color: "#fff", marginBottom: "15px" }}>{item.title}</h2>
            <p style={{ color: "#aaa", lineHeight: "1.6" }}>{item.content}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Team Section */}
      <h2 style={{ color: "#fff", textAlign: "center", fontSize: "36px", marginBottom: "30px" }}>
        Meet Our Team
      </h2>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "30px",
        marginBottom: "50px",
      }}>
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            style={{
              backgroundColor: "#2d2d2d",
              borderRadius: "15px",
              padding: "30px",
              border: "1px solid #444",
              textAlign: "center",
            }}
          >
            <div style={{
              fontSize: "80px",
              marginBottom: "20px",
              animation: "float 3s ease-in-out infinite",
            }}>
              {member.icon}
            </div>
            <h3 style={{ color: "#fff", marginBottom: "5px" }}>{member.name}</h3>
            <div style={{ color: "#4a90e2", marginBottom: "10px", fontWeight: "bold" }}>
              {member.role}
            </div>
            <p style={{ color: "#aaa", fontSize: "14px" }}>{member.bio}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
          backgroundColor: "#2d2d2d",
          borderRadius: "20px",
          padding: "40px",
          border: "1px solid #444",
        }}
      >
        {[
          { value: "50K+", label: "Users" },
          { value: "1M+", label: "Analyses" },
          { value: "98%", label: "Accuracy" },
          { value: "24/7", label: "Support" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#4a90e2" }}>
              {stat.value}
            </div>
            <div style={{ color: "#aaa" }}>{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}