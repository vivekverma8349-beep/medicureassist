import { useEffect, useRef, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { createChat, getChats, getSingleChat, sendMessage } from '../services/chatService'
import Loader from '../components/Loader'

const ChatbotPage = () => {
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { fetchChats() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [selectedChat?.messages])

  const fetchChats = async () => {
    setLoading(true)
    try {
      const data = await getChats()
      setChats(data.chats || [])
    } catch (e) {}
    setLoading(false)
  }

  const handleCreateChat = async () => {
    const data = await createChat()
    fetchChats()
    setSelectedChat(data.chat)
  }

  const openChat = async (chatId) => {
    const data = await getSingleChat(chatId)
    setSelectedChat(data.chat)
  }

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return
    setSending(true)
    try {
      const data = await sendMessage(selectedChat._id, message)
      setSelectedChat(data.chat)
      setMessage('')
    } catch (e) {}
    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>AI Health Chat</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Ask health questions, get AI-powered insights</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 220px)' }}>
        {/* Sidebar */}
        <div className="card" style={{ width: '260px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <button onClick={handleCreateChat} style={{
              width: '100%', padding: '10px', background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
              fontWeight: 600, fontFamily: 'DM Sans, sans-serif', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Chat
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {loading ? <Loader text="Loading chats..." /> :
              chats.length === 0 ?
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '30px 10px' }}>
                  No chats yet. Start a new one!
                </div> :
                chats.map(chat => (
                  <div key={chat._id} onClick={() => openChat(chat._id)} style={{
                    padding: '12px', borderRadius: '10px', cursor: 'pointer',
                    marginBottom: '4px', fontSize: '13px', fontWeight: 500,
                    background: selectedChat?._id === chat._id ? '#eff6ff' : 'transparent',
                    color: selectedChat?._id === chat._id ? '#2563eb' : '#475569',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                  onMouseEnter={e => { if (selectedChat?._id !== chat._id) e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { if (selectedChat?._id !== chat._id) e.currentTarget.style.background = 'transparent' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {chat.title || 'New Chat'}
                  </div>
                ))
            }
          </div>
        </div>

        {/* Chat area */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedChat ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Start a Conversation</p>
              <p style={{ fontSize: '13px' }}>Select a chat or create a new one</p>
            </div>
          ) : (
            <>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                {selectedChat.title || 'AI Health Assistant'}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedChat.messages?.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%', padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.role === 'user' ? '#2563eb' : '#f1f5f9',
                      color: msg.role === 'user' ? 'white' : '#1e293b',
                      fontSize: '14px', lineHeight: '1.5'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', background: '#f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8',
                            animation: `bounce 1s ${i * 0.15}s infinite`,
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                <input
                  type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Ask a health question..."
                  style={{
                    flex: 1, padding: '11px 16px', border: '1.5px solid #e2e8f0', borderRadius: '10px',
                    fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none', color: '#0f172a'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button onClick={handleSend} disabled={sending || !message.trim()} style={{
                  padding: '11px 20px', background: '#2563eb', color: 'white', border: 'none',
                  borderRadius: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600, fontSize: '14px', opacity: sending || !message.trim() ? 0.6 : 1
                }}>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }`}</style>
    </MainLayout>
  )
}

export default ChatbotPage
