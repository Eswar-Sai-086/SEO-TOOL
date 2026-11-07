import { useState, useRef } from 'react';
import { ChevronDown, Save, Copy, Download, BookOpen } from 'lucide-react';
import { getKeys, geminiGenerate } from '../lib/api';

const AGE_GROUPS = [
  '3-6 years',
  '6-9 years',
  '9-12 years',
  '12+ years',
  'All Ages',
];

const STYLE_OPTIONS = [
  'Simple & Bold (best for young kids)',
  'Detailed & Intricate',
  'Mandala / Geometric',
  'Cartoon / Cute',
  'Realistic Scenes',
];


export default function ColoringBookGenerator() {
  const [category, setCategory] = useState('');
  const [ageGroup, setAgeGroup] = useState('3-6 years');
  const [style, setStyle] = useState('Simple & Bold (best for young kids)');
  const [count, setCount] = useState(30);
  const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompts, setPrompts] = useState([]);
  const editorRef = useRef(null);

  const handleGenerate = async () => {
    if (!category.trim()) {
      setError('Please enter a category of images.');
      return;
    }
    setError('');
    setLoading(true);
    setPrompts([]);

    try {
      const { gemini } = getKeys();
      if (!gemini) throw new Error('Gemini API Key is missing. Please add it in Settings.');

      const prompt = `You are an expert KDP coloring book illustrator and AI image prompt writer.
Generate exactly ${count} unique coloring book pages for "${category}" illustrations.
Target age group: ${ageGroup}
Drawing style: ${style}
Theme: ${category}

For EACH page, produce TWO prompts in this EXACT format with no deviation:

PAGE 1
TITLE: [Short descriptive name, e.g. "Baby Elephant"]
THEME: [Theme & subtheme, e.g. "Safari & Jungle"]
COLOR_GUIDE: [A detailed AI image generation prompt for a FULLY COLORED, vibrant, cartoon illustration of the scene. Include colors, mood, background details. End with: cartoon style, bright colors, child-friendly, high quality illustration]
COLORING_PAGE: [A detailed AI image generation prompt for the EXACT SAME scene but as a black and white line art coloring page. Clean thick outlines, no shading, no fill. End with: black and white line art, coloring book page, thick outlines, no shading, white background, KDP ready]

PAGE 2
TITLE: ...
(continue for all ${count} pages)

Rules:
- Each PAGE must have all 4 fields: TITLE, THEME, COLOR_GUIDE, COLORING_PAGE
- Scenes must be diverse — no repeated subjects
- Keep everything age-appropriate for ${ageGroup}
- Do NOT add any extra commentary, just the pages in the exact format above`;

      const text = await geminiGenerate(gemini, prompt);

      // Parse paired prompts
      const pageBlocks = text.split(/PAGE\s+\d+/i).filter(b => b.trim().length > 0);
      const extract = (block, key) => {
        const match = block.match(new RegExp(`${key}:\\s*([^\\n]+(?:\\n(?!TITLE:|THEME:|COLOR_GUIDE:|COLORING_PAGE:|PAGE\\s+\\d+)[^\\n]*)*)`, 'i'));
        return match ? match[1].replace(/\n/g, ' ').trim() : '';
      };

      const parsed = pageBlocks.map((block, i) => ({
        index: i + 1,
        title: extract(block, 'TITLE'),
        theme: extract(block, 'THEME'),
        colorGuide: extract(block, 'COLOR_GUIDE'),
        coloringPage: extract(block, 'COLORING_PAGE'),
      })).filter(p => p.title || p.colorGuide);

      if (parsed.length === 0) throw new Error('Could not parse prompts. Please try again.');
      setPrompts(parsed);
    } catch (err) {
      setError(err.message || 'Failed to generate prompts.');
    } finally {
      setLoading(false);
    }
  };

  const getPlainText = () =>
    prompts.map((p) =>
      `PAGE ${p.index} — ${p.title}\nTheme: ${p.theme}\n\n[VISUAL COLOR GUIDE - KDP Left Page]\n${p.colorGuide}\n\n[COLOR ME! - KDP Right Page]\n${p.coloringPage}`
    ).join('\n\n' + '─'.repeat(60) + '\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(getPlainText());
  };

  const handleDownload = () => {
    const blob = new Blob([getPlainText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coloring-book-prompts-${category.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    handleDownload();
  };

  const SelectDropdown = ({ value, options, open, setOpen, onChange, label }) => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--text-main)',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {value}
        <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                backgroundColor: opt === value ? '#f0f4ff' : 'transparent',
                border: 'none',
                fontSize: '14px',
                fontWeight: opt === value ? 600 : 400,
                color: opt === value ? '#3b82f6' : 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="content-area" style={{ marginTop: '-20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title">Coloring Book Image Prompts Generator</h1>
        <p className="page-subtitle" style={{ maxWidth: '640px' }}>
          This tool helps you create engaging image prompts for coloring book illustrations, perfect for keeping kids entertained and sparking creativity.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* LEFT — Form */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '32px',
            position: 'relative',
          }}
        >
          {/* Blue top bar */}
          <div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
              backgroundColor: '#3b82f6',
              borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1 — Category */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#3b82f6', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, flexShrink: 0,
                }}>1</span>
                <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  🎨 What category of images do you want?
                </label>
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Animals, Toys, Vehicles"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            {/* Step 2 — Age Group */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#3b82f6', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, flexShrink: 0,
                }}>2</span>
                <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  😊 What's the age group of the kids?
                </label>
              </div>
              <SelectDropdown
                value={ageGroup}
                options={AGE_GROUPS}
                open={ageDropdownOpen}
                setOpen={setAgeDropdownOpen}
                onChange={setAgeGroup}
              />
            </div>

            {/* Step 3 — Style */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#3b82f6', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, flexShrink: 0,
                }}>3</span>
                <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  🖌️ Drawing style
                </label>
              </div>
              <SelectDropdown
                value={style}
                options={STYLE_OPTIONS}
                open={styleDropdownOpen}
                setOpen={setStyleDropdownOpen}
                onChange={setStyle}
              />
            </div>

            {/* Step 4 — Count */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#3b82f6', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, flexShrink: 0,
                }}>4</span>
                <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  ✏️ How many images do you need?
                </label>
              </div>
              <input
                type="number"
                className="form-input"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              />
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: 500, margin: 0 }}>{error}</p>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? (
                <>
                  <span className="animate-spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                  Generating {count} prompts…
                </>
              ) : (
                <>
                  <BookOpen size={18} />
                  Generate Image Prompts
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT — Results */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
              Your Result
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSave}
                disabled={prompts.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: prompts.length > 0 ? '#3b82f6' : '#e2e8f0',
                  color: prompts.length > 0 ? 'white' : '#94a3b8',
                  border: 'none', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 600, cursor: prompts.length > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                <Save size={14} /> Save
              </button>
              <button
                onClick={handleCopy}
                disabled={prompts.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '8px 10px',
                  backgroundColor: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px', fontSize: '13px', cursor: prompts.length > 0 ? 'pointer' : 'not-allowed',
                  color: prompts.length > 0 ? 'var(--text-main)' : '#94a3b8',
                }}
                title="Copy all"
              >
                <Copy size={15} />
              </button>
              <button
                onClick={handleDownload}
                disabled={prompts.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '8px 10px',
                  backgroundColor: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px', fontSize: '13px', cursor: prompts.length > 0 ? 'pointer' : 'not-allowed',
                  color: prompts.length > 0 ? 'var(--text-main)' : '#94a3b8',
                }}
                title="Download as .txt"
              >
                <Download size={15} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {prompts.length === 0 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '12px', paddingTop: '80px' }}>
                <BookOpen size={40} strokeWidth={1.5} />
                <p style={{ fontSize: '14px', fontWeight: 500 }}>Your generated prompts will appear here</p>
                <p style={{ fontSize: '13px' }}>Fill in the form and click "Generate Image Prompts"</p>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#3b82f6', gap: '16px', paddingTop: '80px' }}>
                <span className="animate-spin" style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid #bfdbfe', borderTopColor: '#3b82f6', borderRadius: '50%' }} />
                <p style={{ fontSize: '14px', fontWeight: 600 }}>Generating {count} coloring book prompts…</p>
              </div>
            )}

            {prompts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.5px' }}>
                    {prompts.length} PAGES GENERATED
                  </span>
                  <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>
                    {ageGroup} · {category}
                  </span>
                </div>

                {prompts.map((page) => (
                  <div
                    key={page.index}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      backgroundColor: 'white',
                    }}
                  >
                    {/* Page header */}
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8faff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '26px', height: '26px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                          {page.index}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>{page.title || `Page ${page.index}`}</div>
                          {page.theme && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Theme: {page.theme}</div>}
                        </div>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(
                          `[VISUAL COLOR GUIDE]\n${page.colorGuide}\n\n[COLOR ME!]\n${page.coloringPage}`
                        )}
                        style={{ padding: '5px 10px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Copy size={12} /> Copy Both
                      </button>
                    </div>

                    {/* Two-column prompt area */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                      {/* Left — Color Guide */}
                      <div style={{ padding: '16px 18px', borderRight: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ display: 'inline-block', backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                            VISUAL COLOR GUIDE
                          </span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>KDP Left Page</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.65 }}>
                          {page.colorGuide}
                        </p>
                        <button
                          onClick={() => navigator.clipboard.writeText(page.colorGuide)}
                          style={{ marginTop: '12px', padding: '5px 12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                        >
                          <Copy size={11} /> Copy Prompt
                        </button>
                      </div>

                      {/* Right — Coloring Page */}
                      <div style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ display: 'inline-block', backgroundColor: '#fef3c7', color: '#d97706', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                            COLOR ME!
                          </span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>KDP Right Page</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.65 }}>
                          {page.coloringPage}
                        </p>
                        <button
                          onClick={() => navigator.clipboard.writeText(page.coloringPage)}
                          style={{ marginTop: '12px', padding: '5px 12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                        >
                          <Copy size={11} /> Copy Prompt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
