import { useState, useEffect } from 'react';
import { Type, Check, AlertCircle } from 'lucide-react';

export default function TitleOptimizer() {
  const [title, setTitle] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  // Simple array of common YouTube power words
  const powerWords = [
    'secret', 'hidden', 'how to', 'hack', 'revealed', 'insane', 'crazy', 
    'best', 'worst', 'stop', 'don\'t', 'never', 'always', 'ultimate', 'guide',
    'fast', 'easy', 'simple', 'new', 'free', 'money', 'profit', 'viral'
  ];

  useEffect(() => {
    analyzeTitle(title);
  }, [title]);

  const analyzeTitle = (text) => {
    if (!text) {
      setScore(0);
      setFeedback([]);
      return;
    }

    let newScore = 0;
    const newFeedback = [];
    const length = text.length;

    // Length check
    if (length >= 40 && length <= 60) {
      newScore += 40;
      newFeedback.push({ type: 'good', msg: 'Perfect title length (40-60 characters).' });
    } else if (length > 60 && length <= 70) {
      newScore += 20;
      newFeedback.push({ type: 'ok', msg: 'Good length, but getting a bit long.' });
    } else if (length > 70) {
      newFeedback.push({ type: 'bad', msg: 'Too long! Titles over 70 chars get truncated on mobile.' });
    } else {
      newFeedback.push({ type: 'bad', msg: 'Too short! Add more context to your title.' });
    }

    // Power words check
    const lowerText = text.toLowerCase();
    const foundPowerWords = powerWords.filter(word => lowerText.includes(word));
    
    if (foundPowerWords.length > 0) {
      newScore += 30;
      newFeedback.push({ type: 'good', msg: `Great! You used power words: ${foundPowerWords.join(', ')}` });
    } else {
      newFeedback.push({ type: 'ok', msg: 'Consider adding a power word (like "Ultimate", "Secret", or "How to") to increase CTR.' });
    }

    // Question or Number check
    const hasNumber = /\d/.test(text);
    const hasQuestionMark = /\?/.test(text);

    if (hasNumber || hasQuestionMark) {
      newScore += 30;
      newFeedback.push({ type: 'good', msg: 'Excellent use of numbers or a question mark to create curiosity.' });
    } else {
      newFeedback.push({ type: 'ok', msg: 'Titles with numbers (e.g., "5 Ways") or questions often get higher CTR.' });
    }

    setScore(Math.min(100, newScore));
    setFeedback(newFeedback);
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  const getProgressClass = () => {
    if (score >= 80) return 'progress-good';
    if (score >= 50) return 'progress-ok';
    return 'progress-bad';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-8">
        <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
          <Type size={32} />
        </div>
        <div>
          <h1 className="card-title" style={{ fontSize: '28px', marginBottom: 0 }}>Title Optimizer</h1>
          <p className="card-subtitle">Write irresistible, click-worthy titles for your videos.</p>
        </div>
      </div>

      <div className="card">
        <div className="form-group">
          <label className="form-label flex justify-between">
            <span>Video Title</span>
            <span style={{ color: title.length > 70 ? 'var(--danger)' : 'var(--text-secondary)' }}>
              {title.length} / 100
            </span>
          </label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., 5 Crazy Ways to Grow on YouTube Fast!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            style={{ fontSize: '18px', padding: '16px' }}
          />
        </div>

        {title && (
          <div style={{ marginTop: '32px' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title" style={{ marginBottom: 0 }}>SEO Score</h3>
              <span className={getScoreColor()} style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {score}/100
              </span>
            </div>
            
            <div className="progress-container mb-8">
              <div 
                className={`progress-bar ${getProgressClass()}`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>

            <h3 className="card-title" style={{ marginBottom: '16px' }}>Analysis</h3>
            <div className="flex flex-col gap-4">
              {feedback.map((item, index) => (
                <div key={index} className="flex items-start gap-4" style={{ 
                  padding: '16px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  border: `1px solid ${item.type === 'good' ? 'rgba(34, 197, 94, 0.2)' : item.type === 'bad' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`
                }}>
                  {item.type === 'good' ? (
                    <Check className="text-success" size={20} style={{ marginTop: '2px' }} />
                  ) : (
                    <AlertCircle className={item.type === 'bad' ? 'text-danger' : 'text-warning'} size={20} style={{ marginTop: '2px' }} />
                  )}
                  <p>{item.msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
