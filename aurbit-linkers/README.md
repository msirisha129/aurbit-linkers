# Aurbit Linkers

India-focused AI-powered corporate registrations and compliance platform — a full-stack
implementation with a React frontend and a Node.js/Express/MongoDB backend.

## Quick start (run both together)

You need **two terminals** — one for the backend, one for the frontend. MongoDB must be
running (locally or via Atlas) before you start the backend.

### Terminal 1 — Backend

```bash
cd backend
npm install
cp .env.example .env      # edit MONGO_URI and JWT_SECRET inside
npm run seed               # populates the mega-menu service catalog
npm run dev                 # starts the API on http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
cp .env.example .env       # defaults to http://localhost:5000/api, change if needed
npm run dev                  # starts the site on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

## What you get out of the box

- **Mega-menu navigation** matching the reference site's structure (Startup, Registrations,
  Trademark, GST, Income Tax, MCA, Compliance, Global), pulled live from MongoDB
- **Login / Signup** in the top-right corner, backed by JWT auth
- **Lead capture**: clicking "Get Started" or any service in the mega-menu opens a form; submissions
  are saved to MongoDB and visible in the logged-in user's Dashboard
- **Dashboard**: shows the logged-in user's profile and their submitted service enquiries
- Brand identity: deep navy (#0A1A3C) + gold/amber (#C9974A), Source Serif 4 + Inter typography,
  and a recurring "linked node" motif in the logo and hero graphics (nods to "Linkers")

## Where to go next

- **Connect a payment gateway** if you want to charge for filings (Razorpay/Stripe are common choices for India-facing products)
- **Add an admin panel** — the backend already supports an `admin` role and a `GET /api/leads`
  endpoint that returns all enquiries; you'd build a simple table UI for it
- **Service detail content** — `ServiceDetail.jsx` currently shows a generic template for every
  service; you can give individual services their own page content as the business grows
- **Email notifications** — wire up something like Nodemailer or an email API so both the customer
  and your team get notified when a lead is submitted

## Project structure

```
aurbit-linkers/
  backend/    — Express API + MongoDB models (see backend/README.md)
  frontend/   — React + Vite + Tailwind site (see frontend/README.md)
```

Each folder has its own README with full setup details.
