import { useState, useEffect } from 'react';

// Add Google Fonts - Space Mono
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';
fontLink.rel = 'stylesheet';
if (!document.head.querySelector('link[href*="Space+Mono"]')) {
  document.head.appendChild(fontLink);
}

export default function Homepage() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const fullText = "Add your story. Find a new one.\nDiscover Jakarta, in between.";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Adjust speed here (lower = faster)

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate cityscape size based on scroll
  const cityscapeScale = Math.min(0.7 + scrollY * 0.001, 1.25); // Grows from 1x to 2.5x
  const cityscapeOpacity = Math.min(1 + scrollY * 0.001, 1); // Fades in from 0.3 to 1

  return (
    <div style={{
      fontFamily: 'Space Mono, monospace',
      position: 'relative',
      backgroundColor: '#FEFBEE', // Add the beige background to the main container
      minHeight: '100vh'
    }}>
      {/* Navigation Header */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '40px 60px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: scrollY > 100 ? 'rgba(254, 251, 238, 0.9)' : 'transparent',
        backdropFilter: scrollY > 100 ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}>
        {/* Navigation Menu */}
        <div style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center'
        }}>
          <a 
            href="/" 
            style={{
              textDecoration: 'none',
              color: '#2c2c2c',
              fontSize: '16px',
              fontWeight: '400',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.6'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Home
          </a>
          <a 
            href="/map" 
            style={{
              textDecoration: 'none',
              color: '#2c2c2c',
              fontSize: '16px',
              fontWeight: '400',
              fontFamily: 'Space Mono, monospace',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.6'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Map
          </a>
          <a 
            href="#about" 
            style={{
              textDecoration: 'none',
              color: '#2c2c2c',
              fontSize: '16px',
              fontWeight: '400',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.6'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            About us
          </a>
          <a 
            href="https://instagram.com/sela__kota"
            target="_blank"
            rel="noopener noreferrer" 
            style={{
              textDecoration: 'none',
              color: '#2c2c2c',
              fontSize: '16px',
              fontWeight: '400',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.6'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Instagram
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        backgroundColor: '#FEFBEE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Large Title */}
        <img 
          src="/Sela-kota-logo.svg" 
          alt="Sela Kota" 
          style={{ 
            width: '300px', 
            marginBottom: '60px',
            transform: `translateY(${scrollY * 0.1}px)`,
            transition: 'transform 0.1s ease-out',
            zIndex: 10,
            position: 'relative'
          }}
        />
        
        {/* Subtitle with Typewriter Animation */}
        <p style={{
          fontSize: '17px',
          fontFamily: 'Space Mono, monospace',
          fontWeight: '200',
          color: '#000000',
          margin: '0',
          lineHeight: '1.6',
          letterSpacing: '0px',
          maxWidth: '600px',
          marginBottom: '40px',
          minHeight: '54px',
          transform: `translateY(${scrollY * 0.05}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 10,
          position: 'relative',
          whiteSpace: 'pre-line'  // ← ADD THIS LINE
        }}>
          {displayedText}
          <span style={{
            opacity: currentIndex < fullText.length ? 1 : 0,
            animation: currentIndex < fullText.length ? 'blink 1s infinite' : 'none',
            marginLeft: '2px'
          }}>|</span>
        </p>

        {/* CSS Animation for blinking cursor */}
        <style>
          {`
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          `}
        </style>

        {/* Call to Action Button */}
        <a 
          href="/map"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            backgroundColor: '#2c2c2c',
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            borderRadius: '30px',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px',
            fontFamily: 'Space Mono, monospace',
            transform: `translateY(${scrollY * 0.03}px)`,
            zIndex: 10,
            position: 'relative',
            marginBottom: '120px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#EBBDD9';
            e.target.style.transform = `translateY(${scrollY * 0.03 - 2}px)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#000000';
            e.target.style.transform = `translateY(${scrollY * 0.03}px)`;
          }}
        >
          Explore Sela Kota Jakarta
        </a>

        {/* Growing Jakarta Cityscape stuck to bottom */}
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '50%',
          transform: `translateX(-50%) scale(${cityscapeScale})`,
          transformOrigin: 'bottom center',
          opacity: cityscapeOpacity,
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
          width: '100%',
          maxWidth: '1200px',
          zIndex: 1,
          pointerEvents: 'none' // Allows clicking through the image
        }}>
          <img 
            src="/jakarta-cityscape.png" 
            alt="Jakarta Cityscape" 
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        {/* Subtle decorative elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '2px',
          height: '100px',
          backgroundColor: '#ddd',
          opacity: '0.3',
          transform: `translateY(${scrollY * 0.2}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 5
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '60px',
          height: '2px',
          backgroundColor: '#ddd',
          opacity: '0.3',
          transform: `translateX(${scrollY * -0.1}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 5
        }}></div>
      </section>

      {/* Second Section with New Text - Transparent background */}
      <section style={{
        backgroundColor: 'transparent', // Changed from '#FEFBEE' to transparent
        padding: '100px 40px 200px',
        position: 'relative',
        zIndex: 10,
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          transform: `translateY(${Math.max(0, (scrollY - 300) * -0.1) - 100}px)`,
          opacity: Math.min(1, Math.max(0, (scrollY - 298) / 300)),
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
        }}>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#2c2c2c',
            fontFamily: 'Space Mono, monospace',
            fontWeight: '400',
            marginBottom: '0'
          }}>
            Too often, Jakarta is defined by the hustle and bustle<br/>
            — the concrete jungle, the noise, the blinding lights.<br/>
            It's loud, fast, and always moving.
          </p>
        </div>
      </section>
    </div>
  );
}