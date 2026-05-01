// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const TICKER_ITEMS = [
  { sym: 'AAPL', val: '+2.34%', bull: true },
  { sym: 'TSLA', val: '-1.07%', bull: false },
  { sym: 'NVDA', val: '+4.12%', bull: true },
  { sym: 'MSFT', val: '+0.88%', bull: true },
  { sym: 'AMZN', val: '-0.43%', bull: false },
  { sym: 'META', val: '+3.67%', bull: true },
  { sym: 'GOOGL', val: '+1.22%', bull: true },
  { sym: 'JPM', val: '-0.91%', bull: false },
  { sym: 'SPY', val: '+0.74%', bull: true },
  { sym: 'QQQ', val: '+1.18%', bull: true },
];

const FEATURES = [
  {
    tag: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="18" width="4" height="8" fill="#00d97e"/>
        <rect x="8" y="12" width="4" height="14" fill="#00d97e" opacity="0.7"/>
        <rect x="14" y="6" width="4" height="20" fill="#00d97e" opacity="0.5"/>
        <rect x="20" y="10" width="4" height="16" fill="#00d97e" opacity="0.6"/>
        <polyline points="4,14 10,8 16,4 22,8" stroke="#c8ff00" strokeWidth="1.5" fill="none"/>
        <circle cx="22" cy="8" r="2" fill="#c8ff00"/>
      </svg>
    ),
    title: 'AI Sentiment Engine',
    desc: 'Gemini-powered model reads between the lines of market chatter — not just keywords, but context, tone, and momentum shift.',
  },
  {
    tag: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="16" rx="2" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <rect x="6" y="6" width="16" height="10" rx="1" fill="#00d97e" opacity="0.08"/>
        <line x1="6" y1="9" x2="22" y2="9" stroke="#00d97e" strokeWidth="0.5" strokeDasharray="2 2"/>
        <line x1="6" y1="12" x2="22" y2="12" stroke="#00d97e" strokeWidth="0.5" strokeDasharray="2 2"/>
        <line x1="11" y1="19" x2="17" y2="19" stroke="#00d97e" strokeWidth="2"/>
        <line x1="14" y1="19" x2="14" y2="25" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="10" y1="25" x2="18" y2="25" stroke="#00d97e" strokeWidth="2"/>
      </svg>
    ),
    title: 'Screenshot Analysis',
    desc: 'Drop any stock chart screenshot. Our vision model extracts symbol, timeframe, and pattern — then cross-references live sentiment.',
  },
  {
    tag: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <line x1="14" y1="3" x2="14" y2="8" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="14" y1="20" x2="14" y2="25" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="3" y1="14" x2="8" y2="14" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="20" y1="14" x2="25" y2="14" stroke="#00d97e" strokeWidth="1.5"/>
        <polyline points="14,14 14,8 17,11" stroke="#c8ff00" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="2" fill="#c8ff00"/>
      </svg>
    ),
    title: 'Real-time News Feed',
    desc: 'Financial news scored the moment it publishes — so you\'re never reacting to yesterday\'s sentiment.',
  },
  {
    tag: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polygon points="14,3 25,25 3,25" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <line x1="14" y1="12" x2="14" y2="18" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="14" cy="21" r="1.5" fill="#c8ff00"/>
      </svg>
    ),
    title: 'Red & Green Flags',
    desc: 'No noise — just clear signal. Each stock gets a verdict: bullish catalyst, bearish risk, or neutral drift.',
  },
  {
    tag: '05',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="8" width="9" height="12" rx="1" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <rect x="16" y="5" width="9" height="15" rx="1" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <line x1="7.5" y1="20" x2="7.5" y2="24" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="20.5" y1="20" x2="20.5" y2="24" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="4" y1="24" x2="24" y2="24" stroke="#00d97e" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Portfolio Dashboard',
    desc: 'Track your watchlist in one view. Sentiment heatmap across all your positions, updated continuously.',
  },
  {
    tag: '06',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="8" y="3" width="12" height="16" rx="2" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <path d="M11 19 L11 25 L14 23 L17 25 L17 19" stroke="#00d97e" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <line x1="11" y1="9" x2="17" y2="9" stroke="#00d97e" strokeWidth="1" opacity="0.6"/>
        <line x1="11" y1="12" x2="17" y2="12" stroke="#00d97e" strokeWidth="1" opacity="0.6"/>
      </svg>
    ),
    title: 'Zero Data Leaks',
    desc: 'Your portfolio, your positions — encrypted at rest. We don\'t sell analyst data, ever.',
  },
];

