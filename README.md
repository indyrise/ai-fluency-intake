# ai-fluency-intake

Intake form for AI Fluency lesson signups. Collects learner background and 2–5 structured use cases. Stores submissions in Airtable.

**Live URL:** https://ai-fluency-intake.indyri.se  
**Stack:** React + Vite → Vercel (Hobby) → Airtable (Free)  
**ADR:** `00_docs/ADR-001-architecture.md`

---

## ⚠️ Critical: Never run `vercel env pull`

Running `npx vercel env pull .env.local` will overwrite all credentials with OIDC tokens.
Manage `.env.local` manually. See `00_docs/lessons-learned.md` LL-E01.

---

## Local Development

```bash
npm install
cp .env.example .env.local
# fill in .env.local with your Airtable credentials
npx vercel dev
```

Visit `http://localhost:3000`

---

## Airtable Setup

1. Create a free account at [airtable.com](https://airtable.com)
2. Create a base called **AI Fluency Intake**
3. Create a table called **Submissions** with these fields:

| Field Name | Type |
|---|---|
| Name | Single line text |
| Email | Email |
| Phone | Phone number |
| Experience Level | Single line text |
| Work Domains | Single line text |
| Use Cases | Long text |
| Notes | Long text |
| Submitted At | Single line text |

4. Generate a Personal Access Token at [airtable.com/create/tokens](https://airtable.com/create/tokens)
   - Scopes: `data.records:write`, `data.records:read`, `schema.bases:read`
   - Access: select the AI Fluency Intake base
   - **Save the token immediately — shown only once**
5. Copy your Base ID from the Airtable API docs (starts with `app`)

---

## Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/indyrise/ai-fluency-intake.git
git push -u origin main
```

1. Go to [vercel.com](https://vercel.com) → Import Project → select `indyrise/ai-fluency-intake`
2. Add environment variables in Vercel dashboard:
   - `AIRTABLE_TOKEN`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_TABLE_NAME` = `Submissions`
3. Deploy

---

## Custom Domain

In Vercel project settings → Domains → add `ai-fluency-intake.indyri.se`

In GoDaddy DNS:
- Type: CNAME
- Host: `ai-fluency-intake`
- Points to: `cname.vercel-dns.com`

---

## Airtable MCP (Claude access to submissions)

Connect at: `https://mcp.airtable.com/mcp` via OAuth in Claude settings.

Test query: *"Show me the latest submissions in my AI Fluency Intake base"*

Free tier: 1,000 API calls/month — MCP interactions count. Monitor if usage grows.
