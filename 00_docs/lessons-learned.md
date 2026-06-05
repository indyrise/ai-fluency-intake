# Lessons Learned: ai-fluency-intake

**Date:** 2026-06-05  
**Project:** ai-fluency-intake  
**Context:** Building a branded intake form for AI Fluency lessons, deployed to Vercel Hobby with Airtable Free as datastore and Airtable MCP for Claude access.

---

## 1. Airtable Base ID must be the `app...` segment only

**What happened:** The Base ID was copied from the Airtable URL as `app8hPmz2YChqR1Kz/tblniW1NWKaF5pb5q` — including the table ID. Every API call returned 404 until the table ID segment was removed.

**Rule:** The Airtable URL format is `airtable.com/{baseId}/{tableId}/...`. Copy only the `app...` segment as `AIRTABLE_BASE_ID`. The table is addressed separately via `AIRTABLE_TABLE_NAME`.

---

## 2. Airtable field names and table names are case-sensitive

**What happened:** `AIRTABLE_TABLE_NAME` was initially set to `SUBMISSIONS` (all caps). Airtable returned 404 because the table is named `Submissions`. Fixed by correcting the env var.

**Rule:** Airtable field names and table names are case-sensitive in API calls. Match exactly — including capitalization and spacing.

---

## 3. Airtable MCP does not support listing all records

**What happened:** The build plan included "Test query: show me the latest submissions" as a Phase 4 verification step. After connecting MCP, the available tools were: search, create, update, delete, comments. No list/browse-all tool exists. Phase 4 was declared done before this was verified.

**Rule:** Verify MCP tool coverage against the specific workflows in the build plan before writing those workflows in. Connecting an MCP server ≠ confirming what it can do. For browsing all submissions, use Airtable directly or build a `/api/records` endpoint.

---

## 4. MCP capability verification must happen before the build plan is written

**What happened:** The build plan was written after the assumption verification pass. Airtable MCP availability was confirmed, but the specific tools it exposes were not checked. This is a sharper failure than verifying mid-build — the unverified capability was baked into the plan itself.

**Rule:** Assumption verification for integrations must include tool-level inspection, not just service availability. "The MCP server exists" is not sufficient — "the MCP server exposes the tools we need" is the required check.

---

## 5. `.gitignore` was not in the build plan

**What happened:** The project was built and pushed to GitHub without a `.gitignore`. It was caught before the repo was made public, but it should have been a pre-Phase 1 checklist item from the start.

**Rule:** Every project with a GitHub repo requires `.gitignore`, `README.md`, and `.env.example` as pre-Phase 1 deliverables, not afterthoughts.

---

## 6. Manual scaffolding substitution was not called out

**What happened:** The build plan included `npm create vite` as Phase 1 step 1. Files were scaffolded manually instead. This wasn't flagged at the time, so it appeared as a missing step when reviewing the repo structure.

**Rule:** When substituting a CLI scaffold step with manual file generation, say so explicitly at the time of substitution. The substitution is valid — the silence about it is not.

---

## 7. Airtable onboarding UI changed — "Create a base" is now "Build an app"

**What happened:** Airtable's onboarding now prompts users to create an app with Omni AI or build their own, rather than going directly to a blank base. This was not in the build plan.

**Rule:** Airtable's UI has been restructured around the "app" concept. To get a blank base: choose "Build my own." The underlying API, PAT, and schema behavior are unchanged.

---

## 8. Vercel env vars set to "sensitive" cannot be read back — only overwritten

**What happened:** After suspecting an incorrect Base ID in the env var, we couldn't verify the current value because it was marked sensitive. Had to delete and re-enter to confirm.

**Rule:** Sensitive env vars in Vercel cannot be read after saving. When debugging env var issues, delete and re-enter the value rather than trying to inspect it. Document expected values in `.env.example` for reference.
