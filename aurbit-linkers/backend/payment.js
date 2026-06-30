const express = require('express');
const cors = require('cors');
const https = require('https');
const Groq = require("groq-sdk")
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

console.log("CASHFREE_APP_ID:", process.env.CASHFREE_APP_ID);
console.log("CASHFREE_SECRET_KEY:", process.env.CASHFREE_SECRET_KEY ? "***loaded***" : "undefined");

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg/orders";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.post('/api/create-order', async (req, res) => {
  try {
    console.log("Request body:", req.body);
    
    const { amount, customerName, customerEmail, customerPhone } = req.body;

    const orderId = "order_" + Date.now();
    const orderToken = "token_" + Date.now();
    
    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: "cust_" + Date.now(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      },
      order_meta: {
        return_url: "http://localhost:5173/service/dsc/payment-callback?order_id=" + orderId
      }
    };

    console.log("Cashfree API request:", JSON.stringify(orderData));

    const postData = JSON.stringify(orderData);

    const options = {
      hostname: 'sandbox.cashfree.com',
      path: '/pg/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
          try {
            resolve({ status: response.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: response.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
    
    console.log("Cashfree response status:", response.status);
    const responseText = JSON.stringify(response.data);
    console.log("Cashfree raw response:", responseText);
    const data = response.data;
    console.log("payment_session_id:", data.payment_session_id);
    
    // Return the full response including payment_session_id
    res.json(data);
  } catch (error) {
    console.error('Error creating Cashfree order:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/ai-chat', async (req, res) => {
  const { messages } = req.body
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are Aurbit AI, a helpful compliance assistant for Aurbit Linkers. Answer in SHORT, structured format only: - Use maximum 3-4 bullet points - Each point max 1 line - No long paragraphs - Use emojis for each point - End with ONE follow-up question like 'Would you like to know about pricing or process?' - Never dump everything at once" },
        ...messages.filter(m => m.role === "user")
      ],
      max_tokens: 512
    })
    res.json({ reply: completion.choices[0].message.content })
  } catch (err) {
    console.error("Groq error:", err)
    res.status(500).json({ reply: "Sorry, I could not process your request." })
  }
});

app.listen(PORT, () => {
  console.log(`Payment proxy server running on port ${PORT}`);
});