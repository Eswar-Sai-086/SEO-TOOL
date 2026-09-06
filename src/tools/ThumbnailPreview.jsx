import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Monitor, Smartphone } from 'lucide-react';

export default function ThumbnailPreview() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('My Awesome YouTube Video Title Goes Here');
  const [channelName, setChannelName] = useState('YouSEO Clone');
  const [views, setViews] = useState('1.2M views');
  const [time, setTime] = useState('2 days ago');
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop or mobile
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-8">
        <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
          <ImageIcon size={32} />
        </div>
        <div>
          <h1 className="card-title" style={{ fontSize: '28px', marginBottom: 0 }}>Thumbnail Preview</h1>
          <p className="card-subtitle">Test how your thumbnail and title will look on YouTube.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 className="card-title">Details</h3>
          
          <div className="form-group">
            <label className="form-label">Upload Thumbnail</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.02)',
                transition: 'border-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '12px', margin: '0 auto' }} />
              <p style={{ fontWeight: 500, marginBottom: '4px' }}>Click to upload image</p>
              <p className="card-subtitle">1280x720 recommended</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Video Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Channel Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Views</label>
              <input 
                type="text" 
                className="form-input" 
                value={views}
                onChange={(e) => setViews(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title" style={{ marginBottom: 0 }}>Preview</h3>
            <div className="flex gap-2">
              <button 
                className={`btn ${previewMode === 'desktop' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px' }}
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor size={16} /> Desktop
              </button>
              <button 
                className={`btn ${previewMode === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px' }}
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone size={16} /> Mobile
              </button>
            </div>
          </div>

          {/* YouTube Style Preview Card */}
          <div style={{
            backgroundColor: previewMode === 'desktop' ? 'transparent' : '#0f0f0f',
            padding: previewMode === 'desktop' ? '0' : '16px',
            borderRadius: previewMode === 'desktop' ? '0' : '24px',
            maxWidth: previewMode === 'desktop' ? '100%' : '320px',
            margin: '0 auto',
            border: previewMode === 'desktop' ? 'none' : '8px solid #2a2a2a',
            height: previewMode === 'desktop' ? 'auto' : '500px'
          }}>
            <div style={{ 
              width: '100%', 
              aspectRatio: '16/9', 
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '12px'
            }}>
              {image ? (
                <img src={image} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                  No Image Uploaded
                </div>
              )}
              <div style={{ 
                position: 'absolute', 
                bottom: '8px', 
                right: '8px', 
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '3px 4px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                10:05
              </div>
            </div>
            
            <div className="flex gap-3">
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--accent-primary)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {channelName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ 
                  fontSize: previewMode === 'desktop' ? '16px' : '14px', 
                  fontWeight: 500, 
                  color: '#fff',
                  lineHeight: '1.4',
                  marginBottom: '4px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {title}
                </h4>
                <div style={{ fontSize: '12px', color: '#aaa', display: 'flex', flexDirection: 'column' }}>
                  <span>{channelName}</span>
                  <span>{views} • {time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
