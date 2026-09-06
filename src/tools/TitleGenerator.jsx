import { useState } from 'react';
import { Clipboard, Info, Sparkles, Video, Smartphone, ChevronDown, Search } from 'lucide-react';
import { generateTitleFromTopic } from '../lib/api';

export default function TitleGenerator() {
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
      const res = await generateTitleFromTopic(topic, language, format);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate title.');
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
    '🇮🇳 తెలుగు (te)'
  ];

  return (
    <div className="content-area" style={{ marginTop: '-20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', maxWidth: '1000px' }}>
        <div>
          <h1 className="page-title">Video Title Generator</h1>
          <p className="page-subtitle" style={{ maxWidth: '600px' }}>
            Generate click-worthy, SEO-friendly video titles written by YouSEO AI - tailored to your topic, keywords, and language.
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

      <div style={{ display: result ? 'grid' : 'block', gridTemplateColumns: result ? '400px 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Side (Form) */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative', padding: '32px' }}>
          {/* Yellow top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#fbbf24', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}></div>

          <div className="section-divider" style={{ marginBottom: '24px' }}>
            <span>CONFIGURE YOUR TITLE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                Video Topic or Keywords <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>- any text except links/URLs · be specific for better results</span>
              </label>
              <div className="input-wrapper" style={{ position: 'relative', marginBottom: '16px' }}>
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
            
            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#ffedd5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#9a3412', marginBottom: '2px' }}>Do you have target keywords?</div>
                <div style={{ fontSize: '12px', color: '#c2410c' }}>Optional · Refine keyword targeting</div>
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
            {loading ? 'Generating Title...' : `Get Titles for ${format === 'video' ? 'Video' : 'Shorts'}`}
          </button>

          <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', border: '1px solid #dbeafe', marginBottom: !result ? '32px' : '0' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#3b82f6', marginTop: '2px' }}>
              <Info size={14} />
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#1e3a8a', margin: 0 }}>
              <span style={{ fontWeight: 600 }}>Pro tip:</span> Keep titles between 50-60 characters for maximum YouTube visibility. Place your primary keyword within the first 5 words to rank higher in search results.
            </p>
          </div>

          {!result && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                { num: 1, title: "Enter your topic", desc: "Type your video topic, niche, or target keywords. The more specific your input, the more tailored your titles will be." },
                { num: 2, title: "Pick your language", desc: "Choose the language your audience speaks. YouSEO generates native-quality titles designed to capture local attention." },
                { num: 3, title: "Get click-worthy titles", desc: "Instantly receive AI-ranked YouTube titles scored for SEO strength, CTR potential, and emotional hook." }
              ].map((card, i) => (
                <div key={i} style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700 }}>
                    {card.num}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{card.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side (Results) */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Score Card */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '32px', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>YouSEO Title Score</h2>
                <div style={{ display: 'flex', alignItems: 'baseline', color: '#fbbf24' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800 }}>{result.score}</span>
                  <span style={{ fontSize: '16px', color: '#94a3b8', marginLeft: '4px' }}>/ 100</span>
                </div>
              </div>
              
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
                YouSEO AI insight - generated by YouSEO, not a YouTube metric
              </div>
              
              <div style={{ height: '8px', backgroundColor: '#334155', borderRadius: '4px', marginBottom: '32px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${result.score}%`, backgroundColor: '#fbbf24', borderRadius: '4px' }}></div>
              </div>

              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '1px', marginBottom: '16px' }}>
                YOUSEO AI INSIGHTS
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#3b82f6', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', opacity: 0.9 }}>AI SEARCH ESTIMATE</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{result.searchEstimate}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>AI estimate</div>
                  <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.1 }}></div>
                </div>
                
                <div style={{ backgroundColor: '#ef4444', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', opacity: 0.9 }}>AI COMPETITION</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{result.competition}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>AI estimate</div>
                  <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.1 }}></div>
                </div>
                
                <div style={{ backgroundColor: '#f59e0b', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', opacity: 0.9 }}>AI REACH ESTIMATE</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{result.reachEstimate}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>AI estimate</div>
                  <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.1 }}></div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
                Estimates generated by YouSEO AI from public signals - not YouTube data and not a prediction of actual performance.
              </div>
            </div>

            {/* Generated Titles List */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Generated Video Titles</h3>
                <span style={{ backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {result.titles?.length || 3} titles
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.titles?.map((title, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>
                      {title}
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(title)}
                      style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', flexShrink: 0 }}
                    >
                      <Clipboard size={14} /> Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