function TickerBar() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid #1e2a1e',
      borderBottom: '1px solid #1e2a1e',
      background: '#060a06',
      padding: '10px 0',
      position: 'relative',
    }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '48px', width: 'max-content' }}
      >
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.04em',
            color: item.bull ? '#00d97e' : '#ff5757',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: '#a8b8a8', marginRight: '8px' }}>{item.sym}</span>
            {item.bull ? '▲' : '▼'} {item.val}
          </span>
        ))}
      </motion.div>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px',
        background: 'linear-gradient(to right, #060a06, transparent)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px',
        background: 'linear-gradient(to left, #060a06, transparent)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}

function BlinkingCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      width: '3px',
      height: '0.85em',
      background: '#c8ff00',
      marginLeft: '6px',
      verticalAlign: 'middle',
      opacity: on ? 1 : 0,
      transition: 'opacity 0.1s',
    }}/>
  );
}

function SentimentMeter() {
  return (
    <div style={{
      border: '1px solid #1e2a1e',
      borderRadius: '4px',
      padding: '20px',
      background: '#060d06',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '12px',
      minWidth: '260px',
    }}>
      <div style={{ color: '#3d5c3d', marginBottom: '14px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        SENTIMENT_SCAN.exe
      </div>
      {[
        { sym: 'NVDA', score: 87, bull: true },
        { sym: 'TSLA', score: 34, bull: false },
        { sym: 'AAPL', score: 71, bull: true },
      ].map((s, i) => (
        <div key={i} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ color: '#7aaa7a' }}>{s.sym}</span>
            <span style={{ color: s.bull ? '#00d97e' : '#ff5757' }}>
              {s.bull ? '▲' : '▼'} {s.score}
            </span>
          </div>
          <div style={{ height: '4px', background: '#111d11', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s.score}%` }}
              transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: s.bull
                  ? `linear-gradient(to right, #00d97e88, #00d97e)`
                  : `linear-gradient(to right, #ff575788, #ff5757)`,
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      ))}
      <div style={{ color: '#2a3f2a', marginTop: '16px', fontSize: '11px' }}>
        {'>'} SCANNING MARKET_FEED... <BlinkingCursor />
      </div>
    </div>
  );
}

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div style={{
      background: '#050905',
      minHeight: '100vh',
      color: '#d4e8d4',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

        .fw-btn-primary {
          background: #c8ff00;
          color: #050905;
          border: none;
          padding: 14px 36px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          cursor: pointer;
          text-transform: uppercase;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
          transition: background 0.2s, color 0.2s;
        }
        .fw-btn-primary:hover { background: #dfff4f; }

        .fw-btn-outline {
          background: transparent;
          color: #c8ff00;
          border: 1px solid #c8ff00;
          padding: 13px 35px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          cursor: pointer;
          text-transform: uppercase;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          transition: all 0.2s;
        }
        .fw-btn-outline:hover { background: #c8ff0014; }

        .feature-card {
          border: 1px solid #141f14;
          border-left: 2px solid #1e3a1e;
          padding: 28px 24px;
          background: #070d07;
          transition: border-color 0.25s, background 0.25s;
          cursor: default;
        }
        .feature-card:hover {
          border-color: #2a5c2a;
          border-left-color: #00d97e;
          background: #090f09;
        }

        .dot-grid {
          background-image: radial-gradient(#1a2a1a 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* Top Bar */}
      <div style={{
        borderBottom: '1px solid #111d11',
        padding: '14px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px',
        color: '#3d5c3d',
        letterSpacing: '0.08em',
      }}>
        <span>FUTUREWISE_v2.1 // MARKET_SENTIMENT_TERMINAL</span>
        <span style={{ color: '#00d97e' }}>● LIVE</span>
      </div>

      <TickerBar />

      {/* Hero */}
      <div className="dot-grid" style={{ padding: '80px 40px 60px', position: 'relative', overflow: 'hidden' }}>

        {/* Big accent number */}
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '20px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '340px',
          color: '#0b150b',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>AI</div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'center', position: 'relative' }}>

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            style={{ flex: 1 }}
          >
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.16em',
              color: '#00d97e',
              textTransform: 'uppercase',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#00d97e' }}/>
              AI-Powered Market Intelligence
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(60px, 7vw, 92px)',
              lineHeight: 0.95,
              color: '#e8f5e8',
              marginBottom: '32px',
              letterSpacing: '0.02em',
            }}>
              KNOW WHAT<br/>
              THE MARKET<br/>
              <span style={{ color: '#c8ff00' }}>ACTUALLY<br/>FEELS</span>
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#6a8a6a',
              lineHeight: 1.75,
              maxWidth: '440px',
              marginBottom: '44px',
              fontWeight: 300,
            }}>
              Upload any stock screenshot and get a real-time sentiment verdict — built on live news, social signal, and AI analysis. Not another chart tool.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to={isSignedIn ? '/analyze' : '/pricing'}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="fw-btn-primary"
                >
                  {isSignedIn ? 'Open Terminal →' : 'Start Free →'}
                </motion.button>
              </Link>

              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#3d5c3d',
              }}>
                No credit card · Free tier available
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              gap: '40px',
              marginTop: '56px',
              paddingTop: '32px',
              borderTop: '1px solid #111d11',
            }}>
              {[
                { n: '94%', label: 'Sentiment accuracy' },
                { n: '< 3s', label: 'Analysis time' },
                { n: '12k+', label: 'Active investors' },
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '36px',
                    color: '#c8ff00',
                    lineHeight: 1,
                  }}>{stat.n}</div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    color: '#3d5c3d',
                    marginTop: '4px',
                    letterSpacing: '0.06em',
                  }}>{stat.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — terminal widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ flexShrink: 0 }}
          >
            <SentimentMeter />
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div style={{ padding: '0 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #1e3a1e, transparent)' }}/>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#00d97e',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              — Built different
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(40px, 5vw, 64px)',
              color: '#e8f5e8',
              lineHeight: 0.95,
              letterSpacing: '0.02em',
            }}>
              EVERY FEATURE<br/>HAS A REASON
            </h2>
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#2a3f2a',
            textAlign: 'right',
          }}>
            6 MODULES<br/>1 VERDICT
          </div>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1px',
          background: '#111d11',
          border: '1px solid #111d11',
        }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="feature-card"
            >
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#2a3f2a',
                marginBottom: '20px',
                letterSpacing: '0.1em',
              }}>
                {f.tag} /
              </div>
              <div style={{ marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#c8e8c8',
                marginBottom: '10px',
                letterSpacing: '0.02em',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#4d6a4d',
                lineHeight: 1.7,
                fontWeight: 300,
              }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {!isSignedIn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            margin: '0 40px 80px',
            border: '1px solid #1e3a1e',
            borderLeft: '3px solid #c8ff00',
            padding: '60px 56px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            background: '#070d07',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', right: '-10px', bottom: '-30px',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '160px', color: '#0b160b', lineHeight: 1,
            pointerEvents: 'none',
          }}>GO</div>

          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#00d97e',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              — Ready to stop guessing?
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 4vw, 52px)',
              color: '#e8f5e8',
              lineHeight: 0.95,
              letterSpacing: '0.02em',
              marginBottom: '14px',
            }}>
              JOIN 12,000+ INVESTORS<br/>WHO READ THE SIGNAL
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#4d6a4d',
              fontWeight: 300,
              maxWidth: '380px',
            }}>
              Free plan includes 5 sentiment scans per day. No card required.
            </p>
          </div>

          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="fw-btn-outline"
              >
                View Plans →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Footer strip */}
      <div style={{
        borderTop: '1px solid #111d11',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px',
        color: '#2a3f2a',
        letterSpacing: '0.08em',
      }}>
        <span>© 2025 FUTUREWISE — NOT FINANCIAL ADVICE</span>
        <span>BUILD_ID: fw-2.1.0</span>
      </div>
    </div>
  );
}