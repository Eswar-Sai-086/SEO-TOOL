import { useState } from 'react';
import { Hash, Copy, Check, RefreshCw } from 'lucide-react';

export default function TagGenerator() {
  const [keyword, setKeyword] = useState('');
  const [tags, setTags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTags = () => {
    if (!keyword.trim()) return;

    setIsGenerating(true);
    setCopied(false);

    // Simulate API call for tag generation
    setTimeout(() => {
      const base = keyword.toLowerCase().trim();
      
      const newTags = [
        base,
        `${base} tutorial`,
        `how to ${base}`,
        `best ${base}`,
        `${base} 2026`,
        `${base} for beginners`,
        `what is ${base}`,
        `${base} tips`,
        `${base} tricks`,
        `${base} explained`,
        `advanced ${base}`,
        `${base} guide`,
        `learn ${base}`,
        `${base} review`,
        `why ${base}`
      ];

      // Randomize and pick some subset to simulate variety
      const shuffled = newTags.sort(() => 0.5 - Math.random());
      setTags(shuffled.slice(0, 10));
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = () => {
    const tagString = tags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-8">
        <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
          <Hash size={32} />
        </div>
        <div>
          <h1 className="card-title" style={{ fontSize: '28px', marginBottom: 0 }}>Tag Generator</h1>
          <p className="card-subtitle">Generate highly relevant SEO tags for your video.</p>
        </div>
      </div>

      <div className="card">
        <div className="form-group mb-4">
          <label className="form-label">Core Keyword</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., React JS Tutorial"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateTags()}
            />
            <button 
              className="btn btn-primary" 
              onClick={generateTags}
              disabled={!keyword.trim() || isGenerating}
              style={{ minWidth: '140px' }}
            >
              {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="card-title" style={{ marginBottom: '4px' }}>Generated Tags</h3>
              <p className="card-subtitle">{tags.length} tags • {tags.join(', ').length} / 500 characters</p>
            </div>
            
            <button 
              className={`btn ${copied ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={copyToClipboard}
              style={{ minWidth: '120px' }}
            >
              {copied ? (
                <><Check size={18} /> Copied!</>
              ) : (
                <><Copy size={18} /> Copy All</>
              )}
            </button>
          </div>

          <div className="tag-container" style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {tags.map((tag, index) => (
              <div key={index} className="tag">
                {tag}
                <button onClick={() => removeTag(index)} title="Remove tag">&times;</button>
              </div>
            ))}
            {tags.length === 0 && <p className="text-secondary">No tags generated yet.</p>}
          </div>
          
          <div className="mt-4">
            <label className="form-label">Raw Output (for YouTube Studio)</label>
            <textarea 
              className="form-textarea" 
              value={tags.join(', ')} 
              readOnly 
              style={{ minHeight: '80px', fontSize: '14px' }}
            />
          </div>
        </div>
      )}
      
      {/* Basic animation for the spinner */}
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
