# Aurbit Linkers — Backend API

Node.js + Express + MongoDB (Mongoose) backend for the Aurbit Linkers platform.

## What's included

- **Auth**: signup, login, JWT-based sessions (`/api/auth`)
- **Leads**: captures every "Get Started" / mega-menu service click as a lead (`/api/leads`)
- **Services**: drives the mega-menu and homepage cards from the database (`/api/services`)

## 1. Install dependencies

```bash
cd backend
npm install
```

## 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aurbit_linkers
JWT_SECRET=replace_this_with_a_long_random_string
CLIENT_ORIGIN=http://localhost:5173
```

- For **local MongoDB**: install MongoDB Community Server, then `MONGO_URI=mongodb://127.0.0.1:27017/aurbit_linkers`.
- For **MongoDB Atlas** (cloud, free tier available): create a cluster at mongodb.com/atlas, get your connection string, and paste it as `MONGO_URI` — looks like `mongodb+srv://user:password@cluster.mongodb.net/aurbit_linkers`.

## 3. Seed the database

This populates the service categories (Startup, Registrations, Trademark, GST, Income Tax, MCA, Compliance, Global) that power the mega-menu:

```bash
npm run seed
```

You should see `Seeded 8 categories.` — re-run any time you want to reset the catalog back to defaults.

## 4. Run the server

```bash
npm run dev     # with auto-reload (nodemon)
# or
npm start       # plain node
```

The API will be live at `http://localhost:5000/api`. Check it's running:

```bash
curl http://localhost:5000/api/health
```

## API reference

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create account, returns JWT |
| POST | `/api/auth/login` | — | Log in, returns JWT |
| GET | `/api/auth/me` | Bearer token | Get current user |
| GET | `/api/services` | — | All mega-menu categories + items |
| GET | `/api/services/:key` | — | One category detail |
| POST | `/api/leads` | — (optional token) | Submit a service enquiry |
| GET | `/api/leads/mine` | Bearer token | Logged-in user's own enquiries |
| GET | `/api/leads` | Bearer token (admin) | All enquiries (admin only) |

## Making a user an admin

By default every signup is role `user`. To view all leads via `/api/leads`, promote a user manually in MongoDB:

```js
// in mongosh, connected to your database
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## Folder structure

```
backend/
  config/
    db.js        # Mongoose connection
    seed.js       # Populates ServiceCategory collection
  middleware/
    auth.js       # JWT verification, admin gate
  models/
    User.js
    Lead.js
    ServiceCategory.js
  routes/
    auth.js
    leads.js
    services.js
  server.js        # App entry point
  .env.example
```
