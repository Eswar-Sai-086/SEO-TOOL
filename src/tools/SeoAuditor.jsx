import { useState } from 'react';
import { CheckSquare, AlertTriangle, Check, X } from 'lucide-react';

export default function SeoAuditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  
  const [score, setScore] = useState(0);
  const [auditDone, setAuditDone] = useState(false);

  const runAudit = () => {
    let currentScore = 0;
    
    // Title Checks
    if (title.length >= 40 && title.length <= 70) currentScore += 25;
    else if (title.length > 0) currentScore += 10;

    // Description Checks
    if (description.length >= 250) currentScore += 25;
    else if (description.length > 0) currentScore += 10;
    
    // Links in description check
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(description)) currentScore += 15;

    // Tags Checks
    const tagsList = tags.split(',').filter(t => t.trim().length > 0);
    if (tagsList.length >= 5 && tagsList.length <= 15) currentScore += 25;
    else if (tagsList.length > 15) currentScore += 15;
    
    // Title word in description
    const titleWords = title.toLowerCase().split(' ').filter(w => w.length > 3);
    const descLower = description.toLowerCase();
    const matches = titleWords.filter(word => descLower.includes(word));
    
    if (matches.length > 0 && titleWords.length > 0) currentScore += 10;

    setScore(currentScore);
    setAuditDone(true);
  };

  const AuditItem = ({ title, desc, passed, score }) => (
    <div className="flex items-start gap-4 mb-4" style={{ 
      padding: '16px', 
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      border: `1px solid ${passed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
    }}>
      {passed ? (
        <Check className="text-success" size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
      ) : (
        <X className="text-danger" size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
      )}
      <div style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-1">
          <h4 style={{ fontWeight: 600 }}>{title}</h4>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: passed ? 'var(--success)' : 'var(--text-secondary)' }}>
            {passed ? `+${score} pts` : '0 pts'}
          </span>
        </div>
        <p className="card-subtitle">{desc}</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-8">
        <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
          <CheckSquare size={32} />
        </div>
        <div>
          <h1 className="card-title" style={{ fontSize: '28px', marginBottom: 0 }}>SEO Auditor</h1>
          <p className="card-subtitle">Comprehensive checklist for your metadata before you publish.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 className="card-title mb-4">Metadata Input</h3>
          
          <div className="form-group">
            <label className="form-label">Video Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea" 
              placeholder="Paste your full description here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '150px' }}
            />
          </div>

          <div className="form-group mb-8">
            <label className="form-label">Tags (comma separated)</label>
            <textarea 
              className="form-textarea" 
              placeholder="tag1, tag2, tag3"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={runAudit}>
            Run Full Audit
          </button>
        </div>

        <div className="card">
          <h3 className="card-title mb-4">Audit Results</h3>
          
          {!auditDone ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
              <AlertTriangle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Enter your metadata and run the audit to see your score.</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span style={{ fontSize: '16px', fontWeight: 500 }}>Overall SEO Score</span>
                <span style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'
                }}>
                  {score}/100
                </span>
              </div>
              
              <div className="progress-container mb-8">
                <div 
                  className={`progress-bar ${score >= 80 ? 'progress-good' : score >= 50 ? 'progress-ok' : 'progress-bad'}`} 
                  style={{ width: `${score}%` }}
                ></div>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                <AuditItem 
                  title="Title Length" 
                  desc="Title should be between 40 and 70 characters."
                  passed={title.length >= 40 && title.length <= 70}
                  score={25}
                />
                
                <AuditItem 
                  title="Description Length" 
                  desc="Description should be at least 250 characters long to provide context."
                  passed={description.length >= 250}
                  score={25}
                />
                
                <AuditItem 
                  title="Links in Description" 
                  desc="Include links to social media, other videos, or products."
                  passed={/(https?:\/\/[^\s]+)/g.test(description)}
                  score={15}
                />
                
                <AuditItem 
                  title="Tag Count" 
                  desc="Use between 5 and 15 highly relevant tags."
                  passed={tags.split(',').filter(t => t.trim().length > 0).length >= 5 && tags.split(',').filter(t => t.trim().length > 0).length <= 15}
                  score={25}
                />
                
                <AuditItem 
                  title="Title in Description" 
                  desc="Include main keywords from your title in the first 2 lines of your description."
                  passed={
                    title.length > 0 && 
                    title.toLowerCase().split(' ').filter(w => w.length > 3).some(w => description.toLowerCase().includes(w))
                  }
                  score={10}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
