
# Abrid — Contractor App (Monorepo)

**Owner:** Amazigh Construction LLC (Freestone Builders)  
**Purpose:** Admin-controlled purchases, project & labor tracking, subcontractor expenses, and approvals.

This monorepo contains:
- **apps/web** – Next.js admin dashboard (Vercel-ready) with API route `pages/api/evaluate.ts` that uses the spend rules engine.
- **apps/mobile** – Expo React Native app for field teams to submit purchase requests and log labor.
- **packages/types** – Shared TypeScript types.
- **packages/rules-engine** – Spend rules engine (TypeScript) with unit tests.

> 🔒 *Controlled Payments*: Vendor/time/project controls, per-purchase & per-period limits, MCC allowlist, and admin pre-authorization flow.  
> ⚙️ *This is an MVP scaffold:* pieces are wired enough to run locally, breathe, and iterate.

## Quick Start

### 1) Install Node + npm
- Node 18+ recommended (`node -v`)

### 2) Install deps
```bash
npm install
```

### 3) Run the web admin (Next.js)
```bash
npm run dev:web
```
Open http://localhost:3000

### 4) Run the mobile app (Expo)
```bash
npm run dev:mobile
```
Follow the Expo CLI instructions.

### 5) Run tests (rules engine)
```bash
npm test
```

## Monorepo layout

```
apps/
  web/         # Next.js admin dashboard (includes API route /api/evaluate)
  mobile/      # Expo mobile client for purchase requests
packages/
  types/       # Shared types
  rules-engine # Spend rules engine + tests
```

## Env Vars

Copy `.env.example` → `.env.local` for the web app if needed. The current MVP uses local evaluation only.

## Deploy

- **Web**: Vercel → select root, set framework to Next.js.
- **Mobile**: Expo → EAS build (later).
- **CI**: GitHub Actions runs `npm ci` and tests on each push.

## License
MIT © 2025 Amazigh Construction LLC
