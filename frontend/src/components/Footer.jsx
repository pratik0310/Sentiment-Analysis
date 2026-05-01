// components/Footer.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Analyze', to: '/analyze' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
];

const SOCIALS = [
  {
    label: 'X / Twitter',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12.6 1.5h2.3L9.9 7.1 15.5 14.5H11L7.5 9.9 3.4 14.5H1.1L6.5 8.5 1.1 1.5H5.7L8.9 5.8 12.6 1.5ZM11.8 13.1H13L4.8 2.9H3.5L11.8 13.1Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="5.5" width="3" height="9.5" fill="currentColor"/>
        <circle cx="2.5" cy="2.5" r="1.5" fill="currentColor"/>
        <path d="M6 5.5H9V7C9.5 6 10.8 5.2 12.2 5.2C14.4 5.2 15 6.6 15 9V15H12V9.5C12 8.3 11.5 7.5 10.4 7.5C9.2 7.5 9 8.5 9 9.6V15H6V5.5Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M8 1C4.13 1 1 4.13 1 8C1 11.12 3.03 13.75 5.84 14.69C6.19 14.75 6.32 14.54 6.32 14.35C6.32 14.18 6.31 13.69 6.31 13.12C4.5 13.51 4.09 12.31 4.09 12.31C3.77 11.48 3.3 11.27 3.3 11.27C2.65 10.83 3.35 10.84 3.35 10.84C4.07 10.89 4.45 11.58 4.45 11.58C5.08 12.68 6.09 12.37 6.35 12.19C6.41 11.74 6.59 11.43 6.79 11.25C5.37 11.07 3.88 10.52 3.88 8.06C3.88 7.28 4.15 6.64 4.47 6.15C4.4 5.97 4.16 5.24 4.54 4.24C4.54 4.24 5.14 4.05 6.31 4.99C6.79 4.83 7.4 4.75 8 4.75C8.6 4.75 9.21 4.83 9.69 4.99C10.86 4.05 11.46 4.24 11.46 4.24C11.84 5.24 11.6 5.97 11.53 6.15C11.85 6.64 12.12 7.28 12.12 8.06C12.12 10.53 10.62 11.07 9.2 11.25C9.44 11.47 9.65 11.9 9.65 12.57C9.65 13.53 9.64 14.3 9.64 14.35C9.64 14.54 9.77 14.75 10.12 14.69C12.97 13.75 15 11.12 15 8C15 4.13 11.87 1 8 1Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="11.5" cy="4.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
];

function FooterLink({ to, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li style={{ marginBottom: '10px' }}>
      <Link
        to={to}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          letterSpacing: '0.06em',
          color: hovered ? '#c8ff00' : '#3d5c3d',
          textDecoration: 'none',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'color 0.2s',
        }}
      >
        <span style={{
          display: 'inline-block',
          width: hovered ? '16px' : '8px',
          height: '1px',
          background: hovered ? '#c8ff00' : '#2a3f2a',
          transition: 'width 0.2s, background 0.2s',
          flexShrink: 0,
        }}/>
        {children}
      </Link>
    </li>
  );
}

