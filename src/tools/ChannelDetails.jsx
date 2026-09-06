import { useState } from 'react';
import { Clipboard, Info, Sparkles, X } from 'lucide-react';
import { fetchChannelDetails } from '../lib/api';

export default function ChannelDetails() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [channelData, setChannelData] = useState(null);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleFetch = async () => {
    if (!url.trim()) return setError('Please enter a channel identifier.');
    setLoading(true);
    setError('');
    setChannelData(null);
    try {
      const data = await fetchChannelDetails(url);
      setChannelData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch channel details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area" style={{ marginTop: '-20px' }}>
      {!channelData ? (
        <>
          <div className="mb-8" style={{ maxWidth: '800px' }}>
            <h1 className="page-title">Channel Detail</h1>
            <p className="page-subtitle">Look up any YouTube channel - paste a URL, channel ID (UC...), or @handle in one field.</p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', padding: '32px' }}>
            {/* Yellow top bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#fbbf24' }}></div>

            <div className="section-divider" style={{ marginBottom: '24px' }}>
              <span>LOOK UP ANY YOUTUBE CHANNEL</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                Channel URL, ID, or @handle <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>- full youtube.com links, UC... IDs, @handle, or bare handle</span>
              </label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. https://youtube.com/@mkbhd or @mkbhd" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ paddingRight: '100px' }}
                />
                <button 
                  className="btn-paste" 
                  style={{ right: '12px' }} 
                  onClick={async () => { try { setUrl(await navigator.clipboard.readText()); } catch(e){} }}
                >
                  <Clipboard size={14} /> Paste
                </button>
              </div>
              {error && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{error}</div>}
            </div>

            <button 
              onClick={handleFetch}
              disabled={loading}
              style={{ 
                width: '100%', padding: '16px', backgroundColor: '#ef4444', color: 'white', 
                borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: 'none', 
                cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                marginBottom: '24px', opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? <Sparkles size={18} className="animate-spin" /> : <Sparkles size={18} fill="currentColor" />}
              {loading ? 'Getting details...' : 'Get channel details'}
            </button>

            <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', border: '1px solid #dbeafe', marginBottom: '32px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#3b82f6', marginTop: '2px' }}>
                <Info size={14} />
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#1e3a8a', margin: 0 }}>
                <span style={{ fontWeight: 600 }}>Pro tip:</span> Use Channel Detail to view a channel's public info - subscribers, tags, and category - before you script or film. Pair with SEO Analysis to plan stronger titles, descriptions, and video ideas for your own channel.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { num: 1, title: "Paste any channel identifier", desc: "Use a full youtube.com link (/channel/..., /@handle, /c/...), a UC... channel ID, or an @handle - all in one field." },
                { num: 2, title: "Get channel details", desc: "We parse your input automatically and fetch public stats, tags, and category signals for that channel." },
                { num: 3, title: "Review & apply", desc: "Compare subscribers, views, region, tags, and categories. Spot which topics and keywords they lean on, then borrow patterns (not copy) for your own titles, thumbnails, and uploads." },
                { num: 4, title: "Turn insight into uploads", desc: "Cross-check tags with Keyword Generator or Trending Topics, then feed winning phrases into Title Generator, Script Generator, or Thumbnail tools so each video is backed by real..." }
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
          </div>
        </>
      ) : (
        <>
          <div className="mb-8" style={{ maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="page-title">Channel Detail</h1>
              <p className="page-subtitle">Review {channelData.snippet.title} below.</p>
            </div>
            <button 
              onClick={() => setChannelData(null)}
              style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} color="var(--text-muted)" />
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
              <img 
                src={channelData.snippet.thumbnails?.high?.url || channelData.snippet.thumbnails?.default?.url} 
                alt={channelData.snippet.title} 
                referrerPolicy="no-referrer"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>{channelData.snippet.title}</h2>
                <div style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '12px' }}>{channelData.snippet.customUrl || `@${channelData.snippet.title.replace(/\s+/g, '').toLowerCase()}`}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Channel ID: {channelData.id}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-main)', maxWidth: '600px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {channelData.snippet.description || "No description provided."}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#e0f2fe', padding: '24px', borderRadius: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Subscribers</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{formatNumber(channelData.statistics.subscriberCount)}</div>
              </div>
              <div style={{ backgroundColor: '#dcfce7', padding: '24px', borderRadius: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Total views</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{formatNumber(channelData.statistics.viewCount)}</div>
              </div>
              <div style={{ backgroundColor: '#f3e8ff', padding: '24px', borderRadius: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Total videos</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{formatNumber(channelData.statistics.videoCount)}</div>
              </div>
              <div style={{ backgroundColor: '#ffedd5', padding: '24px', borderRadius: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Created</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{formatDate(channelData.snippet.publishedAt)}</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '32px' }}>
              Channel data from the YouTube Data API.
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Categories</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {channelData.brandingSettings?.channel?.keywords ? (
                  channelData.brandingSettings.channel.keywords.split(' ').map((kw, i) => (
                    <span key={i} style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                      {kw.replace(/"/g, '')}
                    </span>
                  ))
                ) : (
                  <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                    Society
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
