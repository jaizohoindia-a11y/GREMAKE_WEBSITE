# Gremake Public Website

Official public website for **Gremake** — a construction ERP platform.

**Live URL:** [https://gremake.com](https://gremake.com)

---

## Architecture

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React + TypeScript + Vite         |
| Backend  | Express + TypeScript + Nodemailer |

### Frontend (`ERP/gramake-erp/`)

React/Vite single-page application with:

- Home page
- Pricing page with interactive calculator
  - User count selection
  - Automatic ERP tier selection
  - Basic ERP Features accordion
  - Additional Features checkboxes
  - Implementation options (radio buttons)
  - Live pricing calculation with GST
  - Annual Care fee
  - Custom Proposal for >100 users
  - Book Now modal + pricing booking API
- Contact page
- Request Demo page
- How It Works page
- Mobile Apps section
- SEO (sitemap, robots.txt)
- Custom animations, cursor, and grain overlay

### Backend (`backend/`)

Express + TypeScript API server with:

- Pricing booking endpoint (`/api/pricing-bookings`)
- Nodemailer email integration
- Input validation
- CORS configuration

---

## Local Development

### Prerequisites

- Node.js 18+
- npm

---

### Frontend

```bash
cd ERP/gramake-erp
npm install
cp .env.example .env
# Edit .env with your local values
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your email credentials
npm run dev
```

Backend API runs at: `http://localhost:4000`

---

## Environment Variables

### Frontend (`ERP/gramake-erp/.env.example`)

```env
VITE_API_URL=http://localhost:4000
```

> The frontend only uses `VITE_API_URL`. It does NOT contain any SMTP or server-side secrets.

---

### Backend (`backend/.env.example`)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=recipient@yourdomain.com

PORT=4000

ALLOWED_ORIGIN=https://gremake.com

NODE_ENV=production
```

> Never commit `.env`. Only `.env.example` is tracked in Git.

---

## Build (Production)

### Frontend

```bash
cd ERP/gramake-erp
npm install
npm run build
```

Output: `ERP/gramake-erp/dist/`

### Backend

```bash
cd backend
npm install
npm run build
```

---

## Deployment

| Service  | Provider | URL                        |
|----------|----------|----------------------------|
| Frontend | Render   | https://gremake.com        |
| Backend  | Render   | https://api.gremake.com    |

---

## Project Structure

```
GREMAKE_WEBSITE/
├── ERP/
│   └── gramake-erp/           # React/Vite frontend
│       ├── src/
│       │   ├── components/    # Shared UI components
│       │   ├── pages/         # Route-level pages
│       │   ├── sections/      # Page sections
│       │   ├── lib/           # Pricing engine & config
│       │   └── utils/         # API utilities
│       ├── public/            # Static assets
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
│
├── backend/                   # Express/Nodemailer API
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── routes/            # API route handlers
│   │   └── utils/             # Mailer & validation
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## License

Proprietary — Gremake / Jaizo India. All rights reserved.
