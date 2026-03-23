// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { isSignedIn } = useUser();

  const features = [
    { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Advanced Gemini AI for accurate sentiment detection' },
    { icon: '📸', title: 'Screenshot Analysis', desc: 'Upload stock screenshots for instant insights' },
    { icon: '📊', title: 'Real-time News', desc: 'Latest financial news with sentiment scores' },
    { icon: '🚩', title: 'Red & Green Flags', desc: 'Clear visual indicators for quick decisions' },
    { icon: '📈', title: 'Portfolio Tracking', desc: 'Monitor your stocks in one dashboard' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and protected' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          borderRadius: '20px',
          marginBottom: '40px',
        }}
      >
        <h1 style={{
          fontSize: '48px',
          color: '#fff',
          marginBottom: '20px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}>
          Make Smarter Investment Decisions
          <span style={{ color: '#4a90e2', display: 'block', fontSize: '32px' }}>
            with AI-Powered Sentiment Analysis
          </span>
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#aaa',
          maxWidth: '600px',
          margin: '0 auto 30px',
          lineHeight: '1.6',
        }}>
          Upload a screenshot of any stock and get instant sentiment analysis
          based on real-time news and market data.
        </p>

        <Link to={isSignedIn ? "/analyze" : "/pricing"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              backgroundColor: '#4a90e2',
              color: '#fff',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
            }}
          >
            {isSignedIn ? 'Start Analysis →' : 'Get Started Free'}
          </motion.button>
        </Link>
      </motion.div>

      {/* Features Grid */}
      <h2 style={{
        textAlign: 'center',
        color: '#fff',
        fontSize: '36px',
        marginBottom: '40px',
      }}>
        Why Choose FutureWise?
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '60px',
      }}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(74, 144, 226, 0.2)' }}
            style={{
              backgroundColor: '#2d2d2d',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid #444',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{feature.icon}</div>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>{feature.title}</h3>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      {!isSignedIn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#2d2d2d',
            borderRadius: '20px',
            border: '1px solid #4a90e2',
          }}
        >
          <h2 style={{ color: '#fff', fontSize: '32px', marginBottom: '15px' }}>
            Ready to Start?
          </h2>
          <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '30px' }}>
            Join thousands of investors making data-driven decisions
          </p>
          <Link to="/pricing">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                backgroundColor: 'transparent',
                color: '#4a90e2',
                border: '2px solid #4a90e2',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              View Pricing Plans
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}