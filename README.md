# YouSEO Clone (YouTube Creator Toolkit)

A completely free, locally hosted clone of the YouSEO platform, powered by Vite, React, and Google's Gemini AI.

## Features Built
- **Keyword Generator**: AI-driven long-tail keyword analysis and volume estimation.
- **SEO Analysis**: Advanced video SEO checker evaluating thumbnails, titles, descriptions, chapters, and tags, with an inline AI generation modal to fix issues instantly.
- **Channel Details**: YouTube Data API v3 integration to instantly pull channel statistics, profile information, and branding tags from a URL or handle.
- **Title Generator**: AI-powered title ideation that provides 3 optimized variations along with SEO estimations for Reach, Search, and Competition.
- **Description Writer**: AI-driven description structural generator ensuring high conversion (Hooks, Links, Chapters, CTA, Tags).
- **Settings Dashboard**: Local storage implementation for managing Gemini and YouTube API keys without relying on `.env` files.
- **Pixel-perfect UI**: Cloned light-theme dashboard with custom SVGs, layout grids, and interactive tool cards.

## Setup Instructions
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Open `http://localhost:5173` in your browser.
4. Navigate to the **Settings** page (Gear icon in top right) to input your **Gemini API Key** and **YouTube Data API Key**.

## Tech Stack
- React + Vite
- React Router (SPA navigation)
- Lucide React (Icons)
- Google Generative AI (Gemini SDK)
- Fetch API (YouTube Data v3)
