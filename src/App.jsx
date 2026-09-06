import { Routes, Route, NavLink, Navigate, Link as RouterLink } from 'react-router-dom';
import { 
  Search, Flame, Activity, Monitor,
  Type, FileText, Clapperboard, Megaphone,
  Magnet, Lightbulb, Wand2,
  BarChart2, Image as ImageIcon, Target, Clock, Scan,
  Globe, Moon, PlaySquare, Settings as SettingsIcon
} from 'lucide-react';

import KeywordGenerator from './tools/KeywordGenerator';
import SeoAnalysis from './tools/SeoAnalysis';
import ChannelDetails from './tools/ChannelDetails';
import TitleGenerator from './tools/TitleGenerator';
import DescriptionWriter from './tools/DescriptionWriter';
import ScriptBuilder from './tools/ScriptBuilder';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>YouSEO</span>
              <span className="sidebar-subtitle">YouTube Creator Toolkit</span>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section-title">RESEARCH & DISCOVERY</div>
          
          <NavLink to="/keyword-generator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Search size={18} /> Keyword Generator
          </NavLink>
          
          <NavLink to="/trending" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Flame size={18} /> Trending Video Ideas
          </NavLink>
          
          <NavLink to="/seo-analysis" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={18} /> SEO Analysis
          </NavLink>
          
          <NavLink to="/channel-details" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Monitor size={18} /> Channel Details
          </NavLink>

          <div className="nav-section-title" style={{ marginTop: '8px' }}>CONTENT CREATION</div>
          
          <NavLink to="/title-generator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Type size={18} /> Title Generator
          </NavLink>
          
          <NavLink to="/description-writer" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={18} /> Description Writer
          </NavLink>
          
          <NavLink to="/script-builder" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Clapperboard size={18} /> Script Builder
          </NavLink>
          
          <NavLink to="/community-post" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Megaphone size={18} /> Community Post Generator
          </NavLink>
          
          <NavLink to="/viral-hook" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Magnet size={18} /> Viral Hook Writer
          </NavLink>

          <NavLink to="/viral-ideas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Lightbulb size={18} /> Viral Video Ideas
          </NavLink>

          <NavLink to="/content-generator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Wand2 size={18} /> Content Generator
          </NavLink>

          <div className="nav-section-title" style={{ marginTop: '8px' }}>OPTIMIZE & GROW</div>

          <NavLink to="/channel-report" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 size={18} /> Channel Report
          </NavLink>
          
          <NavLink to="/thumbnail-maker" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ImageIcon size={18} /> Thumbnail Maker
          </NavLink>
          
          <NavLink to="/thumbnail-score" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Target size={18} /> Thumbnail Click Score
          </NavLink>
          
          <NavLink to="/best-time" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Clock size={18} /> Best Time to Post
          </NavLink>

          <NavLink to="/content-extractor" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Scan size={18} /> Content Extractor
          </NavLink>
        </nav>
      </aside>
      
      <main className="main-content">
        <div className="topbar">
          <button className="topbar-btn">
            <Globe size={16} /> EN
          </button>
          <button className="topbar-icon-btn">
            <Moon size={18} />
          </button>
          <RouterLink to="/settings" className="topbar-icon-btn" title="Settings & API Keys">
            <SettingsIcon size={18} />
          </RouterLink>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/keyword-generator" replace />} />
          <Route path="/keyword-generator" element={<KeywordGenerator />} />
          <Route path="/seo-analysis" element={<SeoAnalysis />} />
          <Route path="/channel-details" element={<ChannelDetails />} />
          <Route path="/title-generator" element={<TitleGenerator />} />
          <Route path="/description-writer" element={<DescriptionWriter />} />
          <Route path="/script-builder" element={<ScriptBuilder />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={
            <div style={{ padding: '0 48px' }}>
              <h1 className="page-title">Coming Soon</h1>
              <p className="page-subtitle">This tool is currently under construction.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
