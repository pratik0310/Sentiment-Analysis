// components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', name: 'Home', icon: '' },
    { path: '/analyze', name: 'Analyze', icon: '' },
    { path: '/dashboard', name: 'Dashboard', icon: '' },
    { path: '/pricing', name: 'Pricing', icon: '' },
    { path: '/about', name: 'About', icon: '' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '10px 20px' : '20px 20px',
        backgroundColor: scrolled ? 'rgba(26, 26, 26, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Logo with animation */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'slideIn 0.5s ease',
            }}>
              <span style={{
                fontSize: '32px',
                animation: 'pulse 2s infinite',
              }}></span>
              <span style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                Future<span style={{ color: '#4a90e2' }}>Wise</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            gap: '30px',
            alignItems: 'center',
          }}>
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  color: location.pathname === link.path ? '#4a90e2' : '#fff',
                  fontSize: '16px',
                  fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  backgroundColor: location.pathname === link.path ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.backgroundColor = location.pathname === link.path ? 'rgba(74, 144, 226, 0.1)' : 'transparent';
                }}
              >
                <span>{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {/* User Section */}
            <div style={{
              marginLeft: '20px',
              animation: 'fadeIn 0.5s ease 0.6s both',
            }}>
              {isSignedIn ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <span style={{ color: '#fff' }}>
                    👋 {user.fullName || user.username}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  gap: '10px',
                }}>
                  <SignInButton mode="modal">
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      color: '#fff',
                      border: '1px solid #4a90e2',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4a90e2';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'scale(1)';
                    }}>
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: '#4a90e2',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#357abd';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4a90e2';
                      e.target.style.transform = 'scale(1)';
                    }}>
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div style={{ height: scrolled ? '70px' : '100px', transition: 'height 0.3s ease' }} />

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}