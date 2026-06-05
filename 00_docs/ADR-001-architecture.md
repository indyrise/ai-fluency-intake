# ADR-001: AI Fluency Intake Form — Architecture Decision Record

**Date:** 2026-06-05  
**Status:** Accepted  
**Closed:** 2026-06-05  
**Project:** ai-fluency-intake  

---

## Context

Need a branded intake form at `ai-fluency-intake.indyri.se` that collects prospective learner information and stores it for lesson planning, analysis, and writing. Must be deployable without ongoing cost, maintainable by one person, and accessible to Claude for analysis via MCP.

---

## Decision

React (Vite) SPA deployed on Vercel Hobby tier, with a Vercel serverless function (`/api/submit`) handling Airtable writes server-side. Airtable Free tier as the datastore.

---

## Rationale

- Vercel Hobby tier supports serverless functions and custom domains at no cost, within acceptable limits for intake volume
- Airtable Free tier supports up to 1,000 records/base — sufficient for this use case
- Airtable API access (via Personal Access Token) is available on all tiers including Free
- Airtable has an official MCP server (`https://mcp.airtable.com/mcp`) — enables Claude to read and analyze submissions directly without export/paste workflows
- Keeping the Airtable token in a Vercel environment variable (not in browser code) maintains API key security
- CNAME subdomain pattern (`ai-fluency-intake.indyri.se` → `cname.vercel-dns.com`) is established and working for this domain

---

## Stack

| Layer | Tool | Tier |
|---|---|---|
| Frontend | React + Vite | — |
| Hosting | Vercel | Hobby (free) |
| API | Vercel Serverless Function (`/api/submit`) | Hobby (free) |
| Datastore | Airtable | Free |
| MCP access | Airtable official MCP server | Free (OAuth) |
| Domain | GoDaddy CNAME → Vercel | Existing account |

---

## Consequences

- Airtable Free tier caps at **1,000 records/base** and **1,000 API calls/month** — acceptable for intake volumes; revisit if usage grows
- Vercel Hobby caps at **100K function invocations/month** — negligible for this use case
- Vercel Hobby is restricted to **personal, non-commercial use** — this is a personal/educational project; acceptable for now. If this becomes a paid service, upgrade to Pro ($20/month)
- Airtable official MCP server (launched Feb 2026) exposes search, create, update, delete, and comments — does NOT include a list/browse-all-records tool. "Show me all submissions" queries are not supported via MCP. Use Airtable directly for browsing, or build a /api/records endpoint if needed. See LL-I05.
- No spam protection on form — acceptable at current scale; add reCAPTCHA if abuse occurs
- Single dependency chain: GoDaddy → Vercel → Airtable. If any tier changes pricing, migration is required

---

## Alternatives Considered

| Option | Rejected Because |
|---|---|
| Google Forms | No branded subdomain, no MCP access, less control over UX |
| Google Sheets as datastore | Service account setup significantly more complex than Airtable PAT |
| Netlify instead of Vercel | Vercel already in use for other Indyri projects; consistency preferred |
| Supabase | Overkill for this volume; adds another service to manage |

---

## Open Questions at Decision Time

- MCP tool coverage was verified post-build. Airtable MCP does not expose list/browse-all-records. See lessons-learned.md #3 and #4.