function SocialBtn({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={item.href}
      title={item.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        border: `1px solid ${hovered ? '#2a5c2a' : '#141f14'}`,
        color: hovered ? '#00d97e' : '#2a3f2a',
        background: hovered ? '#090f09' : 'transparent',
        transition: 'all 0.2s',
        textDecoration: 'none',
      }}
    >
      {item.icon}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  function handleSubscribe() {
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  }

  return (
    <footer style={{
      background: '#050905',
      borderTop: '1px solid #111d11',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');
        .fw-sub-btn {
          background: #c8ff00;
          color: #050905;
          border: none;
          padding: 0 20px;
          height: 40px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          flex-shrink: 0;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
          transition: background 0.15s;
        }
        .fw-sub-btn:hover { background: #dfff4f; }
        .fw-email-input {
          flex: 1;
          height: 40px;
          background: #070d07;
          border: 1px solid #141f14;
          border-right: none;
          color: #c8e8c8;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          padding: 0 14px;
          outline: none;
          min-width: 0;
          transition: border-color 0.2s;
        }
        .fw-email-input::placeholder { color: #2a3f2a; }
      `}</style>

      {/* Main footer grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 40px 48px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.6fr',
        gap: '48px',
      }}>

        {/* Brand column */}
        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '28px',
            letterSpacing: '0.08em',
            color: '#e8f5e8',
            marginBottom: '6px',
          }}>
            FUTUREWISE
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#2a3f2a',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
            Market Sentiment Terminal
          </div>

          <p style={{
            fontSize: '14px',
            color: '#4d6a4d',
            lineHeight: 1.75,
            fontWeight: 300,
            maxWidth: '280px',
            marginBottom: '32px',
          }}>
            AI sentiment analysis for stocks that actually moves fast enough to matter. Built for traders who read signals, not noise.
          </p>

          {/* Socials */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {SOCIALS.map((s, i) => <SocialBtn key={i} item={s} />)}
          </div>
        </div>

        {/* Navigation column */}
        <div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#2a3f2a',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '1px solid #111d11',
          }}>
            Navigate
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {NAV_LINKS.map((l) => (
              <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#2a3f2a',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '1px solid #111d11',
          }}>
            Contact
          </div>
          {[
            { label: 'EMAIL', value: 'support@futurewise.com' },
            { label: 'PHONE', value: '+1 (555) 123-4567' },
          ].map((c) => (
            <div key={c.label} style={{ marginBottom: '20px' }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#2a3f2a',
                letterSpacing: '0.1em',
                marginBottom: '5px',
              }}>
                {c.label}
              </div>
              <div style={{ fontSize: '13px', color: '#4d6a4d', fontWeight: 300 }}>
                {c.value}
              </div>
            </div>
          ))}

          <div style={{ marginTop: '28px' }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#2a3f2a',
              letterSpacing: '0.1em',
              marginBottom: '10px',
            }}>
              STATUS
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-block',
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: '#00d97e',
                boxShadow: '0 0 6px #00d97e88',
              }}/>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#00d97e',
                letterSpacing: '0.06em',
              }}>
                ALL SYSTEMS LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Newsletter column */}
        <div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#2a3f2a',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '1px solid #111d11',
          }}>
            Signal Feed
          </div>

          <p style={{
            fontSize: '13px',
            color: '#4d6a4d',
            lineHeight: 1.7,
            fontWeight: 300,
            marginBottom: '20px',
          }}>
            Weekly market sentiment digest. No spam — just the signal worth reading.
          </p>

          {submitted ? (
            <div style={{
              border: '1px solid #1e3a1e',
              borderLeft: '2px solid #00d97e',
              padding: '14px 18px',
              background: '#060d06',
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px',
                color: '#00d97e',
                letterSpacing: '0.06em',
              }}>
                ✓ SUBSCRIBED
              </div>
              <div style={{ fontSize: '12px', color: '#3d5c3d', marginTop: '4px' }}>
                First digest drops Friday.
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  className="fw-email-input"
                  style={{ borderColor: inputFocused ? '#2a5c2a' : '#141f14' }}
                />
                <button className="fw-sub-btn" onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#2a3f2a',
                letterSpacing: '0.06em',
              }}>
                // ZERO SPAM. UNSUBSCRIBE ANYTIME.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #0d180d',
        padding: '18px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: '#1e2e1e',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          © 2026 FUTUREWISE — NOT FINANCIAL ADVICE
        </span>

        <div style={{ display: 'flex', gap: '28px' }}>
          {['Privacy Policy', 'Terms of Use'].map((t) => (
            <a key={t} href="#" style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#1e2e1e',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => e.target.style.color = '#3d5c3d'}
            onMouseLeave={(e) => e.target.style.color = '#1e2e1e'}
            >
              {t}
            </a>
          ))}
        </div>

        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: '#1e2e1e',
          letterSpacing: '0.1em',
        }}>
          BUILD_ID: fw-2.1.0
        </span>
      </div>
    </footer>
  );
}