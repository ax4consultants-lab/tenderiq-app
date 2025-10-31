# TenderIQ — Automated Leads for SMEs

**Get only the tenders that matter to your business — straight to your inbox.**

TenderIQ is a lead automation SaaS for trades and compliance SMEs (asbestos, WHS, hazmat, demolition, environmental). It scores tenders based on your business rules, filters noise, and delivers high-quality leads via scheduled digests.

---

## What It Does

- **Lead Scoring**: Automatically scores tenders (0–100) based on your keywords, regions, and timing preferences
- **Daily Digests**: Scheduled delivery of qualified leads to your webhook endpoint
- **Smart Filtering**: Multi-faceted filters (source, region, status, close date, keywords)
- **CSV Export**: Download filtered leads with scores and matched keywords
- **Subscription Gating**: Stripe-powered lead delivery subscriptions (test mode included)

---

## Who It's For

Small-to-medium businesses in:
- Asbestos removal & clearance
- Work Health & Safety (WHS) consulting
- Hazmat remediation
- Demolition & environmental services

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, React Router
- **UI**: Tailwind CSS, shadcn/ui components
- **Data**: TanStack Query, Zod schemas
- **Adapters**: Mock (default) and REST
- **Payments**: Stripe (test mode)
- **Testing**: Vitest (unit), Playwright (E2E)

---

## Quick Start (Mock Mode)

```bash
# Install dependencies (pnpm, npm, or yarn)
pnpm install

# Start dev server
pnpm dev
```

**Login**: Use any email/password (stubbed authentication)

**Auth Bypass**: Enable in Settings → Auth Bypass (dev) to skip login entirely

**Default Mode**: Runs with mock data from `src/data/mock/tenders.json` (~50 sample tenders)

---

## Switch to REST Adapter

### Via Settings UI

1. Navigate to Settings → Lead Source Configuration
2. Toggle OFF "Use Mock Adapter"
3. Enter your API Base URL
4. Click "Test Connection" to verify `/stats/kpis` endpoint

### Via Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=https://your-api.example.com
VITE_USE_MOCK_ADAPTER=false
```

Restart the dev server.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | — | Base URL for REST adapter API |
| `VITE_USE_MOCK_ADAPTER` | `true` | Use mock data (disable for REST) |
| `VITE_AUTH_BYPASS` | `false` | Skip auth for dev/testing |
| `VITE_STRIPE_PK` | — | Stripe publishable key (test: `pk_test_...`) |
| `VITE_DIGEST_WEBHOOK_URL` | — | Webhook endpoint for digest delivery |

---

## Lead Rules & Scoring

### Rules Configuration

Navigate to **Alerts → Lead Rules & Digests** to configure:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `keywords` | `string[]` | `[]` | Include keywords (e.g., "asbestos", "WHS") |
| `exclude` | `string[]` | `[]` | Exclude keywords (e.g., "design", "architect") |
| `regions` | `string[]` | `[]` | Preferred regions (e.g., "SA", "NSW", "VIC") |
| `cadence` | `"daily"\|"weekly"` | `"daily"` | Digest frequency |
| `hour` | `string` | `"08"` | Delivery hour (24h format) |
| `minute` | `string` | `"30"` | Delivery minute |
| `tz` | `string` | `"Australia/Adelaide"` | Timezone for scheduling |
| `min_days_left` | `number` | `2` | Minimum days until close date |
| `min_score` | `number` | `50` | Minimum lead score threshold |

**Example**: See `docs/sample.rules.json`

### Scoring Algorithm

```typescript
let score = 0;

// Keyword matches (max 60 points)
if (matched_keywords.length > 0) score += Math.min(60, matched_keywords.length * 15);

// No excluded keywords (10 points)
if (!has_excluded_keywords) score += 10;

// Region match (15 points)
if (preferred_region_matched) score += 15;

// Close date in optimal window (15 points)
// Penalize if closing too soon (<2 days)
if (days_until_close >= min_days_left && days_until_close <= 14) score += 15;
if (days_until_close < min_days_left) score -= 25;

