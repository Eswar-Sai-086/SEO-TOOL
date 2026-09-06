import { useState } from 'react';
import { Clipboard, Info, Sparkles, Video, Smartphone, ChevronDown, Search, Link as LinkIcon } from 'lucide-react';
import { generateDescriptionFromTopic } from '../lib/api';

export default function DescriptionWriter() {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('video'); // 'video' or 'shorts'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState('🇮🇳 తెలుగు (te)');
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
      const res = await generateDescriptionFromTopic(topic, language, format);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate description.');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', maxWidth: '1000px' }}>
        <div>
          <h1 className="page-title">Video Description Generator</h1>
          <p className="page-subtitle" style={{ maxWidth: '600px' }}>
            Generate SEO-optimized YouTube descriptions with timestamps, CTAs, and high-search-volume keywords - ready to copy and publish.
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

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative', padding: '32px' }}>
        {/* Yellow top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#fbbf24', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}></div>

        <div className="section-divider" style={{ marginBottom: '24px' }}>
          <span>CONFIGURE YOUR DESCRIPTION</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                Video Topic or Keywords <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>- any text except links/URLs · be specific for better results</span>
              </label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Yoga Tips for Beginners at Home" 
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
            
            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#ffedd5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#9a3412', marginBottom: '2px' }}>Do you have target keywords?</div>
                <div style={{ fontSize: '12px', color: '#c2410c' }}>Optional · Refine keyword targeting</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fdf2f8', border: '1px solid #fce7f3', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#fce7f3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                  <LinkIcon size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#831843', marginBottom: '2px' }}>Include Social Links</div>
                  <div style={{ fontSize: '12px', color: '#be185d' }}>Add your profiles to the video description</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', paddingTop: '12px', borderTop: '1px solid #fce7f3' }}>
                No saved social links yet. Add them on your profile to use them when you turn inclusion on.
              </div>
            </div>
          </div>

          {/* Right Column */}
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
                  <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="Search language..." 
                      style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px' }}
                    />
                  </div>
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
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

        <button 
          onClick={handleGenerate}
          disabled={loading}
          style={{ 
            width: '100%', padding: '16px', backgroundColor: '#ef4444', color: 'white', 
            borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: 'none', 
            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
            marginBottom: '24px', opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? <Sparkles size={18} className="animate-spin" /> : <Sparkles size={18} fill="currentColor" />}
          {loading ? 'Generating Description...' : `Generate Description for ${format === 'video' ? 'Video' : 'Shorts'}`}
        </button>

        {result && (
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: 'var(--text-muted)', letterSpacing: '1px' }}>GENERATED DESCRIPTION</h3>
              <button 
                onClick={() => navigator.clipboard.writeText(result)}
                style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6' }}
              >
                <Clipboard size={14} /> Copy
              </button>
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {result}
            </div>
          </div>
        )}

        <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', border: '1px solid #dbeafe', marginBottom: '32px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#3b82f6', marginTop: '2px' }}>
            <Info size={14} />
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#1e3a8a', margin: 0 }}>
            <span style={{ fontWeight: 600 }}>Pro tip:</span> The first 2-3 lines of your description are shown before "Show more" - make sure your primary keyword and hook appear there. Descriptions with timestamps get 40% more engagement.
          </p>
        </div>

      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
