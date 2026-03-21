# GolfGives — Golf Charity Subscription Platform

A full-stack web application combining golf performance tracking, monthly prize draws, and charitable giving.

**Stack:** React + Vite + Tailwind (Frontend) · Node.js + Express (Backend) · Supabase (Database) · Stripe (Payments) · Vercel (Hosting)

---

##  DEPLOYMENT GUIDE (Step by Step)

### STEP 1 — Set up Supabase

1. Go to https://supabase.com → **New Project** (use a NEW project, not personal)
2. Give it a name, set a strong database password, choose a region
3. Wait for it to provision (~2 min)
4. Go to **SQL Editor** → paste the entire contents of `supabase-schema.sql` → click **Run**
5. Go to **Settings → API**:
   - Copy **Project URL** → this is `SUPABASE_URL`
   - Copy **service_role** key → this is `SUPABASE_SERVICE_ROLE_KEY`

---

### STEP 2 — Set up Stripe

1. Go to https://stripe.com → create/login to account
2. Stay in **Test Mode** (toggle top-left)
3. Go to **Developers → API Keys** → copy the **Secret key** (`sk_test_...`)
4. Create products:
   - **Dashboard → Products → Add Product**
   - Create "Monthly Plan" → £9.99/month → copy the **Price ID** (`price_...`)
   - Create "Yearly Plan" → £89.99/year → copy the **Price ID**
5. Set up Webhook (after deploying backend):
   - **Developers → Webhooks → Add endpoint**
   - URL: `https://YOUR_BACKEND_URL/api/webhooks/stripe`
   - Events to listen: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`
   - Copy the **Signing secret** (`whsec_...`)

---

### STEP 3 — Deploy Backend to Vercel

1. Push your code to a **new GitHub repository**
2. Go to https://vercel.com → **New Project** (use a NEW Vercel account)
3. Import the repo → set **Root Directory** to `server`
4. Add **Environment Variables**:

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
JWT_SECRET=your-random-secret-min-32-chars-long
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
CLIENT_URL=https://YOUR_FRONTEND_VERCEL_URL
PORT=5000
```

5. Deploy → copy the backend URL (e.g. `https://golfgives-api.vercel.app`)

---

### STEP 4 — Deploy Frontend to Vercel

1. In the same repo, go to Vercel → **New Project** again
2. Import the same repo → set **Root Directory** to `client`
3. Add **Environment Variable**:

```
VITE_API_URL=https://YOUR_BACKEND_URL/api
```

4. Edit `client/vercel.json` — replace `YOUR_BACKEND_URL` with your actual backend URL
5. Deploy → copy the frontend URL

---

### STEP 5 — Update CORS / CLIENT_URL

1. Go back to your **backend Vercel project → Settings → Environment Variables**
2. Update `CLIENT_URL` to your frontend Vercel URL
3. **Redeploy** the backend

---

### STEP 6 — Complete Stripe Webhook Setup

Now that backend is live, add the webhook URL in Stripe (see Step 2, point 5) using your deployed backend URL.

---

## Default Credentials

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@golfgives.com    | Admin123! |
| User  | user@golfgives.com     | User123!  |

> **Important:** Change these passwords after first login!

---

##  Form URLs to Fill In

| Field                  | Value                                          |
|------------------------|------------------------------------------------|
| Live Website URL       | `https://YOUR_FRONTEND.vercel.app`             |
| User Dashboard URL     | `https://YOUR_FRONTEND.vercel.app/dashboard`   |
| Admin Panel URL        | `https://YOUR_FRONTEND.vercel.app/admin`       |
| Admin Email            | `admin@golfgives.com`                          |
| Admin Password         | `Admin123!`                                    |
| GitHub Repo URL        | Your GitHub repository URL                     |

---

## Project Structure

```
golf-charity-platform/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SubscribePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CharitiesPage.jsx
│   │   │   ├── DrawsPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── components/layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── hooks/useAuth.jsx
│   │   └── lib/api.js
│   ├── vercel.json
│   └── vite.config.js
│
├── server/                    # Node.js backend
│   ├── routes/
│   │   ├── auth.js            # POST /login, /register, GET /me
│   │   ├── users.js           # GET/PUT /profile
│   │   ├── scores.js          # GET/POST/PUT/DELETE /scores
│   │   ├── subscriptions.js   # POST /checkout, /cancel, /portal
│   │   ├── draws.js           # Draw engine + results
│   │   ├── charities.js       # Charity CRUD
│   │   ├── admin.js           # Admin-only routes
│   │   └── webhooks.js        # Stripe webhook handler
│   ├── middleware/auth.js     # JWT + role middleware
│   ├── lib/supabase.js
│   ├── index.js               # Express app entry
│   └── vercel.json
│
└── supabase-schema.sql        # Full DB schema + seed data
```

---

## Feature Checklist

- [x] User signup & login (JWT auth)
- [x] Monthly & yearly subscription (Stripe Checkout)
- [x] Score entry — 5-score rolling logic (1–45 Stableford)
- [x] Draw system — random & algorithmic, simulation mode
- [x] Jackpot rollover logic
- [x] Prize pool split (40/35/25%)
- [x] Charity selection & contribution %
- [x] Winner verification flow & payout tracking
- [x] User Dashboard — all modules functional
- [x] Admin Panel — full control (users, draws, charities, winners)
- [x] Responsive design (mobile-first)
- [x] Error handling throughout
- [x] Stripe webhook handling
- [x] Supabase RLS-ready schema

---

##  Local Development

```bash
# Install all dependencies
npm run install:all

# Create server/.env from server/.env.example and fill in values
# Create client/.env.local: VITE_API_URL=http://localhost:5000/api

# Run both servers
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```
