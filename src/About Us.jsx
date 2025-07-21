import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FEFBEE',
      fontFamily: 'Space Mono, monospace',
      padding: '100px 40px 40px 40px'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '40px 60px 20px 40px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: '#2c2c2c',
            fontSize: '16px',
            fontWeight: '400',
            transition: 'opacity 0.3s ease'
          }}>
            Home
          </Link>
          <Link to="/about" style={{
            textDecoration: 'none',
            color: '#2c2c2c',
            fontSize: '16px',
            fontWeight: '400',
            transition: 'opacity 0.3s ease'
          }}>
            About us
          </Link>
          <a href="https://www.instagram.com/yourusername" target="_blank" rel="noopener noreferrer" style={{
            textDecoration: 'none',
            color: '#2c2c2c',
            fontSize: '16px',
            fontWeight: '400',
            transition: 'opacity 0.3s ease'
          }}>
            Instagram
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1>About Us</h1>
        <p>Your about us content here...</p>
      </div>
    </div>
  );
}