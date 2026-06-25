import { useSearchParams } from "react-router-dom"
export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get("order_id")
  return (
    <div style={{textAlign:"center", padding:"80px", background:"#f5f0e8", minHeight:"100vh"}}>
      <div style={{fontSize:"64px"}}>✅</div>
      <h1 style={{color:"#1a2744", fontSize:"32px"}}>Payment Successful!</h1>
      <p style={{color:"#666"}}>Order ID: {orderId}</p>
      <p>Your application has been submitted successfully.</p>
      <a href="/dashboard" style={{background:"#1a2744", color:"white", padding:"12px 24px", borderRadius:"8px", textDecoration:"none"}}>
        Go to Dashboard
      </a>
    </div>
  )
}
