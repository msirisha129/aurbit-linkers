# Aurbit Linkers — Frontend

React + Vite + Tailwind CSS frontend for the Aurbit Linkers platform.

## What's included

- Full mega-menu navigation (Startup, Registrations, Trademark, GST, Income Tax, MCA, Compliance, Global) — fetched live from the backend, with local fallback data so the site still looks complete if the API isn't running
- Home page: hero, service cards, AI compliance feature panel, FAQ accordion, closing CTA
- Login / Signup pages wired to the backend's JWT auth
- Protected Dashboard showing the logged-in user's submitted enquiries
- Lead capture modal — opens on "Get Started" or any mega-menu service click, posts to the backend

## 1. Install dependencies

```bash
cd frontend
npm install
```

## 2. Configure the API URL

```bash
cp .env.example .env
```

By default this points at `http://localhost:5000/api` (the backend running locally). Update
`VITE_API_BASE_URL` if your backend runs elsewhere.

## 3. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173`.

## 4. Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static host (Vercel, Netlify, nginx, or the `serve` package).

## Notes

- If the backend/MongoDB isn't running yet, the site still renders fully using fallback service
  data in `src/data/services.js` — but Login/Signup/Dashboard/lead submission require the backend.
- Brand colors and fonts live in `tailwind.config.js` (navy + gold palette, Source Serif 4 + Inter).
- The "Login" button in the top-right corner routes to `/login`; once authenticated, it switches to
  showing the user's name and links to `/dashboard`.

## Folder structure

```
frontend/
  src/
    components/     # Navbar, Footer, Hero, ServiceCards, LeadModal, etc.
    context/        # AuthContext, ServicesContext
    data/            # Fallback service catalog + FAQ content
    lib/             # API client, icon mapping
    pages/           # Home, Login, Signup, Dashboard, ServiceDetail, StaticPage
    App.jsx
    main.jsx
  .env.example
  tailwind.config.js
```
