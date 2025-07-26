import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Custom scrollbar styles - to make it invisible
// This will hide the scrollbar for elements with the class 'custom-scrollbar'
// Note: This is a global style, so it will apply to all elements with this class
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = scrollbarStyles;
  document.head.appendChild(styleElement);
}

// Add Google Fonts import for Space Mono
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// ADD CLOUDINARY UPLOAD FUNCTION HERE:
const uploadToCloudinary = async (file) => {
  console.log('Uploading file:', file.name); // Debug log
  console.log('Cloud name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME); // Debug log
  console.log('Upload preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Debug log

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    console.log('Cloudinary response:', data); // Debug log
    
    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error('No secure_url in response:', data);
      throw new Error('Upload failed - no URL returned');
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// NEW: Guidelines Modal Component
function GuidelinesModal({ isOpen, onClose }) {

  //Responsive state - Guidelines Modal
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  //Responsive useEffect - Guidelines Modal
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Breakpoints - Guidelines Modal
  const isMobile = windowWidth <= 768;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: isMobile ? '20px' : '0'
    }}>
      <div 
        className="custom-scrollbar"
        style={{
          backgroundColor: '#FEFBEE',
          borderRadius: '20px',
          padding: isMobile ? '25px 15px' : '40px',    
          maxWidth: isMobile ? '350px' : '600px',      
          width: isMobile ? '350px' : '90%',           
          maxHeight: isMobile ? '70vh' : '80vh',
          overflow: 'auto',
          fontFamily: 'Space Mono, monospace',
          position: 'relative',
          scrollbarWidth: 'none'
        }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '25px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            color: '#6B7280'
          }}
        >
          ✕
        </button>

        {/* Header */}
        <h2 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#111827',
          lineHeight: '1.3'
        }}>
          Guidelines
        </h2>

        <div style={{ 
          fontSize: '14px', 
          lineHeight: '1.6',
          color: '#374151'
        }}>
          {/* Section 1 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 12px 0'
            }}>
              1. Breaches of Anonymity
            </h3>
            <div>
              Posts that contain names, phones numbers, email addresses, social media handles or anything that reveals the identity of the user will not be permitted.
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 12px 0'
            }}>
              2. Hate Speech
            </h3>
            <div>
              Any posts that degrade or threaten a group of people based on race, etnicity, citizenship, ability, age, gender, or class will not be permitted.
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 12px 0'
            }}>
              3. Spam/Advertising
            </h3>
            <div>
              We do not permit spam posts, or advertisements of any kind.
            </div>
          </div>
        </div>

        {/* Close button at bottom */}
        <div style={{ 
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              border: '1px solid #000000ff',
              backgroundColor: '#EBBDD9',
              color: 'black',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Space Mono, monospace',
              transition: 'background-color 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#D25E29';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#EBBDD9';
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

// NEW: Privacy Policy Modal Component
function PrivacyPolicyModal({ isOpen, onClose }) {
  
  //Responsive state
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  //Responsive useEffect
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Breakpoints
  const isMobile = windowWidth <= 768;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: isMobile ? '20px' : '0'
    }}>
      <div 
        className="custom-scrollbar"
        style={{
          backgroundColor: '#FEFBEE',
          borderRadius: '20px',
          padding: isMobile ? '30px 20px' : '40px',
          maxWidth: isMobile ? '100%' : '600px',
          width: '90%',
          maxHeight: isMobile ? '70vh' : '80vh',
          overflow: 'auto',
          fontFamily: 'Space Mono, monospace',
          position: 'relative',
          scrollbarWidth: 'none'
        }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '25px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            color: '#6B7280'
          }}
        >
          ✕
        </button>

        {/* Header */}
        <h2 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#111827',
          lineHeight: '1.3'
        }}>
          Privacy Policy
        </h2>

        <div style={{ 
          fontSize: '14px', 
          lineHeight: '1.6',
          color: '#374151'
        }}>
          {/* Section 1 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 12px 0'
            }}>
              1. Information We Collect
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <strong>User Content:</strong> Users may voluntarily provide User Content, such as personal stories, experiences, and other content, in text format.
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Location Data:</strong> Users may voluntarily select a location on the map where they would like their User Content to appear. We do not collect information about users' actual location.
            </div>
            <div>
              <strong>Time Data:</strong> We collect the time that a user's submission is made. This is so that we can organize submissions chronologically in our database.
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 12px 0'
            }}>
              2. Use of Information
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <strong>Platform Functionality:</strong> We use the information collected to provide and improve the functionality of Sela Kota, allowing users to share and explore urban experiences.
            </div>
            <div>
              <strong>Research and Dissemination:</strong> We may analyze and use aggregated, non-personal data for research and artistic purposes to enhance the platform's overall experience and mission.
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 12px 0'
            }}>
              3. Disclosure of Information
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <strong>Anonymity:</strong> Users contribute anonymously if they choose not to associate their contributions with identifiable information. Users cannot create accounts, so no usernames, passwords, phone numbers, email addresses or social media handles are associated with contributions. We moderate all contributions for breaches of anonymity.
            </div>
            <div>
              <strong>Legal Compliance:</strong> We may disclose information in response to legal processes or when required to comply with applicable laws, regulations, or government requests.
            </div>
          </div>

          {/* Section 4 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 12px 0'
            }}>
              4. Third-Party Services
            </h3>
            <div>
              Sela Kota may use third-party services for analytics, hosting, and other functionalities. These services may have their own privacy policies, and users are encouraged to review them.
            </div>
          </div>

          {/* Section 5 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 12px 0'
            }}>
              5. Security
            </h3>
            <div>
              We implement reasonable measures to protect the information we collect from unauthorized access, disclosure, or alteration. However, no data transmission over the internet is entirely secure, and we cannot guarantee absolute security.
            </div>
          </div>
        </div>

        {/* Close button at bottom */}
        <div style={{ 
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              border: '1px solid #000000ff',
              backgroundColor: '#EBBDD9',
              color: 'black',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Space Mono, monospace',
              transition: 'background-color 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#D25E29';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#EBBDD9';
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

// Story Form Component (unchanged)
function StoryForm({ isOpen, onClose, onSave, location }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  //Responsive State-Story Form
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  //Responsive useEffect-Story Form
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Breakpoint-Story Form
  const isMobile = windowWidth <= 768;

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      return isValidType && isValidSize;
    });

    // Create preview URLs for the files
    const filesWithPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      name: file.name,
      id: Date.now() + Math.random()
    }));

    setMediaFiles(prev => [...prev, ...filesWithPreviews]);
  };

  const removeFile = (fileId) => {
    setMediaFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleSave = async () => {
    if (title.trim() && content.trim() && category && !isLoading) {
      setIsLoading(true); // Start loading
      try {
        // Upload all media files to Cloudinary first
        const uploadedMediaFiles = await Promise.all(
          mediaFiles.map(async (media) => {
            const cloudinaryUrl = await uploadToCloudinary(media.file);
            return {
              type: media.type,
              name: media.name,
              url: cloudinaryUrl // Permanent Cloudinary URL
            };
          })
        );

        onSave({
          title: title.trim(),
          content: content.trim(),
          category,
          latitude: location.lat,
          longitude: location.lng,
          timestamp: new Date().toISOString(),
          mediaFiles: uploadedMediaFiles, // Now using permanent URLs
          id: Date.now() + Math.random()
        });

        // Reset form
        setTitle('');
        setContent('');
        setCategory('');
        setMediaFiles([]);
        onClose();
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error uploading files. Please try again.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: isMobile ? '20px' : '0'
    }}>
      <div style={{
        backgroundColor: '#EBE8D8',
        borderRadius: '40px',
        padding: isMobile ? '25px 20px' : '30px',
        maxWidth: isMobile ? '100%' : '400px',   
        width: '90%',
        maxHeight: isMobile ? '70vh' : '80vh',
        overflow: 'auto',
        fontFamily: 'Space Mono, monospace'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>
          Add Your Story
        </h3>
        

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            Give the place a name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name this place..."
            style={{
              width: '93%',
              padding: '12px',
              border: '1px solid #000000ff',
              borderRadius: '12px',
              fontSize: '12px',
              fontFamily: 'Space Mono, monospace',
              outline: 'none',
              backgroundColor: '#FEFBEE',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            Tell us what you're feeling!
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #000000ff',
              borderRadius: '12px',
              fontSize: '12px',
              fontFamily: 'Space Mono, monospace',
              outline: 'none',
              backgroundColor: '#FEFBEE',
              color: category ? '#000' : '#8c8c8cff',
            }}
          >
            <option value="" disabled>Select feelings...</option>
            <option value="tranquil">Tranquil</option>
            <option value="grounded">Grounded</option>
            <option value="happy">Happy</option>
            <option value="energised">Energised</option>
            <option value="curious">Curious</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            Your Story
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience, memory, or insight about this place..."
            rows={4}
            style={{
              width: '94%',
              padding: '12px',
              border: '1px solid #000000ff',
              borderRadius: '12px',
              fontSize: '12px',
              fontFamily: 'Space Mono, monospace',
              outline: 'none',
              resize: 'vertical',
              backgroundColor: '#FEFBEE',
            }}
          />
        </div>

        {/* Media Upload Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            Add Photos or Videos (optional)
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px dashed #000000ff',
              backgroundColor: '#715623',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Space Mono, monospace',
              cursor: 'pointer',
              color: '#ffffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#000000ff';
              e.target.style.backgroundColor = '#D25E29';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#000000ff';
              e.target.style.backgroundColor = '#715623';
            }}
          >
            Choose Photos or Videos
          </button>
          
          <p style={{ 
            fontSize: '10px', 
            color: '#787567ff', 
            margin: '8px 0 0 0',
            textAlign: 'center'
          }}>
            Max 50MB per file • Images and videos supported
          </p>

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div style={{ 
              marginTop: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '8px'
            }}>
              {mediaFiles.map((media) => (
                <div key={media.id} style={{ 
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  aspectRatio: '1'
                }}>
                  {media.type === 'image' ? (
                    <img 
                      src={media.preview} 
                      alt="Preview" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  ) : (
                    <video 
                      src={media.preview} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                      muted
                    />
                  )}
                  
                  <button
                    onClick={() => removeFile(media.id)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                  
                  {media.type === 'video' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      fontSize: '10px'
                    }}>
                      ▶
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: '#DCD7C6',
              color: '#727272ff',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Space Mono, monospace'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim() || !category || isLoading}
            style={{
              padding: '12px 24px',
              border: '1px solid #000000ff',
              backgroundColor: (title.trim() && content.trim() && category && !isLoading) ? '#EBBDD9' : '#a9a094ff',
              color: 'black',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (title.trim() && content.trim() && category && !isLoading) ? 'pointer' : 'not-allowed',
              fontFamily: 'Space Mono, monospace',
              transition: 'background-color 0.3s ease-in-out, transform 0.2s ease',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (title.trim() && content.trim() && category && !isLoading) {
                e.target.style.backgroundColor = '#D25E29';
              }
            }}
            onMouseLeave={(e) => {
              if (title.trim() && content.trim() && category && !isLoading) {
                e.target.style.backgroundColor = '#EBBDD9';
              }
            }}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Individual Story Viewer Component
function IndividualStoryViewer({ isOpen, onClose, story }) {
  const [locationName, setLocationName] = useState('Loading location...');

  // Responsive State - Individual Story Viewer
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Responsive useEffect - Individual Story Viewer
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoint - Individual Story Viewer
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${story.lat}&lon=${story.lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.display_name) {
          // Extract the most relevant part of the address
          const parts = data.display_name.split(',');
          const relevantParts = parts.slice(0, 2).join(', '); // First 2 parts usually most relevant
          setLocationName(relevantParts || data.display_name);
        } else {
          setLocationName(`${story.lat.toFixed(4)}, ${story.lng.toFixed(4)}`);
        }
      } catch (error) {
        console.error('Error fetching location name:', error);
        setLocationName(`${story.lat.toFixed(4)}, ${story.lng.toFixed(4)}`);
      }
    };

    if (story) {
      fetchLocationName();
    }
  }, [story]);

  if (!isOpen || !story) return null;

  const getCategoryText = (category) => {
    const categories = {
      tranquil: 'Tranquil',
      grounded: 'Grounded',
      happy: 'Happy',
      energised: 'Energised',
      curious: 'Curious'
    };
    return categories[category] || 'Unknown';
  };

  const getCategoryColor = (category) => {
    const colors = {
      tranquil: '#9DA2C0',
      grounded: '#715623',
      happy: '#F59E0B',
      energised: '#D25E29',
      curious: '#EBBDD9'
    };
    return colors[category] || '#6B7280';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: isMobile ? '20px' : '0'
    }}>
      <div 
        className="custom-scrollbar"
        style={{
          backgroundColor: '#FEFBEE',
          borderRadius: '20px',
          padding: isMobile ? '25px 20px' : '30px',
          maxWidth: isMobile ? '100%' : '500px', 
          width: '90%',
          maxHeight: isMobile ? '70vh' : '80vh',
          overflow: 'auto',
          fontFamily: 'Space Mono, monospace',
          position: 'relative',
          scrollbarWidth: 'none'
        }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '25px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            color: '#6B7280'
          }}
        >
          ✕
        </button>

        {/* Category badge */}
        <div style={{
          display: 'inline-block',
          backgroundColor: getCategoryColor(story.category),
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          {getCategoryText(story.category)}
        </div>

        {/* Story title */}
        <h2 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#111827',
          lineHeight: '1.3'
        }}>
          {story.title}
        </h2>

        {/* Story content */}
        <p style={{ 
          margin: '0 0 20px 0', 
          fontSize: '16px', 
          lineHeight: '1.6',
          color: '#374151'
        }}>
          {story.content}
        </p>
        
        {/* Media Display */}
        {story.mediaFiles && story.mediaFiles.length > 0 && (
          <div style={{ 
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: story.mediaFiles.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            {story.mediaFiles.map((media, index) => (
              <div key={index} style={{ 
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6',
                aspectRatio: story.mediaFiles.length === 1 ? 'auto' : '1',
                maxHeight: story.mediaFiles.length === 1 ? '500px' : 'auto'
              }}>
                {media.type === 'image' ? (
                  <img 
                    src={media.url} 
                    alt={`Media ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.open(media.url, '_blank')}
                  />
                ) : (
                  <video 
                    src={media.url} 
                    controls
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer with Timestamp and Location */}
        <div style={{ 
          borderTop: '1px solid #E5E7EB',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '16px'
        }}>
          {/* Location Details */}
          <div style={{ 
            fontSize: '12px', 
            color: '#6B7280',
            textAlign: 'left',
            lineHeight: '1.3'
          }}>
            <div>
              {locationName}
            </div>
          </div>
          
          {/* Timestamp */}
          <div style={{ 
            fontSize: '12px', 
            color: '#6B7280',
            textAlign: 'right',
          }}>
            {new Date(story.created_at).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated Search Bar Component
function AnimatedSearchBar({ 
  onSearch, 
  onSelectLocation, 
  searchResults, 
  isSearching,
  placeholder = "Search Sela Kota Jakarta" 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');

  //Responsive state search bar
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  //Responsive useEffect search bar
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Breakpoint for search bar
   const isMobile = windowWidth <= 768;

  // Handle clicks outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        inputValue === ""
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Search when input changes
  useEffect(() => {
    onSearch(inputValue);
  }, [inputValue, onSearch]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSelectResult = (result) => {
    setInputValue('');
    setIsExpanded(false);
    onSelectLocation(result);
  };

  const handleClear = () => {
    setInputValue('');
    setIsExpanded(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  //Search icon positioning
  return (
    <div ref={containerRef} style={{
        position: 'absolute',
        top: isMobile ? '20px' : '20px',
        left: isMobile ? '15px' : '20px',
        zIndex: 1001,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)', // Background blur effect
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        borderRadius: '25px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        width: isMobile ? '45px' : (isExpanded ? '320px' : '50px'),
        height: isMobile ? '45px' : '50px', 
        transition: 'width 0.3s ease-in-out',
        overflow: 'hidden'
      }}>
        {/* Search Icon */}
        <button
          type="button"
          onClick={handleExpand}
          style={{
            width: isMobile ? '100%' : (isExpanded ? '50px' : '100%'),
            height: isMobile ? '45px' : '50px',
            height: '50px',
            border: 'none',
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'black',
            flexShrink: 0
          }}
        >
          <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>

        {/* Search Input - hide on mobile when expanded separately */}
        {!isMobile && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            style={{
              border: 'none',
              outline: 'none',
              background: 'none',
              flex: 1,
              fontSize: isMobile ? '16px' : '14px',
              color: '#111827',
              fontFamily: 'Space Mono, monospace',
              opacity: isExpanded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              paddingRight: '40px'
            }}
          />
        )}

        {/* Clear Button */}
        {!isMobile && isExpanded && inputValue && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              width: '20px',
              height: '20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Mobile expanded input - shows below the search icon */}
      {isMobile && isExpanded && (
        <div style={{
          position: 'absolute',
          top: '55px', // Below the search icon
          left: '0',
          right: '0',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '12px',
          zIndex: 1002,
          width: '200px'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search Sela Kota..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'none',
              width: '100%',
              fontSize: '12px',
              color: '#111827',
              fontFamily: 'Space Mono, monospace'
            }}
          />
        </div>
      )}

      {/* Search Results Dropdown */}
      {isExpanded && (inputValue.trim() !== '') && (
        <div 
          className="custom-scrollbar"
          style={{
          position: 'absolute',
          top: isMobile ? '115px' : '60px',
          left: '0',
          right: '0',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(10px)', // Background blur effect
          WebkitBackdropFilter: 'blur(10px)', // Safari support
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1002,
          scrollbarWidth: 'none',
          width: isMobile ? '220px' : 'auto',
        }}>
           {isSearching && searchResults.length === 0 && (
            <div style={{
              padding: '12px 16px',
              color: '#6B7280',
              fontSize: isMobile ? '12px' : '14px',
              fontFamily: 'Space Mono, monospace'
            }}>
              Searching...
            </div>
          )}
          
          {searchResults.length > 0 && searchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleSelectResult(result)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: index < searchResults.length - 1 ? '1px solid #F3F4F6' : 'none',
                fontSize: '14px',
                position: 'relative'
              }}
            >
              <div style={{ fontWeight: '600', color: '#111827', fontFamily: 'Space Mono, monospace' }}>
                {result.display_name.split(',')[0]}
              </div>
              <div style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px', fontFamily: 'Space Mono, monospace' }}>
                {result.display_name}
              </div>
            </div>
          ))}
          
          {!isSearching && searchResults.length === 0 && inputValue.trim() !== '' && (
            <div style={{
              padding: '12px 16px',
              color: '#6B7280',
              fontSize: '14px',
              fontFamily: 'Space Mono, monospace'
            }}>
              No results found in Jakarta
            </div>
          )}
        </div>
      )}
    </div>
  );
}

//Expandable Instruction Panel Component
function ExpandableInstructionPanel({ onFilterChange, activeFilters, onPrivacyPolicyClick, onGuidelinesClick }) {
  const [isExpanded, setIsExpanded] = useState(true);

  //Responsive State
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  //Responsive useEffect
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Breakpoint for panel
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  const emotions = [
    { key: 'tranquil', label: 'Tranquil', color: '#9DA2C0' },
    { key: 'grounded', label: 'Grounded', color: '#715623' },
    { key: 'happy', label: 'Happy', color: '#F59E0B' },
    { key: 'energised', label: 'Energised', color: '#D25E29' },
    { key: 'curious', label: 'Curious', color: '#EBBDD9' }
  ];

  const handleEmotionClick = (emotionKey) => {
    onFilterChange(emotionKey);
  };

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: isMobile ? '20px' : '30px',
      left: isMobile ? '15px' : '30px',
      zIndex: 1000,
      fontFamily: 'Space Mono, monospace'
    }}>
      {/* Expanded Panel */}
      {isExpanded && (
        <div style={{
          backgroundColor: 'black',
          borderRadius: isMobile ? '25px' : '40px',
          padding: isMobile ? '20px 15px' : isTablet ? '28x 25x' :'30px',
          width: isMobile ? '320px' : isTablet ? '380px' : '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          marginBottom: '5px',
          position: 'relative'
        }}>
          {/* Close Button */}
          <button
            onClick={togglePanel}
            style={{
              position: 'absolute',
              top: '20px',
              right: '25px',
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕
          </button>

          {/* Main Heading */}
          <h2 style={{
            color: 'white',
            fontSize:isMobile ? '16px' : '18px',
            fontWeight: '700',
            margin: '0 0 6px 0',
            lineHeight: '1.3'
          }}>
            Add Your Stories
          </h2>

          {/* Subtext */}
          <p style={{
            color: 'white',
            fontSize: isMobile ? '12px' : '14px',
            margin: '0 0 20px 0',
            lineHeight: '1.4'
          }}>
            Click anywhere on the map to share your experience and discover Sela Kota!
          </p>

          {/* Divider Line */}
          <div style={{
            height: '0.25px',
            backgroundColor: 'white',
            margin: isMobile ? '0 0 15px 0' : '0 0 25px 0'
          }} />

          {/* Explore by emotion heading */}
          <h3 style={{
            color: 'white',
            fontSize:'16px',
            fontWeight: '600',
            margin: '0 0 15px 0'
          }}>
            Explore by emotion!
          </h3>

          {/* Emotion Filter Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '6px' : '12px',
            marginBottom: isMobile ? '20px' : '30px'
          }}>
            {emotions.map((emotion) => (
              <button
                key={emotion.key}
                onClick={() => handleEmotionClick(emotion.key)}
                style={{
                  backgroundColor: activeFilters.includes(emotion.key) ? emotion.color : 'transparent',
                  border: `2px solid ${emotion.color}`,
                  color: activeFilters.includes(emotion.key) ? 'black' : emotion.color,
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '200',
                  cursor: 'pointer',
                  fontFamily: 'Space Mono, monospace',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!activeFilters.includes(emotion.key)) {
                    e.target.style.backgroundColor = emotion.color;
                    e.target.style.color = 'black';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!activeFilters.includes(emotion.key)) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = emotion.color;
                  }
                }}
              >
                {emotion.label}
              </button>
            ))}
          </div>

          {/* Bottom section with divider */}
          <div style={{
            height: '0.25px',
            backgroundColor: 'white',
            margin: '0 0 20px 0'
          }} />

          {/* Bottom links */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>

            {/* Links */}
            <div style={{
              display: 'flex',
              gap: '20px'
            }}>
              <button
                onClick={onGuidelinesClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontFamily: 'Space Mono, monospace',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer',
                  padding: 0
                }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
              >
                Guidelines
              </button>
              <button
                onClick={onPrivacyPolicyClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontFamily: 'Space Mono, monospace',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer',
                  padding: 0
                }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
              >
                Privacy policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed State - Just the Logo Button */}
      {!isExpanded && (
        <button
          onClick={togglePanel}
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'black',
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.backgroundColor = '#EBBDD9';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'black';
          }}
        >
          <img 
            src="/asterisk.svg" 
            alt="Logo"
            style={{
              width: '24px',
              height: '24px',
              filter: 'brightness(0) invert(1)' // Makes the SVG white
            }}
          />
        </button>
      )}
    </div>
  );
}

export default function Map() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  
  // Story-related state
  const [userStories, setUserStories] = useState([]);
  const [storyMarkers, setStoryMarkers] = useState([]);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  // NEW: Emotion filter state
  const [emotionFilters, setEmotionFilters] = useState([]);

  // NEW: Guidelines state
  const [showGuidelines, setShowGuidelines] = useState(false);

  // NEW: Privacy Policy state
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  //Responsive state
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // API functions
  const fetchStories = async () => {
    try {
      const response = await fetch('https://sela-kota-backend.onrender.com/api/stories');
      const stories = await response.json();

      // Map database columns to React code expectations
      const mappedStories = stories.map(story => ({
        ...story,
        lat: story.latitude,   // Map latitude -> lat
        lng: story.longitude   // Map longitude -> lng
      }));

      setUserStories(mappedStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const saveStoryToAPI = async (story) => {
    try {
      const response = await fetch('https://sela-kota-backend.onrender.com/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(story)
      });
      
      const result = await response.json();
      console.log('Story saved:', result);
      
      // Refresh stories from database
      fetchStories();
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  //Responsive useEffect
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Breakpoint Definition
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: '/sela-kota-basic.json',
      center: [106.8272, -6.1754],
      zoom: 15,
      minZoom: 10,
      maxZoom: 17,
      maxBounds: [
        [106.65, -6.35],
        [107.05, -6.05],
      ],
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    // Click handler for adding stories anywhere on the map
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      // Check if click is very close to an existing story (within small radius)
      const clickedStory = userStories.find(story => {
        const distance = Math.sqrt(
          Math.pow(story.lat - lat, 2) + Math.pow(story.lng - lng, 2)
        );
        return distance < 0.0005; // Very small radius for individual story detection
      });
      
      if (clickedStory) {
        // Show individual story
        setSelectedStory(clickedStory);
        setShowStoryViewer(true);
      } else {
        // Remove existing search marker when clicking elsewhere
        if (currentMarker) {
          currentMarker.remove();
          setCurrentMarker(null);
        }
        
        // Add new story at this location
        setSelectedLocation({ lat, lng });
        setShowStoryForm(true);
      }
    });

    mapRef.current = map;

    // Fetch initial stories from API
    fetchStories();

    return () => map.remove();
  }, []);

  // NEW: Filter handler function
  const handleFilterChange = (emotionKey) => {
    setEmotionFilters(prev => {
      if (prev.includes(emotionKey)) {
        // Remove filter if already active
        return prev.filter(filter => filter !== emotionKey);
      } else {
        // Add filter if not active
        return [...prev, emotionKey];
      }
    });
  };

  // NEW: Guidelines handler
  const handleGuidelinesClick = () => {
    setShowGuidelines(true);
  };

  // NEW: Privacy Policy handler
  const handlePrivacyPolicyClick = () => {
    setShowPrivacyPolicy(true);
  };

  // UPDATED: Story markers with filtering
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing story markers
    storyMarkers.forEach(marker => marker.remove());

    // Filter stories based on active emotion filters
    const filteredStories = emotionFilters.length === 0 
      ? userStories 
      : userStories.filter(story => emotionFilters.includes(story.category));

    // Add new story markers with custom SVG (only for filtered stories)
    const newMarkers = filteredStories.map(story => {
      const el = document.createElement('div');

      // Category-based SVG files
      const categorySVGs = {
        tranquil: '/pin-blue.svg',
        grounded: '/pin-green.svg',
        happy: '/pin-yellow.svg',
        energised: '/pin-orange.svg',
        curious: '/pin-pink.svg'
      };

      const svgFile = categorySVGs[story.category] || '/pin-orange.svg';
      
      const markerSize = isMobile ? '50px' : '60px';
      el.style.width = markerSize;
      el.style.height = markerSize;
      el.style.backgroundImage = `url(${svgFile})`;
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
      el.style.cursor = 'pointer';
      el.style.filter = 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.0))';
      el.style.transition = 'transform 0.1s ease';

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([story.lng, story.lat])
        .addTo(mapRef.current);

      // Click handler to show individual story
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedStory(story);
        setShowStoryViewer(true);
      });

      return marker;
    });

    setStoryMarkers(newMarkers);
  }, [userStories, emotionFilters]); // Added emotionFilters dependency

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&bounded=1&viewbox=106.65,-6.05,107.05,-6.35&countrycodes=id`
      );
      
      const data = await response.json();
      
      const filteredResults = data.filter(result => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        return lat >= -6.35 && lat <= -6.05 && lon >= 106.65 && lon <= 107.05;
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    // Remove existing marker
    if (currentMarker) {
      currentMarker.remove();
    }
    
    // Create custom marker element
    const el = document.createElement('div');
    const markerSize = isMobile ? '50px' : '60px';
    el.style.width = markerSize;
    el.style.height = markerSize;
    el.style.backgroundImage = 'url(/pin-icon.svg)';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
    el.style.cursor = 'pointer';
    el.style.zIndex = '1000';
    el.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.0))';
  
    console.log('Custom marker element with SVG:', el);
  
    // Create marker with explicit options
    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat([lon, lat])
      .addTo(mapRef.current);
    
    setCurrentMarker(marker);
    
    // Fly to location
    mapRef.current.flyTo({
      center: [lon, lat],
      zoom: 15,
      duration: 1000
    });

    // Clear search results after selecting location
    setSearchResults([]);
  };

  // Save story handler that preserves map position
  const handleSaveStory = (story) => {
    // Add story to local state immediately (optimistic update)
    const newStory = {
      ...story,
      id: Date.now(), // Temporary ID
      created_at: new Date().toISOString(),
      lat: story.latitude,
      lng: story.longitude
    };
    
    setUserStories(prev => [newStory, ...prev]); // Add immediately
    
    // Then save to database in background
    saveStoryToAPI(story);

    // Store current map center and zoom before saving
    const currentCenter = mapRef.current.getCenter();
    const currentZoom = mapRef.current.getZoom();
    
    saveStoryToAPI(story);
    
    // Ensure map stays at the story location after saving
    setTimeout(() => {
      if (mapRef.current && selectedLocation) {
        mapRef.current.setCenter([selectedLocation.lng, selectedLocation.lat]);
        mapRef.current.setZoom(currentZoom);
      }
    }, 100);
    
    console.log('Story saved:', story); // For debugging
  };

  // Close handler for individual story viewer
  const handleCloseStoryViewer = () => {
    setShowStoryViewer(false);
    setSelectedStory(null);
  };

  // Close handler for story form that preserves location
  const handleCloseStoryForm = () => {
    setShowStoryForm(false);
    // Keep the map centered on the selected location when closing without saving
    if (mapRef.current && selectedLocation) {
      setTimeout(() => {
        mapRef.current.setCenter([selectedLocation.lng, selectedLocation.lat]);
      }, 100);
    }
  };

  // Debounced search
  const debouncedSearch = useRef(null);
  const handleSearchDebounced = (query) => {
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }
    debouncedSearch.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: isMobile ? '100svh' : '100vh', overflow: 'hidden' }}>
      <AnimatedSearchBar
        onSearch={handleSearchDebounced}
        onSelectLocation={handleSelectLocation}
        searchResults={searchResults}
        isSearching={isSearching}
      />

      {/* Navigation Header */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: isMobile ? '20px 20px' : isTablet ? '25px 30px' : '28px 35.5px',
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1000
      }}>
      {/* Navigation Menu with rounded background */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '25px',
        backdropFilter: 'blur(10px)', // Background blur effect
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        padding: isMobile ? '10px 20px' : '12px 24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: isMobile ? '20px' : '40px',
        alignItems: 'center',
        flexWrap: isMobile ? 'wrap' : 'nowrap', // ADDED
        justifyContent: 'center' // ADDED
      }}>
          <Link 
            to="/" 
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
            Home
          </Link>
          <Link 
            to="/map" 
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
          </Link>

          <a 
            href="https://instagram.com/sela__kota"
            target="_blank"
            rel="noopener noreferrer" 
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
            Instagram
          </a>
        </div>
      </nav>
      
      <div ref={mapContainer} style={{ width: '100%', height: isMobile ? '100svh' : '100vh', overflow: 'hidden' }} />

      {/* NEW: Expandable Instruction Panel with Privacy Policy and Guidelines handlers */}
      <ExpandableInstructionPanel
        onFilterChange={handleFilterChange}
        activeFilters={emotionFilters}
        onPrivacyPolicyClick={handlePrivacyPolicyClick}
        onGuidelinesClick={handleGuidelinesClick}
      />

      {/* Story Form Modal */}
      <StoryForm
        isOpen={showStoryForm}
        onClose={handleCloseStoryForm}
        onSave={handleSaveStory}
        location={selectedLocation}
      />

      {/* Individual Story Viewer Modal */}
      <IndividualStoryViewer
        isOpen={showStoryViewer}
        onClose={handleCloseStoryViewer}
        story={selectedStory}
      />

      {/* NEW: Guidelines Modal */}
      <GuidelinesModal
        isOpen={showGuidelines}
        onClose={() => setShowGuidelines(false)}
      />

      {/* NEW: Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
    </div>
  );
}