import { useState } from "react"

export default function AIChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Aurbit AI 🤖 What would you like help with today?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const quickActions = [
    { icon: "📋", label: "ICEGATE Registration", action: "Tell me about ICEGATE registration" },
    { icon: "💰", label: "GST Registration", action: "Tell me about GST registration" },
    { icon: "™️", label: "Trademark Registration", action: "Tell me about trademark registration" },
    { icon: "🏢", label: "Company Registration", action: "Tell me about company registration" },
    { icon: "🌐", label: "Import Export Code (IEC)", action: "Tell me about Import Export Code" },
    { icon: "💬", label: "Talk to an Expert", action: "I want to talk to an expert" }
  ]

  const getSuggestions = (content) => {
    if (content.toLowerCase().includes('icegate')) {
      return ['Documents required', 'Process & timeline', 'Pricing', 'Talk to expert']
    }
    if (content.toLowerCase().includes('gst')) {
      return ['GST registration', 'GST filing', 'GST pricing', 'Talk to expert']
    }
    if (content.toLowerCase().includes('trademark')) {
      return ['Trademark process', 'Documents needed', 'Pricing', 'Talk to expert']
    }
    if (content.toLowerCase().includes('business') || content.toLowerCase().includes('registration')) {
      return ['Pvt Ltd Company', 'LLP Registration', 'OPC Registration', 'Pricing']
    }
    return ['ICEGATE Registration', 'GST Filing', 'Trademark', 'Income Tax']
  }

  const send = async (text) => {
    const message = text || input
    if (!message.trim()) return
    setHasInteracted(true)
    const userMsg = { role: "user", content: message }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("http://localhost:3001/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated })
      })
      const data = await res.json()
      setMessages([...updated, { role: "assistant", content: data.reply }])
    } catch {
      setMessages([...updated, { role: "assistant", content: "Connection error. Please try again." }])
    }
    setLoading(false)
  }

  const handleQuickAction = (action) => {
    send(action)
  }

  const WelcomeScreen = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "20px 16px",
      textAlign: "center"
    }}>
      <div style={{
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1a2744 0%, #C9A84C 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        marginBottom: "14px",
        boxShadow: "0 4px 16px rgba(26, 39, 68, 0.15)"
      }}>
        🤖
      </div>
      
      <h2 style={{
        margin: "0 0 6px 0",
        color: "#1a2744",
        fontSize: "18px",
        fontWeight: 700
      }}>
        Welcome to Aurbit AI
      </h2>
      
      <p style={{
        margin: "0 0 18px 0",
        color: "#666",
        fontSize: "12px",
        lineHeight: 1.4,
        maxWidth: "260px"
      }}>
        Your intelligent compliance assistant for GST, Income Tax, ICEGATE, Trademark & more
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "8px",
        width: "100%",
        maxWidth: "300px"
      }}>
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickAction(action.action)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "10px 8px",
              background: "white",
              border: "1.5px solid #e0e0e0",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "11px",
              fontWeight: 500,
              color: "#1a2744",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C9A84C"
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(201, 168, 76, 0.15)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e0e0e0"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.03)"
            }}
          >
            <span style={{ fontSize: "20px" }}>{action.icon}</span>
            <span style={{ fontSize: "10px", lineHeight: 1.2, textAlign: "center" }}>{action.label}</span>
          </button>
        ))}
      </div>

      <p style={{
        margin: "16px 0 0 0",
        color: "#999",
        fontSize: "10px"
      }}>
        Powered by Aurbit Linkers
      </p>
    </div>
  )

  return (
    <div style={{
      position: "fixed", bottom: 0, right: "24px", width: "360px", height: "540px",
      background: "white", borderRadius: "14px 14px 0 0",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", zIndex: 9999,
      display: "flex", flexDirection: "column", overflow: "hidden"
    }}>
        <div style={{
          padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex",
          justifyContent: "space-between", alignItems: "center"
        }}>
          <h3 style={{ margin: 0, color: "#1a2744", fontSize: "16px" }}>AI Assistant</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#666"
          }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {!hasInteracted && messages.length === 1 ? (
            <WelcomeScreen />
          ) : (
            messages.map((msg, i) => (
              <div key={i}>
                <div style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#1a2744" : "#f5f5f5",
                  color: msg.role === "user" ? "white" : "#1a2744",
                  padding: "8px 12px", borderRadius: "10px", maxWidth: "80%",
                  textAlign: "left"
                }}>
                  <div style={{textAlign:'left', fontSize:'13px', lineHeight:1.6}}>
                    <span dangerouslySetInnerHTML={{ __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/^[-•]\s(.+)/gm, '<div style="margin:3px 0">• $1</div>')
                      .replace(/^\d+\.\s(.+)/gm, '<div style="margin:3px 0">$&</div>')
                      .replace(/\n\n/g, '<br/><br/>')
                      .replace(/\n/g, '<br/>')
                    }} />
                  </div>
                </div>
                {msg.role === 'assistant' && i === messages.length - 1 && (
                  <div style={{display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'6px'}}>
                    {getSuggestions(msg.content).map((s, idx) => (
                      <button key={idx} 
                        onClick={() => { setInput(s); setTimeout(() => send(), 100) }}
                        style={{
                          background:'white', 
                          border:'1.5px solid #1a2744', 
                          color:'#1a2744',
                          borderRadius:'16px', 
                          padding:'5px 10px', 
                          fontSize:'11px',
                          cursor:'pointer',
                          fontWeight:500
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          {loading && <div style={{ alignSelf: "flex-start", color: "#666", fontSize: "11px" }}>AI is typing...</div>}
        </div>
        <div style={{ padding: "10px 12px", borderTop: "1px solid #eee", display: "flex", gap: "6px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type your message..."
            style={{
              flex: 1, padding: "8px 10px", border: "1px solid #ddd", borderRadius: "6px",
              fontSize: "13px", outline: "none"
            }}
          />
          <button onClick={() => send()} disabled={loading} style={{
            background: "#C9A84C", color: "white", border: "none", borderRadius: "6px",
            padding: "8px 14px", fontWeight: 600, cursor: "pointer", fontSize: "13px", opacity: loading ? 0.7 : 1
          }}>Send</button>
        </div>
      </div>
  )
}