// pages/About.jsx
import { motion } from 'framer-motion';

const TEAM = [
  {
    id: 'ACH',
    name: 'Alex Chen',
    role: 'CEO & Founder',
    bio: '10+ years in fintech and AI. Built two exits before FutureWise.',
    tag: 'T-01',
  },
  {
    id: 'SJN',
    name: 'Sarah Johnson',
    role: 'Head of AI',
    bio: 'PhD in Machine Learning. Former research lead at DeepMind.',
    tag: 'T-02',
  },
  {
    id: 'MPT',
    name: 'Mike Patel',
    role: 'Lead Engineer',
    bio: 'Ex-Google L6. Obsessed with sub-100ms latency at scale.',
    tag: 'T-03',
  },
  {
    id: 'PSN',
    name: 'Priya Singh',
    role: 'Product Manager',
    bio: 'Fintech product specialist. Ships fast, cuts scope faster.',
    tag: 'T-04',
  },
];

const PILLARS = [
  {
    tag: '01',
    title: 'Our Mission',
    desc: 'To hand every retail investor the same AI-grade signal infrastructure that hedge funds pay millions for.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="10" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <circle cx="13" cy="13" r="5" stroke="#00d97e" strokeWidth="1" fill="none" opacity="0.5"/>
        <circle cx="13" cy="13" r="2" fill="#c8ff00"/>
        <line x1="13" y1="3" x2="13" y2="8" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="13" y1="18" x2="13" y2="23" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="3" y1="13" x2="8" y2="13" stroke="#00d97e" strokeWidth="1.5"/>
        <line x1="18" y1="13" x2="23" y2="13" stroke="#00d97e" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    tag: '02',
    title: 'Our Vision',
    desc: 'A market where signal beats noise — where every investor, regardless of capital, reads the room correctly.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <ellipse cx="13" cy="13" rx="10" ry="5" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <circle cx="13" cy="13" r="2.5" fill="#c8ff00"/>
        <line x1="5" y1="8" x2="21" y2="8" stroke="#00d97e" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4"/>
        <line x1="5" y1="18" x2="21" y2="18" stroke="#00d97e" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4"/>
      </svg>
    ),
  },
  {
    tag: '03',
    title: 'Our Values',
    desc: 'Radical transparency in how we score. No black boxes. You see the data, the weights, the verdict.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="3" y="3" width="20" height="20" rx="2" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
        <polyline points="7,13 11,17 19,9" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
];

const STATS = [
  { n: '50K+', label: 'Active Users' },
  { n: '1M+',  label: 'Scans run' },
  { n: '98%',  label: 'Uptime SLA' },
  { n: '24/7', label: 'Live data' },
];

export default function About() {
  return (
    <div style={{
      background: '#050905',
      minHeight: '100vh',
      color: '#d4e8d4',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

        .about-card {
          border: 1px solid #141f14;
          border-left: 2px solid #1e3a1e;
          padding: 28px 24px;
          background: #070d07;
          transition: border-color 0.25s, background 0.25s;
        }
        .about-card:hover {
          border-color: #2a5c2a;
          border-left-color: #00d97e;
          background: #090f09;
        }

        .team-card {
          border: 1px solid #141f14;
          padding: 32px 24px;
          background: #070d07;
          transition: border-color 0.25s, background 0.25s;
          position: relative;
          overflow: hidden;
        }
        .team-card:hover {
          border-color: #2a5c2a;
          background: #090f09;
        }
        .team-card:hover .team-id {
          color: #c8ff00;
        }

        .dot-grid {
          background-image: radial-gradient(#1a2a1a 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .stat-block {
          padding: 32px 24px;
          border-right: 1px solid #111d11;
          text-align: center;
        }
        .stat-block:last-child { border-right: none; }
      `}</style>

      {/* Top bar */}
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
        <span>FUTUREWISE_v2.1 // ABOUT_MODULE</span>
        <span style={{ color: '#00d97e' }}>● LIVE</span>
      </div>

      {/* Hero */}
      <div className="dot-grid" style={{ padding: '72px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          right: '-10px',
          top: '10px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '300px',
          color: '#0b150b',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>US</div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
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
              Who We Are
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(56px, 7vw, 88px)',
              lineHeight: 0.95,
              color: '#e8f5e8',
              marginBottom: '28px',
              letterSpacing: '0.02em',
            }}>
              BUILT BY TRADERS<br/>
              <span style={{ color: '#c8ff00' }}>FOR TRADERS</span>
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#6a8a6a',
              lineHeight: 1.75,
              maxWidth: '520px',
              fontWeight: 300,
            }}>
              We got tired of reacting to yesterday's news. So we built FutureWise — a real-time AI sentiment engine that reads the market before it moves.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ padding: '0 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #1e3a1e, transparent)' }}/>
        </div>
      </div>

      {/* Mission / Vision / Values */}
      <div style={{ padding: '72px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#00d97e',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>— Core principles</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 4vw, 56px)',
              color: '#e8f5e8',
              lineHeight: 0.95,
              letterSpacing: '0.02em',
            }}>
              WHAT WE<br/>STAND FOR
            </h2>
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#2a3f2a',
            textAlign: 'right',
          }}>3 PILLARS<br/>1 PURPOSE</div>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1px',
          background: '#111d11',
          border: '1px solid #111d11',
        }}>
          {PILLARS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="about-card"
            >
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#2a3f2a',
                marginBottom: '20px',
                letterSpacing: '0.1em',
              }}>{p.tag} /</div>
              <div style={{ marginBottom: '16px' }}>{p.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#c8e8c8', marginBottom: '10px', letterSpacing: '0.02em' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#4d6a4d', lineHeight: 1.7, fontWeight: 300 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ padding: '0 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #1e3a1e, transparent)' }}/>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ padding: '0 40px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid #111d11',
          borderTop: 'none',
        }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              className="stat-block"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '42px',
                color: '#c8ff00',
                lineHeight: 1,
              }}>{s.n}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#3d5c3d',
                marginTop: '6px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ padding: '72px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#00d97e',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>— The operators</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 4vw, 56px)',
              color: '#e8f5e8',
              lineHeight: 0.95,
              letterSpacing: '0.02em',
            }}>
              MEET THE<br/>SIGNAL TEAM
            </h2>
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#2a3f2a',
            textAlign: 'right',
          }}>4 HUMANS<br/>∞ CAFFEINE</div>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1px',
          background: '#111d11',
          border: '1px solid #111d11',
        }}>
          {TEAM.map((m, i) => (
            <motion.div
              key={i}
              className="team-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* BG accent */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-10px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '80px',
                color: '#0c150c',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}>{m.id}</div>

              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#2a3f2a',
                marginBottom: '20px',
                letterSpacing: '0.1em',
              }} className="team-id">{m.tag} /</div>

              {/* Avatar placeholder — initials */}
              <div style={{
                width: '52px',
                height: '52px',
                border: '1px solid #1e3a1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '14px',
                color: '#00d97e',
                marginBottom: '20px',
                letterSpacing: '0.08em',
                background: '#060d06',
              }}>{m.id}</div>

              <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#c8e8c8', marginBottom: '6px', letterSpacing: '0.02em' }}>
                {m.name}
              </h3>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#c8ff00',
                marginBottom: '14px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>{m.role}</div>
              <p style={{ fontSize: '13px', color: '#4d6a4d', lineHeight: 1.7, fontWeight: 300 }}>
                {m.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

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