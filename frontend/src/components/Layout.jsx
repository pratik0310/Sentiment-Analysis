// components/Layout.jsx
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />
      <main style={{
        flex: 1,
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}