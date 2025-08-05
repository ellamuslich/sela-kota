import { useState, useEffect } from 'react';

// Add Google Fonts - Space Mono
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';
fontLink.rel = 'stylesheet';
if (!document.head.querySelector('link[href*="Space+Mono"]')) {
  document.head.appendChild(fontLink);
}

// Add targeted CSS reset to fix white corners without breaking scroll
const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    background-color: #FEFBEE;
    overflow-x: hidden;
  }
  
  #root {
    background-color: #FEFBEE;
  }
`;

// Add the styles to the document
if (!document.getElementById('global-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'global-styles';
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

export default function Homepage() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const fullText = "Add your story. Find a new one.\nDiscover Jakarta, in between.";

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isMacBookAir = windowWidth > 1024 && windowWidth <= 1440;
  const isDesktop = windowWidth > 1440;

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to first threshold (second section)
  const scrollToFirstSection = () => {
    const firstSectionY = window.innerHeight; // Scroll to one viewport height down
    window.scrollTo({
      top: firstSectionY,
      behavior: 'smooth'
    });
  };

  // Responsive scroll thresholds
  const getScrollThresholds = () => {
    if (isMobile) {
      return {
        markersThreshold: 900,
        humansThreshold: 1000,
        humansFadeStart: 1200
      };
    } else if (isTablet) {
      return {
        markersThreshold: 900,
        humansThreshold: 2000,
        humansFadeStart: 2000
      };
    } else if (isMacBookAir) {
      return {
        markersThreshold: 1000,
        humansThreshold: 1200,
        humansFadeStart: 1200
      };
    }
    return {
      markersThreshold: 1000,
      humansThreshold: 1600,
      humansFadeStart: 1600
    };
  };

  const { markersThreshold, humansThreshold, humansFadeStart } = getScrollThresholds();

  // Calculate cityscape size based on scroll - responsive version
  const getInitialScale = () => {
    if (isMobile || isTablet) {
      return 1.0; // Start at 100% for mobile and tablet
    }
    return 0.7; // Start at 70% for desktop
  };

  const getMaxScale = () => {
    if (isMobile || isTablet) {
      return 1.3; // Zoom to 130% for mobile and tablet
    }
    return 1.0; // Max 100% for desktop
  };

const cityscapeScale = Math.min(getInitialScale() + scrollY * 0.001, getMaxScale());
const cityscapeOpacity = Math.min(1 + scrollY * 0.001, 1);
  
  // Calculate different phases based on scroll
  const showMarkers = scrollY > markersThreshold;
  const showHumans = scrollY > humansThreshold;
  const cityscapeTransform = `translateX(-50%) scale(${cityscapeScale})`;
  
  // Calculate cityscape dissolution - starts fading when humans appear
  const cityscapeDisplayOpacity = showHumans ? Math.max(0, 1 - (scrollY - humansFadeStart) / 400) : cityscapeOpacity;
  
  // Responsive marker positions
  const getMarkers = () => {
    if (isMobile) {
      // Fewer markers for mobile, better positioned
      return [
        { id: 1, x: '19%', y: '3%', color: '#EBBDD9' },
        { id: 2, x: '33%', y: '40%', color: '#EBBDD9' },
        { id: 3, x: '60%', y: '34%', color: '#EBBDD9' },
        { id: 4, x: '80%', y: '-15%', color: '#EBBDD9' }
      ];
    } else if (isTablet) {
      return [
        { id: 1, x: '15%', y: '15%', color: '#EBBDD9' },
        { id: 2, x: '31%', y: '49%', color: '#EBBDD9' },
        { id: 3, x: '48.5%', y: '70%', color: '#EBBDD9' },
        { id: 4, x: '65%', y: '35%', color: '#EBBDD9' },
        { id: 5, x: '87%', y: '18%', color: '#EBBDD9' }
      ];
    }
    // Desktop (original)
    return [
      { id: 1, x: '5%', y: '58%', color: '#EBBDD9' },
      { id: 2, x: '17%', y: '15%', color: '#EBBDD9' },
      { id: 3, x: '31%', y: '55%', color: '#EBBDD9' },
      { id: 4, x: '48%', y: '70%', color: '#EBBDD9' },
      { id: 5, x: '60%', y: '42%', color: '#EBBDD9' },
      { id: 6, x: '73%', y: '36%', color: '#EBBDD9' },
      { id: 7, x: '92%', y: '20%', color: '#EBBDD9' }
    ];
  };

  const markers = getMarkers();

  //Responsive human illustrations
  const getHumanPositions = () => {
    if (isMobile) {
      return {
      human1: { left: '-15%', bottom: '20%', height: '260px' },
      human2: { left: '13%', bottom: '30%', height: '160px' },
      human3: { left: '35%', bottom: '10%', height: '180px' },
      human4: { left: '60%', bottom: '40%', height: '220px' }
    };
  } else if (isTablet) {
    return {
      human1: { left: '-10%', bottom: '4%', height: '380px' },
      human2: { left: '10%', bottom: '3%', height: '230px' },
      human3: { left: '47%', bottom: '5%', height: '260px' },
      human4: { left: '80%', bottom: '15%', height: '310px' }
    };
  } else if (isMacBookAir) {
    return {
      human1: { left: '-8%', bottom: '4%', height: '420px' },
      human2: { left: '13%', bottom: '3%', height: '250px' },
      human3: { left: '48%', bottom: '5%', height: '280px' },
      human4: { left: '80%', bottom: '15%', height: '350px' }
    };
  }
  // Desktop (original positions)
  return {
    human1: { left: '-8%', bottom: '4%', height: '500px' },
    human2: { left: '13%', bottom: '3%', height: '290px' },
    human3: { left: '48%', bottom: '5%', height: '320px' },
    human4: { left: '80%', bottom: '15%', height: '400px' }
  };
};

const humanPos = getHumanPositions();

  //Responsive scroll fade-in
  const getMarkerFadeSettings = () => {
    if (isMobile) {
      return {
        fadeStart: 2000,    // Markers start fading 500px after humans appear
        fadeDuration: 300  // Takes 300px to completely fade out
      };
    } else if (isTablet) {
      return {
        fadeStart: 900,    // Markers start fading 700px after humans appear  
        fadeDuration: 400  // Takes 400px to completely fade out
      };
    }
    // Desktop
    return {
      fadeStart: 900,      // Markers start fading 900px after humans appear
      fadeDuration: 500    // Takes 500px to completely fade out
    };
  };

  const markerFade = getMarkerFadeSettings();

  return (
    <div style={{
      fontFamily: 'Space Mono, monospace',
      position: 'relative',
      backgroundColor: '#FEFBEE',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      {/* Navigation Header */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: isMobile ? '30px 20px' : isTablet ? '30px 40px' : '40px 60px',
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-end',
        alignItems: 'center',
        backgroundColor: scrollY > 100 ? 'rgba(254, 251, 238, 0.9)' : 'transparent',
        backdropFilter: scrollY > 100 ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}>
        {/* Navigation Menu */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '20px' : '40px',
          alignItems: 'center',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          justifyContent: 'center'
        }}>
          <a 
            href="/" 
            style={{
              textDecoration: 'none',
              color: '#2c2c2c',
              fontSize: isMobile ? '14px' : '16px',
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
              fontSize: isMobile ? '14px' : '16px',
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
            href="https://instagram.com/sela__kota"
            target="_blank"
            rel="noopener noreferrer" 
            style={{
              textDecoration: 'none',
              color: '#2c2c2c',
              fontSize: isMobile ? '14px' : '16px',
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
        padding: isMobile ? '0 20px' : isTablet ? '0 30px' : '0 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Large Title */}
        <img 
          src="/Sela-kota-logo.svg" 
          alt="Sela Kota" 
          style={{ 
            width: isMobile ? '250px' : isTablet ? '280px' : '300px',
            marginBottom: isMobile ? '40px' : '60px',
            transform: `translateY(${scrollY * 0.1}px)`,
            transition: 'transform 0.1s ease-out',
            zIndex: 10,
            position: 'relative'
          }}
        />
        
        {/* Subtitle with Typewriter Animation */}
        <p style={{
          fontSize: isMobile ? '14px' : isTablet ? '16px' : '17px',
          fontFamily: 'Space Mono, monospace',
          fontWeight: '200',
          color: '#000000',
          margin: '0',
          lineHeight: '1.6',
          letterSpacing: '0px',
          maxWidth: isMobile ? '320px' : isTablet ? '500px' : '600px',
          marginBottom: isMobile ? '30px' : '40px',
          minHeight: isMobile ? '45px' : '54px',
          transform: `translateY(${scrollY * 0.05}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 10,
          position: 'relative',
          whiteSpace: 'pre-line'
        }}>
          {displayedText}
          <span style={{
            opacity: currentIndex < fullText.length ? 1 : 0,
            animation: currentIndex < fullText.length ? 'blink 1s infinite' : 'none',
            marginLeft: '2px'
          }}>|</span>
        </p>

        {/* Scroll Indicator with Arrow */}
        <div 
          onClick={scrollToFirstSection}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transform: `translateY(${scrollY * 0.03}px)`,
            zIndex: 10,
            position: 'relative',
            marginBottom: isMobile ? '80px' : isTablet ? '100px' : '120px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = `translateY(${scrollY * 0.03 - 5}px)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = `translateY(${scrollY * 0.03}px)`;
          }}
        >
          {/* Scroll down text */}
          <span style={{
            fontSize: isMobile ? '12px' : '14px',
            fontFamily: 'Space Mono, monospace',
            color: 'black',
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            Scroll to explore more!
          </span>
          
          {/* Custom SVG Button */}
          <img 
            src="/scroll-down-arrow.svg" 
            alt="Scroll Down" 
            style={{
              width: isMobile ? '32px' : '40px',
              height: isMobile ? '32px' : '40px',
              transition: 'transform 0.3s ease',
              animation: 'bounce 2s infinite'
            }}
          />
        </div>

        {/* Growing Jakarta Cityscape stuck to bottom - dissolves when humans appear */}
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '50%',
          transform: cityscapeTransform,
          transformOrigin: 'bottom center',
          opacity: cityscapeDisplayOpacity,
          transition: 'transform 0.3s ease-out, opacity 0.5s ease-out',
          width: '100%',
          maxWidth: isMobile ? '100%' : isTablet ? '900px' : isMacBookAir ? '1000px' : '1200px',
          zIndex: 1,
          pointerEvents: 'none'
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
          
          {/* Interactive Markers - also fade out with cityscape */}
          {showMarkers && markers.map((marker) => (
            <div
              key={marker.id}
              style={{
                position: 'absolute',
                left: marker.x,
                top: marker.y,
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '45px' : isTablet ? '55px' : '62px',
                height: isMobile ? '52px' : isTablet ? '62px' : '70px',
                cursor: 'pointer',
                pointerEvents: 'auto',
                zIndex: 10,
                opacity: (() => {
                  if (!showMarkers) return 0; // Don't show if markers shouldn't be visible yet
                  if (scrollY < markerFade.fadeStart) return 1; // Full opacity before fade starts

                  // Calculate fade
                  const fadeProgress = (scrollY - markerFade.fadeStart) / markerFade.fadeDuration;
                  return Math.max(0, 1 - fadeProgress); // Fade from 1 to 0
                })(),
                transition: 'opacity 0.5s ease, transform 0.3s ease',
                animation: showMarkers ? `fadeInMarker 0.8s ease ${marker.id * 0.1}s both` : 'none'
              }}
              onMouseEnter={() => setHoveredMarker(marker.id)}
              onMouseLeave={() => setHoveredMarker(null)}
              onClick={() => console.log(`Clicked marker ${marker.id}`)}
            >
              <img
                src="/pin-home.svg"
                alt="Location Pin"
                style={{
                  width: '100%',
                  height: '100%',
                  filter: hoveredMarker === marker.id ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3)) brightness(0.7)' : 'none',
                  transform: hoveredMarker === marker.id ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
          ))}
        </div>

        {/* Human Illustrations - appear after cityscape dissolves */}
        {showHumans && (
          <div style={{
            position: 'fixed',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center',
            width: '100%',
            maxWidth: isMobile ? '100%' : isTablet ? '900px' : isMacBookAir ? '1000px' : '1200px',
            height: isMobile ? '250px' : isTablet ? '320px' : isMacBookAir ? '380px' : '400px',
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            {/* Human 1 */}
            <img 
              src="/human-1.png" 
              alt="Person 1" 
              style={{
                position: 'absolute',
                bottom: humanPos.human1.bottom,
                left: humanPos.human1.left,
                height: humanPos.human1.height,
                width: 'auto',
                zIndex: 2,
                opacity: Math.min(1, Math.max(0, (scrollY - (humansFadeStart + 100)) / 200)),
                transform: `translateY(${Math.max(0, (humansFadeStart + 200) - scrollY) * 0.3}px)`,
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            />
            
            {/* Human 2 */}
            <img 
              src="/human-2.png" 
              alt="Person 2" 
              style={{
                position: 'absolute',
                bottom: humanPos.human2.bottom,
                left: humanPos.human2.left,
                height: humanPos.human2.height,
                width: 'auto',
                zIndex: 1,
                opacity: Math.min(1, Math.max(0, (scrollY - (humansFadeStart + 200)) / 200)),
                transform: `translateY(${Math.max(0, (humansFadeStart + 300) - scrollY) * 0.3}px)`,
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            />
            
            {/* Human 3 */}
            <img 
              src="/human-3.png" 
              alt="Person 3" 
              style={{
                position: 'absolute',
                bottom: humanPos.human3.bottom,
                left: humanPos.human3.left,
                height: humanPos.human3.height,
                width: 'auto',
                zIndex: 4,
                opacity: Math.min(1, Math.max(0, (scrollY - (humansFadeStart + 300)) / 200)),
                transform: `translateY(${Math.max(0, (humansFadeStart + 400) - scrollY) * 0.3}px)`,
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            />
            
            {/* Human 4 */}
            <img 
              src="/human-4.png" 
              alt="Person 4" 
              style={{
                position: 'absolute',
                bottom: humanPos.human4.bottom,
                left: humanPos.human4.left,
                height: humanPos.human4.height,
                width: 'auto',
                zIndex: 3,
                opacity: Math.min(1, Math.max(0, (scrollY - (humansFadeStart + 100)) / 200)),
                transform: `translateY(${Math.max(0, (humansFadeStart + 200) - scrollY) * 0.3}px)`,
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            />
          </div>
        )}

        {/* CSS Animation for marker fade in */}
        <style>
          {`
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
            
            @keyframes fadeInMarker {
              0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8) translateY(10px);
              }
              100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) translateY(0);
              }
            }
            
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-5px);
              }
              60% {
                transform: translateY(-3px);
              }
            }
          `}
        </style>

        {/* Subtle decorative elements - hide on mobile */}
        {!isMobile && (
          <>
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '2px',
              height: isTablet ? '80px' : '100px',
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
              width: isTablet ? '50px' : '60px',
              height: '2px',
              backgroundColor: '#ddd',
              opacity: '0.3',
              transform: `translateX(${scrollY * -0.1}px)`,
              transition: 'transform 0.1s ease-out',
              zIndex: 5
            }}></div>
          </>
        )}
      </section>

      {/* Second Section with New Text */}
      <section style={{
        backgroundColor: 'transparent',
        padding: isMobile ? '60px 20px 120px' : isTablet ? '80px 30px 160px' : '100px 40px 200px',
        position: 'relative',
        zIndex: 10,
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: isMobile ? '320px' : isTablet ? '600px' : '800px',
          margin: '0 auto',
          transform: `translateY(${Math.max(0, (scrollY - 300) * -0.1) - 100}px)`,
          opacity: Math.min(1, Math.max(0, (scrollY - 298) / 300)),
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
        }}>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: '1.8',
            color: '#2c2c2c',
            fontFamily: 'Space Mono, monospace',
            fontWeight: '400',
            marginBottom: '0'
          }}>
            Too often, Jakarta is defined by the hustle and bustle{isMobile ? ' ' : <br/>}
            — the concrete jungle, the noise, the blinding lights.{isMobile ? ' ' : <br/>}
            It's loud, fast, and always moving.
          </p>
        </div>
      </section>

      {/* Third Section with Interactive Map Text */}
      <section style={{
        backgroundColor: 'transparent',
        padding: isMobile ? '60px 20px 120px' : isTablet ? '80px 30px 160px' : '100px 40px 200px',
        position: 'relative',
        zIndex: 10,
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: isMobile ? '320px' : isTablet ? '500px' : '600px',
          margin: '0 auto',
          transform: `translateY(${Math.max(0, (scrollY - 800) * -0.1) - 100}px)`,
          opacity: Math.min(1, Math.max(0, (scrollY - 800) / 300)),
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
        }}>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: '1.8',
            color: '#2c2c2c',
            fontFamily: 'Space Mono, monospace',
            fontWeight: '400',
            marginBottom: '0'
          }}>
            But what happens in the pauses?{isMobile ? ' ' : <br/>}
            In the spaces we pass by, but rarely see?
          </p>
        </div>
      </section>

      {/* Fourth Section with Human Stories Text */}
      <section style={{
        backgroundColor: 'transparent',
        padding: isMobile ? '60px 20px 120px' : isTablet ? '80px 30px 160px' : '100px 40px 200px',
        position: 'relative',
        zIndex: 10,
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: isMobile ? '320px' : isTablet ? '500px' : '600px',
          margin: '0 auto',
          transform: `translateY(${Math.max(0, (scrollY - 1600) * -0.1) - 150}px)`,
          opacity: Math.min(1, Math.max(0, (scrollY - 1400) / 300)),
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
        }}>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: '1.8',
            color: '#2c2c2c',
            fontFamily: 'Space Mono, monospace',
            fontWeight: '400',
            marginBottom: '150px'
          }}>
            Meaning lives in the in-between. In a quiet warung, a glance
            {isMobile ? ' ' : isTablet ? ' ' : <br/>}
            between strangers, a balcony overlooking the sunset.
            {isMobile ? ' ' : isTablet ? ' ' : <br/>}
            sela kota exists to bring those overlooked spaces and feelings into view.
          </p>

          {/* Explore Button positioned right under the text */}
          <div style={{
            transform: `translateY(${Math.max(0, (scrollY - (isMobile ? 1200 : isTablet ? 1500 : isMacBookAir ? 1400 : 1700)) * -0.1) - 100}px)`,
            opacity: Math.min(1, Math.max(0, (scrollY - (isMobile ? 1200 : isTablet ? 1500 : isMacBookAir ? 1400 : 1700)) / 300)),
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
          }}>
            <a 
              href="/map"
              style={{
                display: 'inline-block',
                padding: isMobile ? '16px 32px' : '20px 40px',
                backgroundColor: '#2c2c2c',
                color: 'white',
                textDecoration: 'none',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '500',
                borderRadius: '60px',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
                fontFamily: 'Space Mono, monospace',
                zIndex: 10,
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#EBBDD9';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2c2c2c';
                e.target.style.transform = 'translateY(0px)';
              }}
            >
              {isMobile ? 'Explore Sela Kota' : 'Explore Sela Kota: Jakarta'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}