import { useState, useCallback } from 'react'
import { sendChat } from '../lib/api'

export function useChat() {
  const [messages, setMessages] = useState([])   // { role, content, id }
  const [history, setHistory] = useState([])      // Gemini format for API
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return

    const userMsg = { id: Date.now(), role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const reply = await sendChat(history, text.trim())

      const botMsg = { id: Date.now() + 1, role: 'bot', content: reply }
      setMessages(prev => [...prev, botMsg])

      // Update Gemini-format history
      setHistory(prev => [
        ...prev,
        { role: 'user',  parts: [{ text: text.trim() }] },
        { role: 'model', parts: [{ text: reply }] },
      ])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [history, loading])

  const reset = useCallback(() => {
    setMessages([])
    setHistory([])
    setError(null)
  }, [])

  return { messages, loading, error, send, reset }
}
