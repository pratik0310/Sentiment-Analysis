// components/Layout.jsx
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050905',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Subtle dot-grid ambient background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'radial-gradient(#0f1f0f 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
      }}/>

      {/* Vignette edges */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 60%, #020602 100%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}/>

      <Navbar />

      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 40px',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box',
      }}>
        {children}
      </main>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </div>
  );
}