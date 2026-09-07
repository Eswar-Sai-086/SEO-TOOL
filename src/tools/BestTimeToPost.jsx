import { useState, useRef } from 'react';
import { Sparkles, Info, Image as ImageIcon, X, Clock, Calendar, Check } from 'lucide-react';
import { generateBestTimeToPost } from '../lib/api';

const NICHES = ['Education', 'Gaming', 'Entertainment', 'Finance', 'Tech', 'Vlog', 'News & Trends', 'Music', 'Fitness', 'Business', 'Motivation', 'How-to/DIY', 'Coding'];
const CONTENT_TYPES = ['Long-form', 'Mid-form', 'Shorts', 'Live'];
const FREQUENCIES = ['1/week', '2/week', '3/week', 'Daily'];
const PERSONAS = ['Students', 'Working Professionals', 'Parents', 'Night Owls', 'Multi-job/Side'];

export default function BestTimeToPost() {
  const [countries, setCountries] = useState([{ name: 'India', percentage: 100 }]);
  const [mostlyOneCountry, setMostlyOneCountry] = useState(true);
  const [timeZone, setTimeZone] = useState('Asia/Calcutta');
  
  const [selectedNiche, setSelectedNiche] = useState('Education');
  const [selectedContentType, setSelectedContentType] = useState('Long-form');
  const [selectedFrequency, setSelectedFrequency] = useState('2/week');
  
  const [selectedPersona, setSelectedPersona] = useState('Working Professionals');
  
  const [images, setImages] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleAddCountry = () => {
    setCountries([...countries, { name: '', percentage: 0 }]);
  };

  const handleCountryChange = (index, field, value) => {
    const newCountries = [...countries];
    newCountries[index][field] = value;
    setCountries(newCountries);
  };

  const handleRemoveCountry = (index) => {
    setCountries(countries.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      setError('You can only upload up to 3 images.');
      return;
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const schedule = await generateBestTimeToPost({
        countries,
        mostlyOneCountry,
        timeZone,
        niche: selectedNiche,
        contentType: selectedContentType,
        frequency: selectedFrequency,
        persona: selectedPersona,
        images
      });
      setResult(schedule);
    } catch (err) {
      setError(err.message || 'Failed to generate schedule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <div className="mb-8">
        <h1 className="page-title">Best Time to Post</h1>
        <p className="page-subtitle">
          {result 
            ? "Your personalised posting schedule is ready. Post at these times and give every video its best possible start."
            : "Tell us about your audience and YouSEO AI will suggest posting times based on your profile - not a guarantee of results."}
        </p>
      </div>

      {!result ? (
        <div className="main-card">
          <div className="card-content">
            <div className="section-divider" style={{ marginBottom: '32px' }}>
              <span>LET'S FIND YOUR PERFECT POSTING TIME</span>
            </div>

            {/* STEP 1 */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: 'var(--success)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>1</span>
                <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>STEP 1 OF 3</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Where are your viewers from?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Select your audience's countries and adjust the percentage split.</p>

              {countries.map((country, index) => (
                <div key={index} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <select 
                      className="form-input" 
                      value={country.name} 
                      onChange={(e) => handleCountryChange(index, 'name', e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">Select country...</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Japan">Japan</option>
                    </select>
                    {index > 0 && (
                      <button onClick={() => handleRemoveCountry(index)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={country.percentage} 
                      onChange={(e) => handleCountryChange(index, 'percentage', parseInt(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--success)' }}
                    />
                    <span style={{ width: '40px', fontSize: '14px', color: 'var(--text-muted)' }}>{country.percentage}%</span>
                  </div>
                </div>
              ))}

              <button 
                onClick={handleAddCountry}
                style={{ padding: '8px 16px', border: '1px dashed var(--border-color)', borderRadius: '8px', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '24px' }}
              >
                + Add Country
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '16px 0', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Mostly one country</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={mostlyOneCountry} onChange={(e) => setMostlyOneCountry(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <div>
                <label className="form-label">Your Time Zone</label>
                <select className="form-input" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                  <option value="Asia/Calcutta">Asia/Calcutta</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '48px 0' }} />

            {/* STEP 2 */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: 'var(--success)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>2</span>
                <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>STEP 2 OF 3</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>What's your niche & content type?</h2>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ marginBottom: '12px' }}>Niche</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {NICHES.map(niche => (
                    <button 
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '14px',
                        border: selectedNiche === niche ? 'none' : '1px solid var(--border-color)',
                        background: selectedNiche === niche ? 'var(--text-color)' : 'var(--bg-secondary)',
                        color: selectedNiche === niche ? 'var(--bg-primary)' : 'var(--text-color)',
                        cursor: 'pointer'
                      }}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ marginBottom: '12px' }}>Content Type</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {CONTENT_TYPES.map(type => (
                    <button 
                      key={type}
                      onClick={() => setSelectedContentType(type)}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '14px',
                        border: selectedContentType === type ? 'none' : '1px solid var(--border-color)',
                        background: selectedContentType === type ? 'var(--text-color)' : 'var(--bg-secondary)',
                        color: selectedContentType === type ? 'var(--bg-primary)' : 'var(--text-color)',
                        cursor: 'pointer'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label" style={{ marginBottom: '12px' }}>How often do you post?</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {FREQUENCIES.map(freq => (
                    <button 
                      key={freq}
                      onClick={() => setSelectedFrequency(freq)}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '14px',
                        border: selectedFrequency === freq ? 'none' : '1px solid var(--border-color)',
                        background: selectedFrequency === freq ? 'var(--text-color)' : 'var(--bg-secondary)',
                        color: selectedFrequency === freq ? 'var(--bg-primary)' : 'var(--text-color)',
                        cursor: 'pointer'
                      }}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '48px 0' }} />

            {/* STEP 3 */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: 'var(--success)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>3</span>
                <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>STEP 3 OF 3 - ALMOST THERE!</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Tell us about your audience's lifestyle</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Tell us about your audience's daily routine.</p>

              <div style={{ marginBottom: '32px' }}>
                <label className="form-label" style={{ marginBottom: '12px' }}>Audience Persona</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PERSONAS.map(persona => (
                    <button 
                      key={persona}
                      onClick={() => setSelectedPersona(persona)}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '14px',
                        border: selectedPersona === persona ? 'none' : '1px solid var(--border-color)',
                        background: selectedPersona === persona ? 'var(--text-color)' : 'var(--bg-secondary)',
                        color: selectedPersona === persona ? 'var(--bg-primary)' : 'var(--text-color)',
                        cursor: 'pointer'
                      }}
                    >
                      {persona}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Audience Activity Graphs (Optional)</label>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>Upload up to 3 graph/chart images showing audience activity patterns to enhance predictions.</p>
                
                <div 
                  onClick={() => fileInputRef.current.click()}
                  style={{ 
                    border: '1px dashed var(--border-color)', 
                    borderRadius: '8px', 
                    padding: '24px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--bg-secondary)',
                    marginBottom: '8px'
                  }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    multiple
                    onChange={handleImageUpload}
                  />
                  <span style={{ fontWeight: '500' }}>Upload Graph ({images.length}/3)</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px' }}>PNG, JPG, WEBP, GIF up to 5MB each</p>

                {images.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {images.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: '100px', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                        <img src={img} alt="Graph" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          onClick={() => handleRemoveImage(i)}
                          style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer', padding: '2px' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Optional. By uploading a screenshot of your YouTube Analytics, you consent to YouSEO AI reading it to generate your suggested schedule. It is not shared with anyone else.
                </p>
              </div>
              
              {error && (
                <div style={{ color: 'var(--primary-red)', padding: '12px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <button 
                className="btn-primary-large" 
                onClick={handleSubmit} 
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}
              >
                <Sparkles size={18} /> {loading ? 'Analyzing Audience...' : 'Find Best Time to Post'}
              </button>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Posting time suggestions are generated by YouSEO AI from the details you provide. They are not YouTube data.
              </p>
            </div>

            <div style={{ background: 'rgba(0, 112, 243, 0.05)', border: '1px solid rgba(0, 112, 243, 0.1)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '48px' }}>
              <Info size={20} color="#0070f3" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '14px' }}>
                <span style={{ fontWeight: 'bold' }}>Pro tip: </span>
                The more detail you give about your audience, the more tailored your suggested schedule will be.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '32px' }}>
              <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--primary-red)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '16px' }}>1</div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Set your audience profile</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>Tell us where your viewers are, your niche, content type, and audience lifestyle. The more you fill in, the more accurate your schedule.</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--primary-red)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '16px' }}>2</div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>AI analyses peak windows</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>Our AI cross-references your audience profile with timezone data and the audience details you provide to find your peak hours.</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--primary-red)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '16px' }}>3</div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Get your personalised schedule</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>Receive a full weekly posting calendar with the best days and exact times to upload - based on your specific audience, not generic averages.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left Column: Audience Profile */}
          <div style={{ width: '300px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <div className="section-divider" style={{ marginBottom: '24px', borderBottom: 'none' }}>
              <span style={{ fontSize: '12px' }}>YOUR AUDIENCE PROFILE</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '8px' }}>AUDIENCE LOCATION</label>
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px 14px', fontSize: '14px' }}>
                {countries[0].name} - {countries[0].percentage}%
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '8px' }}>YOUR TIME ZONE</label>
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px 14px', fontSize: '14px' }}>
                {timeZone}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '8px' }}>NICHE & CONTENT</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ border: '1px solid var(--success)', color: 'var(--success)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{selectedNiche}</span>
                <span style={{ border: '1px solid #3b82f6', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{selectedContentType}</span>
                <span style={{ border: '1px solid #3b82f6', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{selectedFrequency}</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label className="form-label" style={{ fontSize: '12px', marginBottom: '8px' }}>AUDIENCE PERSONA</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ border: '1px solid var(--success)', color: 'var(--success)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{selectedPersona}</span>
              </div>
            </div>

            <button 
              className="btn-primary-large" 
              onClick={() => setResult(null)} 
              style={{ width: '100%', justifyContent: 'center', background: '#86d69f', color: '#1a5330', border: 'none', marginBottom: '16px' }}
            >
              Find My Best Time to Post
            </button>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.5', marginBottom: '24px' }}>
              Use the close button in the top-right of the page to return to setup, update your audience profile, and calculate again.
            </p>

            <div style={{ background: 'rgba(134, 214, 159, 0.1)', border: '1px solid rgba(134, 214, 159, 0.3)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--success)' }}>
              <strong>High confidence:</strong> Based on your audience profile.
            </div>
          </div>

          {/* Right Column: Results Dashboard */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Card - Dark Mode */}
            <div style={{ background: '#111827', color: 'white', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} color="#86d69f" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Today's Best Time</h2>
                    <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>{result.strongestDay || 'Wednesday - your strongest posting day this week'}</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#f59e0b" /> AI schedule
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}></div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>BEST TIME</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>{result.bestTime || '20:15'}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>{timeZone.split('/')[1] || 'Local'} today</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}></div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>PEAK WINDOW</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>{result.peakWindow || '19:30-22:00'}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>Highest activity</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}></div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>CONFIDENCE</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>High</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.4' }}>YouSEO AI rating of your profile detail</div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                Suggested times are generated by YouSEO AI for the details you provide, not YouTube data, and are not guaranteed results.
              </div>
            </div>

            {/* Advice Row 1 */}
            <div style={{ background: 'rgba(134, 214, 159, 0.1)', border: '1px solid #86d69f', borderRadius: '12px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ minWidth: '160px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--success)', letterSpacing: '1px', marginBottom: '8px' }}>PUBLISH TODAY AT</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5330' }}>{result.publishTodayAt || '20:15'} {timeZone.split('/')[1] || 'Local'}</div>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-color)', lineHeight: '1.5', borderLeft: '1px solid rgba(134, 214, 159, 0.3)', paddingLeft: '24px' }}>
                {result.publishAdvice || "45 min before peak - Coordinate posting with a short pre-release teaser on Shorts/Community ~3-4 hours before the upload to prime your returning viewers for the long-form release."}
              </div>
            </div>

            {/* Advice Row 2 (3 columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(134, 214, 159, 0.1)', border: '1px solid rgba(134, 214, 159, 0.3)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--success)', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div> PEAK WINDOW
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{result.peakWindow || '19:30-22:00'}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {result.peakAdvice || "Highest audience activity - evening unwind for students & professionals"}
                </div>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }}></div> SECONDARY SLOT
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{result.secondarySlot || '21:15 - 23:15'}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {result.secondaryAdvice || "Morning commute window - strong secondary engagement before work starts"}
                </div>
              </div>
              <div style={{ background: 'rgba(2ef, 68, 68, 0.05)', border: '1px solid rgba(2ef, 68, 68, 0.1)', borderRadius: '12px', padding: '20px', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ef4444', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></div> AVOID
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{result.avoidSlot || '12:00 - 15:00'}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {result.avoidAdvice || "Low engagement midday - audience is at work or in class, limited viewing time"}
                </div>
              </div>
            </div>

            {/* Schedule Card - Dark Mode */}
            <div style={{ background: '#111827', color: 'white', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} color="#818cf8" />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Weekly Posting Schedule</h2>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>Your 7-day calendar - prime slots ranked by audience activity for your profile</p>
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {result.schedule.map((day, i) => (
                  <div key={i} style={{ display: 'flex', padding: '16px', borderBottom: i < result.schedule.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', alignItems: 'center' }}>
                    <div style={{ width: '120px', fontWeight: 'bold', color: '#e5e7eb' }}>{day.day}</div>
                    <div style={{ width: '150px', color: '#86d69f', fontWeight: '600' }}>{day.time}</div>
                    <div style={{ flex: 1, color: '#9ca3af', fontSize: '14px' }}>{day.reason}</div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
