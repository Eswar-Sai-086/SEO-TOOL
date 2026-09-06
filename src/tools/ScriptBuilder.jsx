import { useState } from 'react';
import { Clipboard, Info, Sparkles, Video, Smartphone, ChevronDown, Search, Edit } from 'lucide-react';
import { generateScript } from '../lib/api';

export default function ScriptBuilder() {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('video'); // 'video' or 'shorts'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState('🇮🇳 తెలుగు (te)');
  const [duration, setDuration] = useState('5-10 minutes');
  const [videoType, setVideoType] = useState('Educational');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a video topic or keywords.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await generateScript(topic, language, format, duration, videoType);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate script.');
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    '🇬🇧 English (en)',
    '🇻🇳 Tiếng Việt (vi)',
    '🇵🇭 Filipino (fil)',
    '🇰🇷 한국어 (ko)',
    '🇯🇵 日本語 (ja)',
    '🇹🇷 Türkçe (tr)',
    '🇮🇳 தமிழ் (ta)',
    '🇮🇳 తెలుగు (te)',
    '🇧🇩 বাংলা (bn)',
    '🇳🇬 Hausa (ha)'
  ];

  return (
    <div className="content-area" style={{ marginTop: '-20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', maxWidth: '1200px' }}>
        <div>
          <h1 className="page-title">Video Script Generator</h1>
          <p className="page-subtitle" style={{ maxWidth: '700px' }}>
            Generate engaging, SEO-friendly video scripts in seconds - with structured intros, hooks, and CTAs written by YouSEO AI for your topic.
          </p>
        </div>
        
        <div style={{ display: 'flex', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '4px' }}>
          <button 
            onClick={() => setFormat('video')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px',
              backgroundColor: format === 'video' ? '#ef4444' : 'transparent',
              color: format === 'video' ? 'white' : 'var(--text-main)',
              fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer'
            }}
          >
            <Video size={16} fill={format === 'video' ? "currentColor" : "none"} /> Video
          </button>
          <button 
            onClick={() => setFormat('shorts')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px',
              backgroundColor: format === 'shorts' ? '#ef4444' : 'transparent',
              color: format === 'shorts' ? 'white' : 'var(--text-main)',
              fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer'
            }}
          >
            <Smartphone size={16} fill={format === 'shorts' ? "currentColor" : "none"} /> Shorts
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '380px 1fr' : '1fr', gap: '32px', alignItems: 'start', maxWidth: result ? '100%' : '600px' }}>
        {/* Left Side (Form) */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative', padding: '32px', paddingBottom: '24px' }}>
          {/* Yellow top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#fbbf24', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}></div>

          <div className="section-divider" style={{ marginBottom: '24px' }}>
            <span>CONFIGURE YOUR SCRIPT</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                Video Title or Topic <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>- any text except links/URLs · be specific for better results</span>
              </label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. What happens if we Electric" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{ paddingRight: '100px' }}
                />
                <button 
                  className="btn-paste" 
                  style={{ right: '12px' }} 
                  onClick={async () => { try { setTopic(await navigator.clipboard.readText()); } catch(e){} }}
                >
                  <Clipboard size={14} /> Paste
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                Target Language
              </label>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ 
                    width: '100%', padding: '14px 16px', backgroundColor: 'white', border: '1px solid var(--border-color)', 
                    borderRadius: '12px', fontSize: '14px', color: 'var(--text-main)', display: 'flex', 
                    justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                  }}
                >
                  <span>{language}</span>
                  <ChevronDown size={16} color="var(--text-muted)" />
                </button>
                
                {isDropdownOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 10, padding: '8px' }}>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {languages.map(lang => (
                        <div 
                          key={lang}
                          onClick={() => { setLanguage(lang); setIsDropdownOpen(false); }}
                          style={{ padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', backgroundColor: lang === language ? '#f3f4f6' : 'transparent' }}
                        >
                          {lang}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Video Duration
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ 
                      width: '100%', padding: '14px 16px', backgroundColor: 'white', border: '1px solid var(--border-color)', 
                      borderRadius: '12px', fontSize: '14px', color: 'var(--text-main)', appearance: 'none', cursor: 'pointer'
                    }}
                  >
                    <option>Under 5 minutes</option>
                    <option>5-10 minutes</option>
                    <option>10-20 minutes</option>
                    <option>20+ minutes</option>
                  </select>
                  <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Video Type
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={videoType} 
                    onChange={(e) => setVideoType(e.target.value)}
                    style={{ 
                      width: '100%', padding: '14px 16px', backgroundColor: 'white', border: '1px solid var(--border-color)', 
                      borderRadius: '12px', fontSize: '14px', color: 'var(--text-main)', appearance: 'none', cursor: 'pointer'
                    }}
                  >
                    <option>Educational</option>
                    <option>Entertainment</option>
                    <option>Tutorial</option>
                    <option>Review</option>
                    <option>Vlog</option>
                    <option>Gaming</option>
                  </select>
                  <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

          <button 
            onClick={handleGenerate}
            disabled={loading}
            style={{ 
              width: '100%', padding: '16px', backgroundColor: '#f87171', color: 'white', 
              borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: 'none', 
              cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              marginBottom: '24px', opacity: loading ? 0.7 : 1, transition: 'background-color 0.2s'
            }}
          >
            {loading ? <Sparkles size={18} className="animate-spin" /> : <Sparkles size={18} fill="currentColor" />}
            {loading ? 'Generating Script...' : 'Generate Video Script'}
          </button>

          <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', border: '1px solid #dbeafe' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#3b82f6', marginTop: '2px' }}>
              <Info size={14} />
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#1e3a8a', margin: 0 }}>
              <span style={{ fontWeight: 600 }}>Pro tip:</span> The first 30 seconds of your script determine whether viewers stay or leave. Always open with a bold hook that states the value - then deliver on the promise throughout.
            </p>
          </div>
        </div>

        {/* Right Side (Results) */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Dark Scoreboard */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '24px', padding: '32px', color: 'white', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ backgroundColor: '#3b82f6', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', opacity: 0.9 }}>CHARACTERS</div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>{result.characters.toLocaleString()}</div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.1 }}></div>
              </div>
              
              <div style={{ backgroundColor: '#ef4444', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', opacity: 0.9 }}>READ-ALOUD TIME</div>
                <div style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{result.readTime}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>From generated output</div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.1 }}></div>
              </div>
              
              <div style={{ backgroundColor: '#f59e0b', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', opacity: 0.9 }}>SECTIONS</div>
                <div style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{result.sectionsCount}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Hook · Body · CTA</div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.1 }}></div>
              </div>
            </div>

            {/* Generated Script Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>Generated Video Script</h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    AI-generated by YouSEO based on your input - not YouTube content or data.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.scriptText)}
                    style={{ backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}
                  >
                    <Clipboard size={16} /> Copy
                  </button>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', 
                padding: '32px', fontSize: '15px', lineHeight: '1.8', color: 'var(--text-main)', 
                whiteSpace: 'pre-wrap', maxHeight: '600px', overflowY: 'auto' 
              }}>
                {result.scriptText}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
