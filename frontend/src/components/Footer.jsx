// components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#2d2d2d',
      borderTop: '1px solid #444',
      padding: '40px 20px 20px',
      marginTop: '40px',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
      }}>
        {/* Company Info */}
        <div>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>FutureWise</h3>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            AI-powered stock sentiment analysis tool for smart investors.
            Make informed decisions with real-time market insights.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {['Home', 'Analyze', 'Dashboard', 'Pricing', 'About'].map((item) => (
              <li key={item} style={{ marginBottom: '10px' }}>
                <Link 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  style={{ 
                    color: '#aaa', 
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#4a90e2'}
                  onMouseLeave={(e) => e.target.style.color = '#aaa'}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Contact</h3>
          <p style={{ color: '#aaa', marginBottom: '10px' }}>📧 support@futurewise.com</p>
          <p style={{ color: '#aaa', marginBottom: '10px' }}>📱 +1 (555) 123-4567</p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            {['🐦', '💼', '📘', '📷'].map((icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  color: '#aaa',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#4a90e2';
                  e.target.style.transform = 'scale(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#aaa';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Newsletter</h3>
          <p style={{ color: '#aaa', marginBottom: '15px' }}>
            Get weekly market insights and updates
          </p>
          <div style={{ display: 'flex' }}>
            <input
              type="email"
              placeholder="Your email"
              style={{
                padding: '10px',
                border: '1px solid #444',
                borderRadius: '4px 0 0 4px',
                backgroundColor: '#333',
                color: '#fff',
                flex: 1,
              }}
            />
            <button
              style={{
                padding: '10px 15px',
                backgroundColor: '#4a90e2',
                color: '#fff',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#357abd'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4a90e2'}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid #444',
        marginTop: '40px',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#666',
      }}>
        <p>© 2026 FutureWise. All rights reserved.</p>
      </div>
    </footer>
  );
}