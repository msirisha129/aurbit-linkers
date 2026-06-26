import { useEffect, useState } from "react"
import AIChatModal from "./AIChatModal"

const styles = `
/* ===== CARD HOVER ===== */
.support-card {
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  flex: 1;
  min-width: 280px;
  max-width: 360px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  transition: transform 220ms ease-out, box-shadow 220ms ease-out;
  position: relative;
}
.support-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.13);
}

/* ===== STATUS PILLS ===== */

/* Green pulsing dot */
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf50;
  display: inline-block;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.25); opacity: 1; }
}

/* Lightning bolt flash */
.flash-icon {
  display: inline-block;
  animation: flash-bolt 4s ease-in-out infinite;
}
@keyframes flash-bolt {
  0%, 92%, 100% { opacity: 1; }
  95% { opacity: 0.7; }
  97% { opacity: 1; }
}

/* ===== EMOJI ICON ENTRANCE ===== */
.emoji-icon {
  font-size: 40px;
  margin-bottom: 16px;
  display: block;
  opacity: 1;
  transform: scale(1);
  animation: emoji-entrance 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.emoji-icon-1 { animation-delay: 0ms; }
.emoji-icon-2 { animation-delay: 150ms; }
@keyframes emoji-entrance {
  to { opacity: 1; transform: scale(1); }
}

/* ===== EMOJI WIGGLE ON CARD HOVER ===== */
.support-card:hover .emoji-icon {
  animation: emoji-wiggle 400ms ease-out;
}
@keyframes emoji-wiggle {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(-5deg) scale(1.08); }
  50%  { transform: rotate(5deg) scale(1.08); }
  75%  { transform: rotate(-2deg) scale(1.03); }
  100% { transform: rotate(0deg) scale(1); }
}

/* ===== BUTTONS ===== */
.btn-expert {
  background: #1a2744;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 15px;
  transition: transform 180ms ease, box-shadow 180ms ease;
  transform: scale(1);
}
.btn-expert:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(26,39,68,0.35);
}
.btn-expert:active {
  transform: scale(0.98);
}

.btn-ai {
  background: #C9A84C;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 15px;
  transition: transform 180ms ease, box-shadow 180ms ease;
  transform: scale(1);
}
.btn-ai:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(201,168,76,0.45);
}
.btn-ai:active {
  transform: scale(0.98);
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .support-card { transition: box-shadow 220ms ease-out; }
  .support-card:hover { transform: none; }

  .pulse-dot,
  .flash-icon,
  .emoji-icon,
  .support-card:hover .emoji-icon {
    animation: none !important;
  }

  .emoji-icon { opacity: 1; transform: scale(1); }

  .btn-expert,
  .btn-ai {
    transition: box-shadow 180ms ease;
  }
  .btn-expert:hover,
  .btn-ai:hover {
    transform: none;
  }
  .btn-expert:active,
  .btn-ai:active {
    transform: none;
  }
}
`

export default function ChatSupportSection() {
  const [showAI, setShowAI] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section style={{
      background: "#f5f0e8",
      padding: "80px 24px",
      textAlign: "center"
    }}>
      <style>{styles}</style>
      <p style={{color:"#C9A84C", fontWeight:600, letterSpacing:"0.1em", fontSize:"13px", marginBottom:"8px"}}>GET HELP INSTANTLY</p>
      <h2 style={{color:"#1a2744", fontSize:"32px", fontWeight:700, marginBottom:"8px"}}>Choose How You'd Like to Connect</h2>
      <p style={{color:"#666", marginBottom:"48px"}}>Real experts and AI — available to help you anytime</p>

      <div style={{display:"flex", gap:"24px", justifyContent:"center", flexWrap:"wrap", maxWidth:"800px", margin:"0 auto"}}>
        
        {/* Live Expert Card */}
        <div className="support-card">
          <span className={`emoji-icon ${mounted ? "emoji-icon-1" : ""}`}>👨‍💼</span>
          <div style={{display:"inline-flex", alignItems:"center", gap:"6px", background:"#e8f5e9", color:"#2e7d32", borderRadius:"20px", padding:"4px 12px", fontSize:"12px", fontWeight:600, marginBottom:"16px"}}>
            <span className="pulse-dot"></span>
            Online Now
          </div>
          <h3 style={{color:"#1a2744", fontSize:"22px", fontWeight:700, marginBottom:"12px"}}>Talk to an Expert</h3>
          <p style={{color:"#666", lineHeight:1.6, marginBottom:"24px"}}>Get real-time help from our compliance specialists. Available Mon–Sat, 9AM–6PM IST.</p>
          <button onClick={() => window.Tawk_API && window.Tawk_API.toggle()}
            className="btn-expert">
            Start Live Chat
          </button>
        </div>

        {/* AI Card */}
        <div className="support-card">
          <span className={`emoji-icon ${mounted ? "emoji-icon-2" : ""}`}>🤖</span>
          <div style={{display:"inline-flex", alignItems:"center", gap:"6px", background:"#fff8e1", color:"#f57f17", borderRadius:"20px", padding:"4px 12px", fontSize:"12px", fontWeight:600, marginBottom:"16px"}}>
            <span className="flash-icon">⚡</span> Instant Reply
          </div>
          <h3 style={{color:"#1a2744", fontSize:"22px", fontWeight:700, marginBottom:"12px"}}>Chat with AI Assistant</h3>
          <p style={{color:"#666", lineHeight:1.6, marginBottom:"24px"}}>Get instant answers to GST, trademark, registration and compliance questions — available 24/7.</p>
          <button onClick={() => setShowAI(true)}
            className="btn-ai">
            Ask AI Assistant
          </button>
        </div>

      </div>
      {showAI && <AIChatModal onClose={() => setShowAI(false)} />}
    </section>
  )
}