// api/submit.js
// Vercel serverless function — receives form POST, writes one row to Airtable
// Per LL-P04: no internal Vercel function-to-function fetches. This is the only API route.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    name,
    email,
    phone,
    experience,
    domains,
    useCases,
    notes,
  } = req.body

  // Basic server-side validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const token  = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID
  const table  = process.env.AIRTABLE_TABLE_NAME || 'Submissions'

  if (!token || !baseId) {
    console.error('Missing Airtable env vars')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const record = {
    fields: {
      'Name':             name,
      'Email':            email,
      'Phone':            phone || '',
      'Experience Level': experience || '',
      'Work Domains':     domains || '',
      'Use Cases':        useCases || '',
      'Notes':            notes || '',
      'Submitted At':     new Date().toISOString(),
    }
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({ records: [record] }),
      }
    )

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error('Airtable error:', data)
      return res.status(500).json({ error: 'Failed to save submission' })
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('Submission error:', err)
    return res.status(500).json({ error: 'Unexpected error' })
  }
}
