import { useState } from 'react';
import { Link, Clipboard, Sparkles, Eye, ThumbsUp, MessageSquare, Zap, CheckCircle2, XCircle, AlertTriangle, X, Copy } from 'lucide-react';
import { extractVideoId, fetchVideoDetails, generateOptimization } from '../lib/api';

export default function SeoAnalysis() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  
  const [modalConfig, setModalConfig] = useState(null); // { type, title }
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({}); // { description: "...", title: "..." }
  
  const [extraDetails, setExtraDetails] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (pt) => {
    if (!pt) return '0:00';
    const match = pt.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    const h = match[1] ? parseInt(match[1]) : 0;
    const m = match[2] ? parseInt(match[2]) : 0;
    const s = match[3] ? parseInt(match[3]) : 0;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnalyze = async () => {
    if (!url.trim()) return setError('Please paste a YouTube video URL.');
    setLoading(true); setError(''); setResults(null); setGeneratedContent({});
    try {
      const videoId = extractVideoId(url);
      if (!videoId) throw new Error("Invalid YouTube URL.");
      const videoData = await fetchVideoDetails(videoId);
      const snippet = videoData.snippet;
      const desc = snippet.description || '';
      const title = snippet.title || '';
      
      const hasHdThumbnail = !!(snippet.thumbnails?.maxres || snippet.thumbnails?.high);
      const isHdVideo = videoData.contentDetails?.definition === 'hd';
      const isTitleOptimized = title.length >= 20 && title.length <= 70;
      const hashtags = desc.match(/#\w+/g) || [];
      const isDescOptimized = desc.length >= 250 && hashtags.length >= 1 && hashtags.length <= 15;
      const hasChapters = desc.includes('0:00') || desc.includes('00:00');
      const hasTags = snippet.tags && snippet.tags.length > 0;

      const checks = [
        { id: 'thumb', passed: hasHdThumbnail, pts: 30, highImpact: true },
        { id: 'quality', passed: isHdVideo, pts: 20, highImpact: true },
        { id: 'title', passed: isTitleOptimized, pts: 15, highImpact: true },
        { id: 'desc', passed: isDescOptimized, pts: 15, highImpact: true },
        { id: 'chapters', passed: hasChapters, pts: 10, highImpact: false }, // Med impact in new screenshot
        { id: 'tags', passed: hasTags, pts: 10, highImpact: false }
      ];

      let passedCount = 0, fixes = 0, highImpactFixes = 0, finalScore = 0;
      checks.forEach(c => {
        if (c.passed) { passedCount++; finalScore += c.pts; } 
        else { fixes++; if (c.highImpact) highImpactFixes++; }
      });
      
      setResults({ videoData, checks: { hasHdThumbnail, isHdVideo, isTitleOptimized, isDescOptimized, hasChapters, hasTags }, passedCount, totalChecks: 6, fixes, highImpactFixes, finalScore });
    } catch (err) {
      setError(err.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!modalConfig) return;
    setIsGenerating(true);
    try {
      const content = await generateOptimization(modalConfig.type, results.videoData.snippet, extraDetails);
      setGeneratedContent(prev => ({ ...prev, [modalConfig.type]: content }));
      setModalConfig(null);
      setExtraDetails('');
      setShowDetails(false);
    } catch (err) {
      alert(err.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const CheckItem = ({ id, title, passed, highImpact, feedback, successMsg, buttonText }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '24px 0', borderBottom: '1px solid var(--border-color)' }}>
      {passed ? (
        <CheckCircle2 size={28} color="#22c55e" fill="#dcfce7" style={{ marginTop: '2px', flexShrink: 0 }} />
      ) : highImpact ? (
        <XCircle size={28} color="#ef4444" fill="#fee2e2" style={{ marginTop: '2px', flexShrink: 0 }} />
      ) : (
        <AlertTriangle size={28} color="#f97316" fill="#ffedd5" style={{ marginTop: '2px', flexShrink: 0 }} />
      )}
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: passed ? 'var(--text-main)' : highImpact ? '#ef4444' : '#f97316' }}>
            {title}
          </h4>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', padding: '2px 8px', borderRadius: '12px', backgroundColor: passed ? '#dcfce7' : highImpact ? '#fee2e2' : '#ffedd5', color: passed ? '#15803d' : highImpact ? '#b91c1c' : '#c2410c' }}>
            {passed ? 'PASSED' : highImpact ? 'HIGH' : 'MED'}
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: (!passed && buttonText && !generatedContent[id]) ? '12px' : '0' }}>
          {passed ? successMsg : feedback}
        </p>
        
        {!passed && generatedContent[id] && (
          <div style={{ marginTop: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-muted)' }}>GENERATED {title.split(' ')[0].toUpperCase()}</span>
              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(generatedContent[id].split('|||')[0].trim())}>
                <Copy size={14} /> copy
              </button>
            </div>
            <div style={{ padding: '16px', fontSize: '14px', color: 'var(--text-main)', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
              {generatedContent[id].includes('|||') ? (
                <>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>{generatedContent[id].split('|||')[0].trim()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{generatedContent[id].split('|||')[1].trim()}</div>
                </>
              ) : (
                generatedContent[id]
              )}
            </div>
          </div>
        )}

        {!passed && buttonText && !generatedContent[id] && (
          <button 
            onClick={() => {
              setModalConfig({ type: id, title: buttonText.replace('+', '').trim() });
              setExtraDetails('');
              setShowDetails(false);
            }}
            style={{ backgroundColor: '#111827', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '16px', fontWeight: 400 }}>+</span> {buttonText}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="content-area" style={{ marginTop: '-20px' }}>
      {!results ? (
        <>
          <div className="mb-8" style={{ maxWidth: '800px' }}>
            <h1 className="page-title">Video SEO Analyzer</h1>
            <p className="page-subtitle">Paste any YouTube video or Shorts link to get an instant SEO score with actionable fixes.</p>
          </div>
          <div className="main-card mb-8">
            <div className="card-content">
              <div className="section-divider"><span>ANALYSE YOUR VIDEO</span></div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <div className="input-wrapper">
                  <Link size={18} className="left-icon" />
                  <input type="text" className="form-input has-icon" placeholder="Paste YouTube link" style={{ padding: '16px 16px 16px 44px' }} value={url} onChange={(e) => setUrl(e.target.value)} />
                  <button className="btn-paste" style={{ right: '12px' }} onClick={async () => {try { setUrl(await navigator.clipboard.readText()); } catch(e){}}}><Clipboard size={14} /> Paste</button>
                </div>
              </div>
              {error && <div className="mb-4" style={{ color: 'var(--primary-red)' }}>{error}</div>}
              <button className="btn-primary-large" onClick={handleAnalyze} disabled={loading}>
                {loading ? <Sparkles size={18} className="animate-spin" /> : <Sparkles size={18} fill="currentColor" />}
                {loading ? 'Analyzing...' : 'Check SEO'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <h1 className="page-title">Video SEO Analyzer</h1>
              <p className="page-subtitle">Analysis complete for your video.</p>
            </div>
            <button 
              onClick={() => {
                setResults(null);
                setUrl('');
              }}
              title="Close Analysis"
              style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <X size={18} color="var(--text-muted)" />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                  <img src={results.videoData.snippet.thumbnails?.maxres?.url || results.videoData.snippet.thumbnails?.high?.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{formatDuration(results.videoData.contentDetails?.duration)}</div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{results.videoData.snippet.title}</h3>
                  <div style={{ display: 'inline-block', backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '16px', marginBottom: '16px' }}>Long-form video</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> Views {formatNumber(results.videoData.statistics.viewCount)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsUp size={14} /> Likes {formatNumber(results.videoData.statistics.likeCount)}</div>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: '#111827', color: 'white', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#374151', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Zap size={16} color="#fbbf24" fill="#fbbf24" /></div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{results.fixes === 0 ? "Fully optimized — nothing left to fix." : `Solid start — ${results.fixes} fixes would move the needle, ${results.highImpactFixes} of them high-impact.`}</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div><div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px' }}>YOUSEO SEO SCORE</div></div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: results.finalScore >= 80 ? '#22c55e' : '#f97316', lineHeight: 1 }}>{results.finalScore}<span style={{ fontSize: '16px' }}>%</span></div>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${results.finalScore}%`, backgroundColor: results.finalScore >= 80 ? '#22c55e' : '#f97316' }}></div></div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Optimization Checklist</h2>
                <div style={{ backgroundColor: '#f3f4f6', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{results.passedCount}/{results.totalChecks} passed</div>
              </div>
              <div>
                <CheckItem id="desc" title="Description optimized" passed={results.checks.isDescOptimized} highImpact={true} feedback="Use 1-10 relevant hashtags — the first 3 show above your title. Past 15, YouTube ignores all of them." successMsg="Description looks good." buttonText="Rewrite description" />
                <CheckItem id="title" title="Title optimized" passed={results.checks.isTitleOptimized} highImpact={true} feedback="Aim for 20-70 characters with the hook up front and minimal caps." successMsg="Length in range and readable." buttonText="Write better titles" />
                <CheckItem id="tags" title="Tags added" passed={results.checks.hasTags} highImpact={false} feedback="Add a handful of tags. They barely affect ranking, but they cover misspellings for free." successMsg="Tags detected." buttonText="Suggest tags" />
                <CheckItem id="thumbnail" title="Custom HD thumbnail" passed={results.checks.hasHdThumbnail} highImpact={false} feedback="Upload a custom thumbnail in 1280x720 resolution." successMsg="Custom thumbnail detected. Want to know if it earns the click?" buttonText="Upload thumbnail" />
                <CheckItem id="hd" title="HD video quality" passed={results.checks.isHdVideo} highImpact={false} feedback="Upload in 1080p or higher." successMsg="Uploaded in HD — clear video keeps viewers around." />
                <CheckItem id="chapters" title="Timestamp chapters" passed={results.checks.hasChapters} highImpact={false} feedback="Add chapters starting at 0:00 to unlock Key Moments." successMsg="Chapters detected — Key Moments on Google and easier navigation are unlocked." buttonText="Generate chapters" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {modalConfig && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(209, 213, 219, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '480px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
            <button onClick={() => setModalConfig(null)} style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <X size={16} color="#6b7280" />
            </button>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#111827', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Sparkles size={24} color="#fbbf24" fill="#fbbf24" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{modalConfig.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              Want to tell us what it's about first? <button onClick={() => setShowDetails(true)} style={{ color: 'var(--text-main)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Add details</button>
            </p>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>
                <span>Output Language</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>optional</span>
              </div>
              <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', appearance: 'none', backgroundColor: 'white' }}>
                <option>🌐 Same as video (auto)</option>
              </select>
            </div>
            
            {showDetails && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>
                  <span>Extra Instructions</span>
                </div>
                <textarea 
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  placeholder="e.g. Include a link to my new course, or focus on a specific keyword..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{ width: '100%', padding: '16px', backgroundColor: '#111827', color: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {isGenerating ? <Sparkles size={18} className="animate-spin" /> : null}
                {isGenerating ? 'Generating...' : 'Just generate'}
              </button>
              
              {!showDetails && (
                <button 
                  onClick={() => setShowDetails(true)}
                  style={{ width: '100%', padding: '16px', backgroundColor: 'white', color: '#111827', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Add details ›
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
