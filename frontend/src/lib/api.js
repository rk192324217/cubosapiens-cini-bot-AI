// All API calls go through our Cloudflare Worker — never directly to Gemini.
// The Worker holds the secret API key in its environment variables.
// This file is safe to ship in the frontend bundle.

const API_BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Send a chat message through our Worker proxy.
 * @param {Array} history - Array of { role: 'user'|'model', parts: [{text}] }
 * @param {string} userMessage - The new user message
 * @returns {Promise<string>} - The assistant's reply text
 */
export async function sendChat(history, userMessage) {
  const messages = [
    ...history,
    { role: 'user', parts: [{ text: userMessage }] },
  ]

  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }

  const data = await res.json()
  return data.reply
}
