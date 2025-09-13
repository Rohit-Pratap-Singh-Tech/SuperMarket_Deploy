import React, { useState, useRef, useEffect } from 'react'
import { aiAPI } from '../services/api'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', text: 'Hi! I can help with sales, products, and transactions. Ask me anything.' }
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isSending) return

    const userMsg = { id: `u-${Date.now()}`,'role':'user','text': trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsSending(true)
    try {
      const data = await aiAPI.askAssistant(trimmed)
      const answer = data?.answer || data?.error || 'No response'
      setMessages(prev => [...prev, { id: `a-${Date.now()}`,'role':'assistant','text': String(answer) }])
    } catch (e) {
      const serverMsg = e?.response?.data?.error || e?.message || 'Network error'
      setMessages(prev => [...prev, { id: `e-${Date.now()}`,'role':'assistant','text': `Error: ${serverMsg}` }])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ position: 'fixed', right: '16px', bottom: '16px', zIndex: 1000 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#2563eb', color: 'white', borderRadius: '9999px', padding: '12px 16px',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)', border: 'none', cursor: 'pointer'
          }}
        >
          Chat
        </button>
      )}

      {isOpen && (
        <div
          style={{
            width: '340px', maxHeight: '60vh', background: 'white', borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid #e5e7eb'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#1f2937', color: 'white' }}>
            <div style={{ fontWeight: 600 }}>AI Assistant</div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>

          <div ref={scrollRef} style={{ padding: '12px', height: '320px', overflowY: 'auto', background: '#f9fafb' }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', marginBottom: '10px', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 12px', borderRadius: '12px',
                  background: m.role === 'user' ? '#2563eb' : 'white', color: m.role === 'user' ? 'white' : '#111827',
                  border: m.role === 'user' ? 'none' : '1px solid #e5e7eb'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div style={{ color: '#6b7280', fontSize: '12px' }}>Assistant is typing…</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', padding: '10px', borderTop: '1px solid #e5e7eb', background: 'white' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about sales, products, or transactions"
              rows={1}
              style={{ flex: 1, resize: 'none', padding: '10px', borderRadius: '12px', border: '1px solid #e5e7eb' }}
            />
            <button onClick={sendMessage} disabled={isSending || !input.trim()} style={{
              background: '#2563eb', color: 'white', borderRadius: '12px', padding: '10px 14px', border: 'none', cursor: 'pointer', opacity: isSending || !input.trim() ? 0.6 : 1
            }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatbot


