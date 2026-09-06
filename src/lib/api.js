import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper to get keys from localStorage or fallback to .env
export const getKeys = () => {
  return {
    youtube: localStorage.getItem('YOUTUBE_API_KEY') || import.meta.env.VITE_YOUTUBE_API_KEY || '',
    gemini: localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || ''
  };
};

export const saveKeys = (youtube, gemini) => {
  localStorage.setItem('YOUTUBE_API_KEY', youtube);
  localStorage.setItem('GEMINI_API_KEY', gemini);
};

// -----------------------------------------
// YOUTUBE API METHODS
// -----------------------------------------

export function extractVideoId(url) {
  if (!url) return null;
  if (url.length === 11 && !url.includes('/')) return url;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export async function fetchVideoDetails(videoId) {
  const { youtube } = getKeys();
  if (!youtube || youtube === 'your_youtube_api_key_here') {
    throw new Error("YouTube API Key is missing. Please add it in Settings.");
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${youtube}`
  );
  
  if (res.status === 403) {
    throw new Error("YouTube API Key is invalid or quota exceeded.");
  }

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("Video not found or invalid ID.");
  }

  return data.items[0];
}

export async function fetchChannelDetails(input) {
  const { youtube } = getKeys();
  if (!youtube || youtube === 'your_youtube_api_key_here') {
    throw new Error("YouTube API Key is missing. Please add it in Settings.");
  }

  let id = null;
  let handle = null;

  input = input.trim();
  if (input.includes('youtube.com/channel/')) {
    id = input.split('youtube.com/channel/')[1].split('/')[0].split('?')[0];
  } else if (input.includes('youtube.com/@')) {
    handle = input.split('youtube.com/@')[1].split('/')[0].split('?')[0];
  } else if (input.startsWith('UC')) {
    id = input;
  } else if (input.startsWith('@')) {
    handle = input.substring(1); // remove @
  } else {
    handle = input; // try bare handle
  }

  let url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&key=${youtube}`;
  if (id) {
    url += `&id=${id}`;
  } else if (handle) {
    url += `&forHandle=${handle}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found.");
  }

  return data.items[0];
}

// -----------------------------------------
// GEMINI API METHODS
// -----------------------------------------

export async function generateOptimization(type, videoData, extraDetails = '') {
  const { gemini } = getKeys();
  if (!gemini || gemini === 'your_gemini_api_key_here') {
    throw new Error("Gemini API Key is missing.");
  }
  
  const genAI = new GoogleGenerativeAI(gemini);
  const modelName = await getAvailableModel(gemini);
  const model = genAI.getGenerativeModel({ model: modelName });
  
  let prompt = '';
  if (type === 'desc') {
    prompt = `You are a viral YouTube SEO expert. Write a highly optimized, high-converting YouTube description for a video titled "${videoData.title}" (from channel "${videoData.channelTitle}").
    
Here is the original description for this video:
"""
${videoData.description || 'None provided'}
"""

You MUST output the description in the EXACT language of the video title.
You MUST follow this exact structure and formatting:

1. Hook & Summary (2 paragraphs): Start with an engaging question related to the title. Explain what the viewer will learn in simple, exciting terms.
2. Preserved Links: You MUST extract and preserve ALL URLs/links from the original description (like WhatsApp, Instagram, or affiliate links). Keep them exactly as they were. Do not use placeholders. If there were no links in the original description, skip this section entirely.
3. Chapters: Include a "⏱ Chapters" heading, followed by 5 realistic, chronological timestamps starting at "0:00", describing key moments.
4. Engagement: Ask a specific question to the viewers and tell them to answer in the comments.
5. Subscribe CTA: Tell the viewer to subscribe to "${videoData.channelTitle}" for more similar content.
6. Hashtags: Add 5 to 10 highly relevant, trending hashtags at the very bottom.

Return ONLY the final description text exactly as requested. Do not include markdown blocks or conversational text.`;
  } else if (type === 'title') {
    prompt = `You are a viral YouTube SEO expert. Write EXACTLY ONE highly optimized, click-worthy YouTube title for a video currently titled "${videoData.title}".
- You MUST output the title in the EXACT SAME LANGUAGE as the original video title.
- Keep it under 70 characters.
- Put the most interesting hook/keyword at the very beginning.
- Use minimal caps.
- Also provide a short 1-sentence explanation (in English) of why this title is highly optimized.
- You MUST return the output in this EXACT format, with no markdown code blocks and no extra text:
[The Optimized Title]|||[The 1-sentence explanation]`;
  } else if (type === 'chapters') {
    prompt = `Write a highly optimized YouTube timestamp chapter list for a video titled "${videoData.title}".
- You MUST output the chapter text in the EXACT SAME LANGUAGE as the original video title.
- Start exactly with "0:00 Intro" (translated into the video's language).
- Provide 5 to 8 realistic chronological timestamps based on what the video is likely about.
- Make the chapter titles keyword-rich.
- Return ONLY the timestamps format (e.g. 0:00 Chapter Title), no markdown blocks.`;
  } else if (type === 'tags') {
    prompt = `Generate a comma-separated list of 15 highly searched, long-tail YouTube tags/keywords for a video titled "${videoData.title}". 
- You MUST output the tags in the EXACT SAME LANGUAGE as the original video title.
- Include common misspellings.
- Order from most relevant to broad.
- Return ONLY the comma-separated list of tags, no markdown blocks.`;
  } else {
    prompt = `Generate optimized ${type} for video: ${videoData.title}`;
  }

  if (extraDetails.trim()) {
    prompt += `\n\nADDITIONAL INSTRUCTIONS FROM THE USER:\n"${extraDetails}"\nYou MUST incorporate these instructions into your generated output.`;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateTitleFromTopic(topic, language, format) {
  const { gemini } = getKeys();
  if (!gemini || gemini === 'your_gemini_api_key_here') {
    throw new Error("Gemini API Key is missing. Please add it in Settings.");
  }
  
  const genAI = new GoogleGenerativeAI(gemini);
  const modelName = await getAvailableModel(gemini);
  const model = genAI.getGenerativeModel({ model: modelName });
  
  const prompt = `You are a viral YouTube SEO expert. Generate 3 highly optimized, click-worthy YouTube titles for a ${format} about: "${topic}".
- The titles MUST be in this exact language: ${language}.
- Keep each under ${format === 'shorts' ? '50' : '70'} characters.
- Put the most interesting hook/keyword at the very beginning.
- Evaluate the topic's SEO potential and generate realistic AI insights.

Return the results STRICTLY as a JSON object, with no markdown formatting.
The object MUST have this exact schema:
{
  "score": (number between 70 and 99),
  "searchEstimate": (string, formatted with commas, e.g., "45,000"),
  "competition": (string, exactly "Low", "Medium", or "High"),
  "reachEstimate": (string, formatted with commas, e.g., "25,000"),
  "titles": [
    "Title 1",
    "Title 2",
    "Title 3"
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];
    return JSON.parse(text);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate titles or parse response.");
  }
}

export async function generateDescriptionFromTopic(topic, language, format) {
  const { gemini } = getKeys();
  if (!gemini || gemini === 'your_gemini_api_key_here') {
    throw new Error("Gemini API Key is missing. Please add it in Settings.");
  }
  
  const genAI = new GoogleGenerativeAI(gemini);
  const modelName = await getAvailableModel(gemini);
  const model = genAI.getGenerativeModel({ model: modelName });
  
  const prompt = `You are a viral YouTube SEO expert. Write a highly optimized, high-converting YouTube description for a ${format} about: "${topic}".
  
You MUST output the description in the EXACT language: ${language}.
You MUST follow this exact structure and formatting:

1. Hook & Summary (2 paragraphs): Start with an engaging question related to the topic. Explain what the viewer will learn in simple, exciting terms.
2. Chapters: Include a "⏱ Chapters" heading, followed by 5 realistic, chronological timestamps starting at "0:00", describing key moments. (Skip this if format is 'shorts').
3. Engagement: Ask a specific question to the viewers and tell them to answer in the comments.
4. Subscribe CTA: Tell the viewer to subscribe for more similar content.
5. Hashtags: Add 5 to 10 highly relevant, trending hashtags at the very bottom.

Return ONLY the final description text exactly as requested. Do not include markdown blocks or conversational text.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function getAvailableModel(geminiKey) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
    const data = await res.json();
    if (!data.models) return "gemini-1.5-flash"; // fallback
    
    // Find the first model that supports generateContent and has 'gemini' in its name
    const suitableModel = data.models.find(m => 
      m.supportedGenerationMethods?.includes("generateContent") && 
      m.name.includes("gemini") && 
      !m.name.includes("vision")
    );
    
    return suitableModel ? suitableModel.name.replace('models/', '') : "gemini-1.5-flash";
  } catch (err) {
    return "gemini-1.5-flash";
  }
}

export async function generateKeywords(topic, language) {
  const { gemini } = getKeys();
  if (!gemini || gemini === 'your_gemini_api_key_here') {
    throw new Error("Gemini API Key is missing. Please add it in Settings.");
  }
  
  const genAI = new GoogleGenerativeAI(gemini);
  const modelName = await getAvailableModel(gemini);
  const model = genAI.getGenerativeModel({ model: modelName });
  
  const prompt = `
  You are an expert YouTube SEO analyst. 
  Generate 10 highly optimized, long-tail keyword phrases related to the topic: "${topic}".
  The language should be: ${language}.
  
  Return the results STRICTLY as a JSON array of objects, with no markdown formatting or extra text.
  Each object must have:
  - "keyword" (string): the keyword phrase
  - "searchVolume" (string): estimated volume like "High", "Medium", "Low"
  - "competition" (string): estimated competition like "High", "Medium", "Low"
  - "score" (number): an overall SEO score out of 100
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) text = jsonMatch[0];
    
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    throw new Error(`Gemini Error: ${err.message || 'Failed to parse JSON'}`);
  }
}

export async function analyzeVideoSEO(title, description, tags) {
  const { gemini } = getKeys();
  if (!gemini || gemini === 'your_gemini_api_key_here') {
    throw new Error("Gemini API Key is missing. Please add it in Settings.");
  }

  const genAI = new GoogleGenerativeAI(gemini);
  const modelName = await getAvailableModel(gemini);
  const model = genAI.getGenerativeModel({ model: modelName });
  
  const prompt = `
  You are an expert YouTube SEO auditor. Analyze the following video metadata:
  Title: "${title}"
  Description: "${description || 'None'}"
  Tags: "${tags?.join(', ') || 'None'}"
  
  Evaluate it against best practices (e.g. title length 40-70 chars, keyword usage, description depth).
  
  Return the results STRICTLY as a JSON object, with no markdown formatting.
  The object must have:
  - "overallScore" (number): 0 to 100
  - "titleFeedback" (string): Actionable advice for the title
  - "titlePassed" (boolean): true if title is good
  - "descFeedback" (string): Actionable advice for the description
  - "descPassed" (boolean): true if description is good
  - "tagsFeedback" (string): Actionable advice for the tags
  - "tagsPassed" (boolean): true if tags are good
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) text = jsonMatch[0];

    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    throw new Error(`Gemini Error: ${err.message || 'Failed to parse JSON'}`);
  }
}
