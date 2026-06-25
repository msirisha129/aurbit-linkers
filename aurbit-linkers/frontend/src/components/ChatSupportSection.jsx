import { useEffect, useState } from "react"
import AIChatModal from "./AIChatModal"

export default function ChatSupportSection() {
  const [showAI, setShowAI] = useState(false)
  return (
    <section style={{
      background: "#f5f0e8",
      padding: "80px 24px",
      textAlign: "center"
    }}>
      <p style={{color:"#C9A84C", fontWeight:600, letterSpacing:"0.1em", fontSize:"13px", marginBottom:"8px"}}>GET HELP INSTANTLY</p>
      <h2 style={{color:"#1a2744", fontSize:"32px", fontWeight:700, marginBottom:"8px"}}>Choose How You'd Like to Connect</h2>
      <p style={{color:"#666", marginBottom:"48px"}}>Real experts and AI — available to help you anytime</p>

      <div style={{display:"flex", gap:"24px", justifyContent:"center", flexWrap:"wrap", maxWidth:"800px", margin:"0 auto"}}>
        
        {/* Live Expert Card */}
        <div style={{background:"white", borderRadius:"16px", padding:"40px 32px", flex:"1", minWidth:"280px", maxWidth:"360px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", transition:"transform 0.2s"}}
          onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"}
          onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
          <div style={{fontSize:"40px", marginBottom:"16px"}}>👨‍💼</div>
          <div style={{display:"inline-flex", alignItems:"center", gap:"6px", background:"#e8f5e9", color:"#2e7d32", borderRadius:"20px", padding:"4px 12px", fontSize:"12px", fontWeight:600, marginBottom:"16px"}}>
            <span style={{width:"8px", height:"8px", borderRadius:"50%", background:"#4caf50", display:"inline-block"}}></span>
            Online Now
          </div>
          <h3 style={{color:"#1a2744", fontSize:"22px", fontWeight:700, marginBottom:"12px"}}>Talk to an Expert</h3>
          <p style={{color:"#666", lineHeight:1.6, marginBottom:"24px"}}>Get real-time help from our compliance specialists. Available Mon–Sat, 9AM–6PM IST.</p>
          <button onClick={() => window.Tawk_API && window.Tawk_API.toggle()}
            style={{background:"#1a2744", color:"white", border:"none", borderRadius:"8px", padding:"12px 28px", fontWeight:600, cursor:"pointer", width:"100%", fontSize:"15px"}}>
            Start Live Chat
          </button>
        </div>

        {/* AI Card */}
        <div style={{background:"white", borderRadius:"16px", padding:"40px 32px", flex:"1", minWidth:"280px", maxWidth:"360px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", transition:"transform 0.2s"}}
          onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"}
          onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
          <div style={{fontSize:"40px", marginBottom:"16px"}}>🤖</div>
          <div style={{display:"inline-flex", alignItems:"center", gap:"6px", background:"#fff8e1", color:"#f57f17", borderRadius:"20px", padding:"4px 12px", fontSize:"12px", fontWeight:600, marginBottom:"16px"}}>
            ⚡ Instant Reply
          </div>
          <h3 style={{color:"#1a2744", fontSize:"22px", fontWeight:700, marginBottom:"12px"}}>Chat with AI Assistant</h3>
          <p style={{color:"#666", lineHeight:1.6, marginBottom:"24px"}}>Get instant answers to GST, trademark, registration and compliance questions — available 24/7.</p>
          <button onClick={() => setShowAI(true)}
            style={{background:"#C9A84C", color:"white", border:"none", borderRadius:"8px", padding:"12px 28px", fontWeight:600, cursor:"pointer", width:"100%", fontSize:"15px"}}>
            Ask AI Assistant
          </button>
        </div>

      </div>
      {showAI && <AIChatModal onClose={() => setShowAI(false)} />}
    </section>
  )
}