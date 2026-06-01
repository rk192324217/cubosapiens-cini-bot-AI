/**
 * CineAI — Cloudflare Worker (API Proxy)
 *
 * This worker sits between the React frontend and the Gemini API.
 * The GEMINI_API_KEY secret is stored in Cloudflare's environment —
 * it is NEVER sent to the browser or included in the frontend bundle.
 *
 * Security layers implemented here:
 *  1. CORS origin check  — only your Pages domain can call this
 *  2. Rate limiting       — via Cloudflare's built-in IP-based limits (configure in dashboard)
 *  3. Request validation  — checks content-type, message structure, length
 *  4. Error sanitization  — Gemini errors are not leaked raw to the client
 */

const SYSTEM_PROMPT = `You are CineAI, the world's most knowledgeable and passionate movie and TV series expert. You have encyclopedic knowledge of:
- Films and series across all genres, eras, and languages (Hollywood, Bollywood, Korean cinema, French New Wave, Japanese anime, etc.)
- Actors, directors, cinematographers, composers, screenwriters, producers
- Plot summaries, themes, symbolism, Easter eggs, and trivia
- Box office numbers, awards history, critical and audience reception
- Streaming platform availability (general knowledge)
- Behind-the-scenes production stories and film history

Personality: Enthusiastic, opinionated when asked for recommendations, precise with details, and genuinely passionate about cinema. Use bullet points and bold text (markdown) for lists and key info. Keep answers focused and engaging. If asked something unrelated to movies or TV, politely redirect. Never fabricate facts — if genuinely unsure, say so clearly.`

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Allowed origins — update with your actual Pages URL after deploying
const ALLOWED_ORIGINS = [
  'http://localhost:5173',   // local dev
  'http://localhost:4173',   // vite preview
  // Add your Cloudflare Pages URL, e.g.:
  // 'https://cineai.pages.dev',
  // 'https://yourcustomdomain.com',
]

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function jsonResponse(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const url = new URL(request.url)

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    // Only handle POST /api/chat
    if (url.pathname !== '/api/chat' || request.method !== 'POST') {
      return jsonResponse({ error: 'Not found' }, 404, origin)
    }

    // Validate content type
    const ct = request.headers.get('Content-Type') || ''
    if (!ct.includes('application/json')) {
      return jsonResponse({ error: 'Invalid content type' }, 400, origin)
    }

    // Check API key is configured
    if (!env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY secret is not set in Cloudflare Worker environment')
      return jsonResponse({ error: 'Service not configured' }, 503, origin)
    }

    // Parse and validate body
    let body
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, origin)
    }

    const { messages } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: 'messages array is required' }, 400, origin)
    }

    // Guard: cap conversation length to prevent abuse
    if (messages.length > 100) {
      return jsonResponse({ error: 'Conversation too long. Please start a new chat.' }, 400, origin)
    }

    // Validate each message shape
    for (const m of messages) {
      if (!m.role || !Array.isArray(m.parts) || !m.parts[0]?.text) {
        return jsonResponse({ error: 'Invalid message format' }, 400, origin)
      }
      if (typeof m.parts[0].text !== 'string' || m.parts[0].text.length > 4000) {
        return jsonResponse({ error: 'Message too long' }, 400, origin)
      }
    }

    // Call Gemini — key is injected server-side from Cloudflare secrets
    try {
      const geminiRes = await fetch(`${GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages,
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1024,
            topP: 0.95,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      })

      const geminiData = await geminiRes.json()

      if (!geminiRes.ok || geminiData.error) {
        // Don't leak raw Gemini errors to the client
        console.error('Gemini API error:', JSON.stringify(geminiData))
        return jsonResponse({ error: 'AI service error. Please try again.' }, 502, origin)
      }

      const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

      if (!reply) {
        return jsonResponse({ error: 'No response from AI. Try again.' }, 502, origin)
      }

      return jsonResponse({ reply }, 200, origin)

    } catch (err) {
      console.error('Worker fetch error:', err)
      return jsonResponse({ error: 'Internal error. Please try again.' }, 500, origin)
    }
  },
}
