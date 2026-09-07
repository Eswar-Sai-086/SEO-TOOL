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
        <p className="page-subtitle">Tell us about your audience and YouSEO AI will suggest posting times based on your profile - not a guarantee of results.</p>
      </div>

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
          
          {/* Result Section */}
          {result && (
            <div style={{ marginTop: '32px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="var(--primary-red)" /> Your Personalised Schedule
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Based on your audience ({selectedPersona} from {countries[0].name}), here are the ideal upload windows:</p>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {result.schedule.map((day, i) => (
                  <div key={i} style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ minWidth: '100px', fontWeight: '600' }}>{day.day}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-red)', marginBottom: '4px' }}>{day.time}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{day.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,0,0,0.05)', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.1)' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>AI Strategic Advice</h4>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{result.advice}</p>
              </div>
            </div>
          )}

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
    </div>
  );
}
