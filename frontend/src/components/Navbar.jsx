// components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { path: '/', name: 'Home' },
  { path: '/analyze', name: 'Analyze' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/about', name: 'About' },
];

function NavLink({ link, isActive }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  return (
    <Link
      to={link.path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: isActive ? '#c8ff00' : hovered ? '#7aaa7a' : '#3d5c3d',
        padding: '6px 0',
        position: 'relative',
        transition: 'color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {link.name}
      <span style={{
        display: 'block',
        height: '1px',
        background: isActive ? '#c8ff00' : '#3d5c3d',
        width: active ? '100%' : '0%',
        transition: 'width 0.25s ease',
      }}/>
    </Link>
  );
}

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signinHover, setSigninHover] = useState(false);
  const [signupHover, setSignupHover] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Bebas+Neue&display=swap');

        .fw-nav-hamburger {
          display: none;
          background: none;
          border: 1px solid #141f14;
          color: #3d5c3d;
          width: 36px;
          height: 36px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          transition: border-color 0.2s;
        }
        .fw-nav-hamburger:hover { border-color: #2a5c2a; }

        @media (max-width: 768px) {
          .fw-nav-links { display: none !important; }
          .fw-nav-user  { display: none !important; }
          .fw-nav-hamburger { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(5, 9, 5, 0.97)' : 'rgba(5, 9, 5, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? '#111d11' : 'transparent'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        {/* Top status line */}
        <div style={{
          borderBottom: '1px solid #0d180d',
          padding: '5px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#1e2e1e',
        }}>
          <span>FUTUREWISE_TERMINAL // SENTIMENT ENGINE v2.1</span>
          <span style={{ color: '#1a3a1a' }}>
            {new Date().toUTCString().replace('GMT', 'UTC')}
          </span>
        </div>

        {/* Main nav row */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '22px',
                letterSpacing: '0.1em',
                color: '#e8f5e8',
                lineHeight: 1,
              }}>
                FUTURE
              </span>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '22px',
                letterSpacing: '0.1em',
                color: '#c8ff00',
                lineHeight: 1,
              }}>
                WISE
              </span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                color: '#2a3f2a',
                letterSpacing: '0.1em',
                marginLeft: '2px',
                alignSelf: 'flex-end',
                paddingBottom: '2px',
              }}>
                v2.1
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div
            className="fw-nav-links"
            style={{ display: 'flex', gap: '32px', alignItems: 'center', flex: 1, justifyContent: 'center' }}
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                link={link}
                isActive={location.pathname === link.path}
              />
            ))}
          </div>

          {/* Auth section */}
          <div
            className="fw-nav-user"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}
          >
            {isSignedIn ? (
              <>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: '#2a3f2a',
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: '#00d97e',
                  }}/>
                  {(user.fullName || user.username || 'TRADER').toUpperCase()}
                </div>
                <div style={{
                  width: '1px', height: '20px',
                  background: '#111d11',
                }}/>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button
                    onMouseEnter={() => setSigninHover(true)}
                    onMouseLeave={() => setSigninHover(false)}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      color: signinHover ? '#7aaa7a' : '#3d5c3d',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px 0',
                      transition: 'color 0.2s',
                    }}
                  >
                    Sign In
                  </button>
                </SignInButton>

                <div style={{ width: '1px', height: '16px', background: '#111d11' }}/>

                <SignUpButton mode="modal">
                  <button
                    onMouseEnter={() => setSignupHover(true)}
                    onMouseLeave={() => setSignupHover(false)}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background: signupHover ? '#dfff4f' : '#c8ff00',
                      color: '#050905',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '7px 16px',
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
                      transition: 'background 0.15s',
                      fontWeight: 500,
                    }}
                  >
                    Get Access →
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="fw-nav-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <>
                <span style={{ width: '16px', height: '1px', background: '#3d5c3d', transform: 'rotate(45deg) translate(4px, 4px)', display: 'block' }}/>
                <span style={{ width: '16px', height: '1px', background: '#3d5c3d', transform: 'rotate(-45deg) translate(4px, -4px)', display: 'block' }}/>
              </>
            ) : (
              <>
                <span style={{ width: '16px', height: '1px', background: '#3d5c3d', display: 'block' }}/>
                <span style={{ width: '10px', height: '1px', background: '#3d5c3d', display: 'block' }}/>
                <span style={{ width: '16px', height: '1px', background: '#3d5c3d', display: 'block' }}/>
              </>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div style={{
            borderTop: '1px solid #111d11',
            background: '#050905',
            padding: '24px 40px 32px',
          }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'block',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: location.pathname === link.path ? '#c8ff00' : '#3d5c3d',
                  textDecoration: 'none',
                  padding: '14px 0',
                  borderBottom: '1px solid #0d180d',
                }}
              >
                {location.pathname === link.path ? '→ ' : '— '}{link.name}
              </Link>
            ))}

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              {isSignedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    color: '#2a3f2a',
                    letterSpacing: '0.1em',
                  }}>
                    {(user.fullName || user.username || 'TRADER').toUpperCase()}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      color: '#3d5c3d',
                      border: '1px solid #141f14',
                      padding: '10px 20px',
                      cursor: 'pointer',
                    }}>
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: '#c8ff00',
                      color: '#050905',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}>
                      Get Access →
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: '74px' }} />
    </>
  );
}