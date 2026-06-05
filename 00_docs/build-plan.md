# Build Plan: AI Fluency Intake Form

**Date:** 2026-06-05  
**Repo:** `indyrise/ai-fluency-intake` (to be created)  
**Live URL:** `https://ai-fluency-intake.indyri.se`  
**Datastore:** Airtable (Free tier)  
**ADR:** ADR-001  

---

## Assumptions — Verified Before Build

| # | Assumption | Status | Notes |
|---|---|---|---|
| 1 | Vercel Hobby includes serverless functions | ✅ Confirmed | 100K invocations/month |
| 2 | Custom domains work on Vercel Hobby | ✅ Confirmed | Including CNAME subdomains |
| 3 | `vercel dev` runs serverless functions locally | ✅ Confirmed | Standard behavior |
| 4 | Airtable API (PAT) available on Free tier | ✅ Confirmed | PAT replaced API keys Feb 2024 |
| 5 | Airtable Free tier record limit | ✅ Confirmed | 1,000 records/base, 1,000 API calls/month |
| 6 | Airtable MCP available on Free tier | ⚠️ Partial | Official server at `mcp.airtable.com/mcp`, launched Feb 2026. Tools available: search, create, update, delete, comments. No list/browse-all-records tool. "Show me latest submissions" workflow is NOT supported. Use Airtable directly for browsing. See LL-I05. |
| 7 | PAT scopes on Free tier | ✅ Confirmed | `data.records:write` (serverless fn) and `data.records:read` (MCP) both available on Free |
| 8 | GoDaddy CNAME → Vercel | ✅ Confirmed | Same pattern as existing Indyri subdomains |
| ⚠️ | Vercel Hobby = personal use only | **Flag** | If intake form becomes part of a paid service, upgrade to Pro ($20/month) |
| ⚠️ | Airtable MCP official vs community | **Note** | Official server (Feb 2026) covers read/create/update — sufficient for lesson planning. Community server available if delete/schema management needed later. |

---

## Airtable Schema

**Base name:** AI Fluency Intake  
**Table name:** Submissions  

| Field Name | Type | Required |
|---|---|---|
| Name | Single line text | Yes |
| Email | Email | Yes |
| Phone | Phone number | No |
| Experience Level | Single select | No |
| Work Domain(s) | Multiple select | No |
| Use Cases | Long text | No |
| What Didn't Work | Long text | No |
| Notes | Long text | No |
| Submitted At | Date (include time) | Auto |

**Use Cases field format (stored as structured text):**
```
Use Case 1
  Context: ...
  Goal: ...
  Success looks like: ...
  What didn't work: ...

Use Case 2
  ...
```

---

## Project Structure

```
/
├── 00_docs/
│   ├── ADR-001-architecture.md
│   └── build-plan.md          ← this file
├── src/
│   ├── App.jsx                ← main form component
│   ├── main.jsx               ← entry point
│   └── index.css              ← styles
├── api/
│   └── submit.js              ← Vercel serverless function → Airtable
├── public/
│   └── favicon.ico
├── index.html
├── vercel.json
├── package.json
├── .env.example
└── README.md
```

---

## Pre-Phase 1 — GitHub Hygiene

- [x] `.gitignore` created (node_modules, dist, .env*, .vercel, .DS_Store)
- [x] `README.md` created with purpose, stack, local dev steps, deploy steps, env vars list
- [x] `.env.example` created with all required keys, no real values
- [x] `.env.local` confirmed in `.gitignore` before first commit

---

## Phase 1 — Local Build ✅

- [ ] Scaffold project: `npm create vite@latest ai-fluency-intake -- --template react`
- [ ] Build form UI in `App.jsx`:
  - Name (required), Email (required), Phone (optional)
  - Experience level (single select pills)
  - Work domain(s) (multi-select pills)
  - 2–5 use cases, each with: Context / Goal / Success looks like / What didn't work
  - Notes (open text)
  - "I built this with AI" header section with Delegation pillar framing
- [ ] Build `/api/submit.js` serverless function:
  - Accepts POST with form data
  - Writes one row to Airtable via REST API
  - Returns `200` on success, `500` on error
- [ ] Add `.env.example`:
  ```
  AIRTABLE_TOKEN=your_pat_here
  AIRTABLE_BASE_ID=your_base_id_here
  AIRTABLE_TABLE_NAME=Submissions
  ```
- [ ] Test locally with `vercel dev`

---

## Phase 2 — Airtable Setup ✅

- [ ] Create free Airtable account (if needed) at airtable.com
- [ ] Create base: **AI Fluency Intake**
- [ ] Create table: **Submissions** with fields per schema above
- [ ] Generate Personal Access Token:
  - Go to: airtable.com/create/tokens
  - Scopes: `data.records:write`, `data.records:read`, `schema.bases:read`
  - Access: select the AI Fluency Intake base
  - **Save token immediately** — shown only once
- [ ] Copy Base ID from Airtable API docs (URL format: `app...`)
- [ ] Add both to `.env.local` for local testing

---

## Phase 3 — Deploy to Vercel ✅

- [ ] Create repo `indyrise/ai-fluency-intake` on GitHub
- [ ] Push local project to repo
- [ ] Connect repo to Vercel (Import Project)
- [ ] Add environment variables in Vercel dashboard:
  - `AIRTABLE_TOKEN`
  - `AIRTABLE_BASE_ID`
  - `AIRTABLE_TABLE_NAME`
- [ ] Add custom domain in Vercel project settings: `ai-fluency-intake.indyri.se`
- [ ] Add CNAME record in GoDaddy:
  - Host: `ai-fluency-intake`
  - Points to: `cname.vercel-dns.com`
- [ ] Verify domain is live and SSL is active

---

## Phase 4 — Airtable MCP Setup ✅ (partial)

- [ ] Connect Airtable MCP in Claude settings:
  - URL: `https://mcp.airtable.com/mcp`
  - Auth: OAuth (use your Airtable account)
- [ ] Test query: *"Find submissions mentioning [keyword]"* — search works, list-all does not. Browse all records in Airtable directly.
- [ ] Test write (optional): confirm MCP can create a record

---

## Division of Labor

| Task | Owner |
|---|---|
| Form UI, serverless function logic, schema design | Claude |
| Airtable account setup, PAT generation | Rucha |
| GitHub repo creation, Vercel connection, env vars | Rucha |
| GoDaddy CNAME record | Rucha |
| MCP connection in Claude settings | Rucha |
| GCP / infrastructure | N/A for this project |

---

## Success Criteria

- [ ] Form loads at `https://ai-fluency-intake.indyri.se`
- [ ] Submission creates a row in Airtable Submissions table
- [ ] Claude can query submissions via Airtable MCP
- [ ] No API keys exposed in browser/frontend code