score = clamp(score, 0, 100);
```

### Score Bands

- **≥80**: High-priority lead (success badge)
- **60–79**: Medium-priority lead (warning badge)
- **<60**: Low-priority lead (default badge)

### Where Scores Appear

- **Dashboard ("Today's Leads")**: KPI cards, score filters, lead table
- **All Matches**: Score column, matched keywords
- **Tender Detail**: Score, matched keywords, rationale at top

---

## Digest Webhook

The **"Send Test Digest"** button (Alerts page) POSTs the following JSON payload to `VITE_DIGEST_WEBHOOK_URL`:

```json
{
  "generated_at": "2025-10-31T00:00:00.000Z",
  "rules": {
    "keywords": ["asbestos", "clearance"],
    "exclude": ["design"],
    "regions": ["SA", "NSW"],
    "cadence": "daily",
    "hour": "08",
    "minute": "30",
    "tz": "Australia/Adelaide",
    "min_days_left": 2,
    "min_score": 50
  },
  "leads": [
    {
      "id": "tender-123",
      "title": "Asbestos Clearance - Adelaide Hospital",
      "agency": "SA Health",
      "region": "SA",
      "close_date": "2025-11-07",
      "url": "https://example.com/tender-123",
      "score": 82,
      "matched_keywords": ["asbestos", "clearance"],
      "rationale": "Matched: asbestos, clearance • Region: SA • Closes: 7 Nov 2025"
    }
  ]
}
```

**If `VITE_DIGEST_WEBHOOK_URL` is not set**, the button shows an instructional toast explaining how to configure it.

**Email Template**: See `docs/digest-email.html` for a sample responsive email layout.

---

## Stripe (Test Mode)

### Setup

1. Get your Stripe **test** publishable key from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Add to `.env`:
   ```env
   VITE_STRIPE_PK=pk_test_51Xxxxx...
   ```
3. Restart dev server

### Subscription Flow (Demo)

1. Navigate to Landing → Pricing
2. Click "Subscribe" on any plan
3. Use Stripe test card: `4242 4242 4242 4242`, any future date, any CVC
4. On successful checkout, `activeSubscription` is set to `true` locally
5. Access is granted to `/app/*` routes

**Production Note**: Real webhook handling for `checkout.session.completed` and `customer.subscription.deleted` events will be wired in the backend worker (outside this repo).

---

## Build & Deploy

### Local Build

```bash
pnpm build
pnpm preview
```

### Deploy to Vercel

```bash
vercel --prod
```

Add environment variables in Vercel project settings.

### Deploy to Netlify

```bash
netlify deploy --prod
```

Add environment variables in Netlify site settings.

### Static Hosting

Build artifacts are in `dist/` — serve with any static host (AWS S3, Cloudflare Pages, GitHub Pages, etc.)

**Base Path**: If deploying to a subdirectory, update `base` in `vite.config.ts` and `basename` in router setup.

---

## Timezone & Date Formatting

- **Display**: Dates are formatted for `en-AU` locale (e.g., "7 Nov 2025")
- **Scheduling**: Digests are scheduled by the backend worker using the `tz` field from Lead Rules
- **Default Timezone**: `Australia/Adelaide` (ACST/ACDT)

---

## Testing

### Unit Tests

```bash
pnpm test
```

Runs Vitest on utility functions (scoring, date formatting, CSV export).

### End-to-End Tests

```bash
pnpm test:e2e
```

Playwright smoke test:
1. Load landing page
2. Navigate to login
3. Access dashboard (assert "Today's Leads")
4. Navigate to "All Matches" (assert Score column)
5. Open tender detail (assert Score, Matched Keywords, Rationale)

---

## REST API Endpoints (Adapter)

When `VITE_USE_MOCK_ADAPTER=false`, the app expects:

### `GET /tenders`

**Query Params**:
- `search` (string): Full-text search on title/description
- `source` (string): Filter by source (comma-separated for multi)
- `region` (string): Filter by region (comma-separated for multi)
- `status` (string): Filter by status
- `close_from` (ISO date): Close date range start
- `close_to` (ISO date): Close date range end
- `page` (number): Page number (1-indexed)
- `pageSize` (number): Results per page

**Response**:
```json
{
  "data": [{ ...Tender }],
  "total": 150,
  "page": 1,
  "pageSize": 20
}
```

### `GET /tenders/:id`

**Response**: Single `Tender` object

### `GET /stats/kpis`

**Response**:
```json
{
  "total_tenders": 150,
  "open_tenders": 85,
  "closing_soon": 12,
  "sources": {
    "TenderLink": 45,
    "AusTender": 30,
    "SA Tenders": 20
  }
}
```

---

## Project Structure

```
src/
├── components/       # UI components (shadcn + custom)
├── data/mock/        # Mock tender dataset
├── hooks/            # React hooks (auth, tenders, alerts, settings)
├── lib/
│   ├── adapters/     # Mock & REST data adapters
│   ├── billing.ts    # Subscription state (localStorage)
│   ├── constants.ts  # Timezone, locale defaults
│   ├── scoring.ts    # Lead scoring logic
│   └── utils.ts      # Date formatting, CSV export, similarity
├── pages/            # Route pages
├── types/            # TypeScript types & Zod schemas
└── main.tsx          # App entry point

docs/
├── sample.rules.json      # Example lead rules configuration
└── digest-email.html      # Sample digest email template
```

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Support

For issues or feature requests, open an issue on the repository.

For general questions about Lovable projects, visit [Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613).
