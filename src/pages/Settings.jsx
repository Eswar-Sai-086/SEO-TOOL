import { useState, useEffect } from 'react';
import { Key, Save, CheckCircle } from 'lucide-react';
import { getKeys, saveKeys } from '../lib/api';

export default function Settings() {
  const [youtubeKey, setYoutubeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const keys = getKeys();
    setYoutubeKey(keys.youtube === 'your_youtube_api_key_here' ? '' : keys.youtube);
    setGeminiKey(keys.gemini === 'your_gemini_api_key_here' ? '' : keys.gemini);
  }, []);

  const handleSave = () => {
    saveKeys(youtubeKey, geminiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="content-area" style={{ marginTop: '-20px' }}>
      <div className="mb-8" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">Settings & API Keys</h1>
        <p className="page-subtitle">Configure your API keys to enable real-time YouTube data and AI generation.</p>
      </div>

      <div className="main-card" style={{ maxWidth: '800px' }}>
        <div className="card-content">
          <div className="section-divider">
            <span>API CONFIGURATION</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Gemini Key */}
            <div>
              <div className="form-group">
                <label className="form-label">Google Gemini API Key (Required for AI)</label>
                <div className="input-wrapper">
                  <Key size={18} className="left-icon" />
                  <input 
                    type="password" 
                    className="form-input has-icon" 
                    placeholder="AIzaSy..." 
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                  />
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Get your free key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-red)', textDecoration: 'underline' }}>Google AI Studio</a>.
              </p>
            </div>

            {/* YouTube Key */}
            <div>
              <div className="form-group">
                <label className="form-label">YouTube Data API v3 Key (Required for SEO Analysis)</label>
                <div className="input-wrapper">
                  <Key size={18} className="left-icon" />
                  <input 
                    type="password" 
                    className="form-input has-icon" 
                    placeholder="AIzaSy..." 
                    value={youtubeKey}
                    onChange={(e) => setYoutubeKey(e.target.value)}
                  />
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Get your free key from the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-red)', textDecoration: 'underline' }}>Google Cloud Console</a>.
              </p>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                className="btn-primary-large" 
                style={{ width: 'auto', marginBottom: 0 }}
                onClick={handleSave}
              >
                <Save size={18} /> Save Keys
              </button>
              
              {saved && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}>
                  <CheckCircle size={18} /> Keys saved securely to your browser!
                </span>
              )}
            </div>
            
            <div className="info-box" style={{ marginTop: '16px', marginBottom: 0 }}>
              <div className="info-text">
                Your keys are stored <strong>locally in your browser</strong> using localStorage. They are never sent to any server other than directly to Google's APIs.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
