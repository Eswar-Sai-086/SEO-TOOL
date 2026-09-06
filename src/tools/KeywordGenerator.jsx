import { useState } from 'react';
import { PlaySquare, Smartphone, Clipboard, ChevronDown, Sun, Sparkles, Info, RefreshCw } from 'lucide-react';
import { generateKeywords } from '../lib/api';

export default function KeywordGenerator() {
  const [format, setFormat] = useState('video');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or keyword.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const data = await generateKeywords(topic, language);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTopic(text);
    } catch (err) {
      console.log('Failed to read clipboard', err);
    }
  };

  return (
    <div className="content-area" style={{ marginTop: '-20px' }}>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="page-title">Video Keyword Generator</h1>
          <p className="page-subtitle">Discover keyword ideas with YouSEO AI-estimated interest, competition & reach.</p>
        </div>
        
        <div className="toggle-group mt-2">
          <button 
            className={`toggle-btn ${format === 'video' ? 'active' : 'inactive'}`}
            onClick={() => setFormat('video')}
          >
            <PlaySquare size={16} fill={format === 'video' ? 'currentColor' : 'none'} /> Video
          </button>
          <button 
            className={`toggle-btn ${format === 'shorts' ? 'active' : 'inactive'}`}
            onClick={() => setFormat('shorts')}
          >
            <Smartphone size={16} fill={format === 'shorts' ? 'currentColor' : 'none'} /> Shorts
          </button>
        </div>
      </div>

      <div className="main-card mb-8">
        <div className="card-content">
          <div className="section-divider">
            <span>CONFIGURE YOUR SEARCH</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Video Topic or Keywords <span>- any text except links/URLs · be specific for better results</span>
              </label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Yoga Tips for Beginners at Home" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button className="btn-paste" onClick={handlePaste}>
                  <Clipboard size={14} /> Paste
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Language</label>
              <select 
                className="custom-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English (US)</option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>

          <div className="accordion">
            <div className="accordion-left">
              <div className="accordion-icon">
                <Sun size={24} strokeWidth={1.5} />
              </div>
              <div>
                <div className="accordion-title">Do you have target keywords?</div>
                <div className="accordion-subtitle">Optional · Refine keyword targeting</div>
              </div>
            </div>
            <ChevronDown size={20} color="var(--text-muted)" />
          </div>

          {error && <div className="mb-4" style={{ color: 'var(--primary-red)' }}>{error}</div>}

          <button 
            className="btn-primary-large" 
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} fill="currentColor" />
            )}
            {loading ? 'Generating...' : 'Get Keywords for Video'}
          </button>

          {!results.length && !loading && (
            <>
              <div className="info-box">
                <div className="info-icon">
                  <Info size={20} />
                </div>
                <div className="info-text">
                  <strong>Pro tip:</strong> Use 3-5 word phrases that match what viewers actually search. Longer, specific titles often outperform single-word keywords.
                </div>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-number">1</div>
                  <div className="feature-title">Enter your topic</div>
                  <div className="feature-desc">
                    Type your video title, niche, or any topic you want to create content about. The more specific, the better your keywords.
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-number">2</div>
                  <div className="feature-title">Pick your language</div>
                  <div className="feature-desc">
                    Choose the language your target audience speaks. YouSEO generates keywords in 10+ languages for maximum global reach.
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-number">3</div>
                  <div className="feature-title">Get ranked keywords</div>
                  <div className="feature-desc">
                    Instantly receive AI-ranked keywords with search volume, competition level, and potential views - ready to copy and use.
                  </div>
                </div>
              </div>
            </>
          )}

          {results.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <div className="section-divider">
                <span>AI-GENERATED RESULTS</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <th style={{ padding: '12px' }}>Keyword</th>
                    <th style={{ padding: '12px' }}>Search Volume</th>
                    <th style={{ padding: '12px' }}>Competition</th>
                    <th style={{ padding: '12px' }}>SEO Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 500 }}>{res.keyword}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ 
                          backgroundColor: res.searchVolume === 'High' ? '#dcfce7' : res.searchVolume === 'Medium' ? '#fef9c3' : '#fee2e2',
                          color: res.searchVolume === 'High' ? '#15803d' : res.searchVolume === 'Medium' ? '#a16207' : '#b91c1c',
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                        }}>
                          {res.searchVolume}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ 
                          backgroundColor: res.competition === 'Low' ? '#dcfce7' : res.competition === 'Medium' ? '#fef9c3' : '#fee2e2',
                          color: res.competition === 'Low' ? '#15803d' : res.competition === 'Medium' ? '#a16207' : '#b91c1c',
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                        }}>
                          {res.competition}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${res.score}%`, 
                              backgroundColor: res.score >= 70 ? 'var(--primary-red)' : '#fbbf24' 
                            }}></div>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{res.score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
