import { useState } from 'react'

const EXPERIENCE_OPTIONS = [
  { value: 'none',        label: 'Never used them' },
  { value: 'occasionally',label: 'Used a few times' },
  { value: 'regularly',   label: 'Use them regularly' },
  { value: 'daily',       label: 'Part of my daily work' },
]

const DOMAIN_OPTIONS = [
  { value: 'writing',    label: 'Writing & comms' },
  { value: 'analysis',   label: 'Research & analysis' },
  { value: 'operations', label: 'Operations & admin' },
  { value: 'creative',   label: 'Creative work' },
  { value: 'technical',  label: 'Technical / code' },
  { value: 'teaching',   label: 'Teaching / training' },
  { value: 'mixed',      label: 'A mix' },
]

const EMPTY_USE_CASE = () => ({ context: '', goal: '', success: '', didntWork: '' })

const styles = {
  page: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '32px 20px 64px',
  },
  // Header
  header: {
    borderBottom: '1px solid hsl(var(--border))',
    paddingBottom: 24,
    marginBottom: 32,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'hsl(var(--primary))',
    marginBottom: 8,
    fontFamily: "'JetBrains Mono', monospace",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'hsl(var(--foreground))',
    lineHeight: 1.2,
    marginBottom: 12,
  },
  headerBody: {
    fontSize: 13,
    color: 'hsl(var(--muted-foreground))',
    lineHeight: 1.6,
    maxWidth: 560,
  },
  delegationNote: {
    marginTop: 14,
    padding: '10px 14px',
    background: 'hsl(217 91% 60% / 0.06)',
    border: '1px solid hsl(217 91% 60% / 0.2)',
    borderRadius: 6,
    fontSize: 12,
    color: 'hsl(var(--muted-foreground))',
    lineHeight: 1.6,
  },
  delegationLabel: {
    color: 'hsl(var(--primary))',
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 4,
  },
  // Section
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'hsl(var(--muted-foreground))',
    paddingBottom: 6,
    borderBottom: '1px solid hsl(var(--border))',
    marginBottom: 14,
  },
  // Fields
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: 'hsl(var(--foreground))',
    marginBottom: 6,
  },
  labelHint: {
    fontWeight: 400,
    color: 'hsl(var(--muted-foreground))',
    marginLeft: 4,
  },
  input: {
    width: '100%',
    background: 'hsl(var(--secondary))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 6,
    padding: '8px 10px',
    fontSize: 13,
    color: 'hsl(var(--foreground))',
    fontFamily: "'Inter', system-ui, sans-serif",
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  inputFocus: {
    borderColor: 'hsl(var(--primary))',
  },
  // Pills
  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    background: 'hsl(var(--secondary))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 6,
    padding: '7px 13px',
    fontSize: 12,
    color: 'hsl(var(--muted-foreground))',
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    transition: 'all 0.12s',
  },
  pillActive: {
    background: 'hsl(217 91% 60% / 0.12)',
    border: '1px solid hsl(217 91% 60% / 0.5)',
    color: 'hsl(var(--primary))',
  },
  // Tip box
  tipBox: {
    padding: '10px 14px',
    background: 'hsl(38 92% 55% / 0.06)',
    border: '1px solid hsl(38 92% 55% / 0.2)',
    borderRadius: 6,
    fontSize: 12,
    color: 'hsl(var(--muted-foreground))',
    lineHeight: 1.65,
    marginBottom: 16,
  },
  tipLabel: {
    color: 'hsl(38 92% 55%)',
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 5,
  },
  // Use case card
  ucCard: {
    background: 'hsl(var(--secondary))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 8,
    padding: '14px 14px 10px',
    marginBottom: 10,
  },
  ucHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ucNumber: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'hsl(var(--muted-foreground))',
    fontFamily: "'JetBrains Mono', monospace",
  },
  ucRemove: {
    background: 'none',
    border: 'none',
    color: 'hsl(var(--muted-foreground))',
    cursor: 'pointer',
    fontSize: 14,
    padding: '2px 6px',
    borderRadius: 4,
    fontFamily: "'Inter', system-ui, sans-serif",
    lineHeight: 1,
  },
  ucFieldLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: 'hsl(var(--muted-foreground))',
    marginBottom: 4,
    display: 'flex',
    gap: 4,
    alignItems: 'baseline',
  },
  ucFieldHint: {
    fontSize: 10,
    fontWeight: 400,
    color: 'hsl(215 20% 40%)',
  },
  ucInput: {
    width: '100%',
    background: 'hsl(222 47% 10%)',
    border: '1px solid hsl(var(--border))',
    borderRadius: 5,
    padding: '7px 9px',
    fontSize: 12,
    color: 'hsl(var(--foreground))',
    fontFamily: "'Inter', system-ui, sans-serif",
    outline: 'none',
    marginBottom: 8,
    transition: 'border-color 0.15s',
  },
  addBtn: {
    width: '100%',
    background: 'none',
    border: '1px dashed hsl(var(--border))',
    borderRadius: 6,
    padding: '9px 0',
    fontSize: 12,
    color: 'hsl(var(--muted-foreground))',
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    transition: 'all 0.12s',
  },
  counter: {
    fontSize: 11,
    color: 'hsl(var(--muted-foreground))',
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: 'right',
    marginTop: 6,
  },
  // Submit row
  submitRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 32,
    paddingTop: 20,
    borderTop: '1px solid hsl(var(--border))',
  },
  btnSecondary: {
    background: 'none',
    border: '1px solid hsl(var(--border))',
    borderRadius: 6,
    padding: '9px 20px',
    fontSize: 13,
    color: 'hsl(var(--muted-foreground))',
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    transition: 'all 0.12s',
  },
  btnPrimary: {
    background: 'hsl(217 91% 60% / 0.15)',
    border: '1px solid hsl(217 91% 60% / 0.4)',
    borderRadius: 6,
    padding: '9px 24px',
    fontSize: 13,
    fontWeight: 500,
    color: 'hsl(var(--primary))',
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    transition: 'all 0.12s',
  },
  // States
  successBox: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  successIcon: {
    fontSize: 36,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: 'hsl(var(--foreground))',
    marginBottom: 8,
  },
  successBody: {
    fontSize: 13,
    color: 'hsl(var(--muted-foreground))',
    lineHeight: 1.6,
  },
  errorMsg: {
    fontSize: 12,
    color: 'hsl(var(--destructive))',
    marginTop: 12,
    textAlign: 'right',
  },
  required: {
    color: 'hsl(var(--destructive))',
    marginLeft: 2,
  },
  fieldError: {
    fontSize: 11,
    color: 'hsl(var(--destructive))',
    marginTop: 3,
  },
}

function UseCaseCard({ index, data, onChange, onRemove, canRemove }) {
  const field = (key, placeholder, hint) => (
    <div>
      <div style={styles.ucFieldLabel}>
        {key === 'context' ? 'Situation' :
         key === 'goal' ? 'What you want to accomplish' :
         key === 'success' ? 'What good looks like' :
         "What you've already tried"}
        <span style={styles.ucFieldHint}>— {hint}</span>
      </div>
      <input
        style={styles.ucInput}
        value={data[key]}
        onChange={e => onChange(index, key, e.target.value)}
        placeholder={placeholder}
        onFocus={e => e.target.style.borderColor = 'hsl(var(--primary))'}
        onBlur={e => e.target.style.borderColor = 'hsl(var(--border))'}
      />
    </div>
  )

  return (
    <div style={styles.ucCard}>
      <div style={styles.ucHeader}>
        <span style={styles.ucNumber}>Use case {index + 1}</span>
        {canRemove && (
          <button style={styles.ucRemove} onClick={() => onRemove(index)}>✕</button>
        )}
      </div>
      {field('context',    'e.g. I manage a small team and write a lot of status updates…',          'who are you, what context are you in?')}
      {field('goal',       'e.g. Draft a weekly summary faster without losing my voice…',             'what outcome do you want?')}
      {field('success',    'e.g. A 5-line draft I can send with one small edit…',                    'how would you know it worked?')}
      {field('didntWork',  "e.g. Tried ChatGPT but got generic output that didn't sound like me…",   "optional — what have you already attempted?")}
    </div>
  )
}

export default function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    domains: [],
    notes: '',
  })
  const [useCases, setUseCases] = useState([EMPTY_USE_CASE()])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const setField = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const toggleDomain = (val) => {
    setForm(f => ({
      ...f,
      domains: f.domains.includes(val)
        ? f.domains.filter(d => d !== val)
        : [...f.domains, val]
    }))
  }

  const addUseCase = () => {
    if (useCases.length < 5) setUseCases(u => [...u, EMPTY_USE_CASE()])
  }

  const removeUseCase = (i) => {
    setUseCases(u => u.filter((_, idx) => idx !== i))
  }

  const updateUseCase = (i, key, val) => {
    setUseCases(u => u.map((uc, idx) => idx === i ? { ...uc, [key]: val } : uc))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    return errs
  }

  const formatUseCases = () =>
    useCases
      .filter(uc => uc.context || uc.goal || uc.success || uc.didntWork)
      .map((uc, i) =>
        `Use Case ${i + 1}\n` +
        `  Situation: ${uc.context || '—'}\n` +
        `  Goal: ${uc.goal || '—'}\n` +
        `  Success looks like: ${uc.success || '—'}\n` +
        `  What didn't work: ${uc.didntWork || '—'}`
      )
      .join('\n\n')

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        form.name.trim(),
          email:       form.email.trim(),
          phone:       form.phone.trim(),
          experience:  form.experience,
          domains:     form.domains.join(', '),
          useCases:    formatUseCases(),
          notes:       form.notes.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Submission failed')
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({ name: '', email: '', phone: '', experience: '', domains: [], notes: '' })
    setUseCases([EMPTY_USE_CASE()])
    setErrors({})
    setSubmitError('')
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✦</div>
          <div style={styles.successTitle}>Got it — thank you.</div>
          <div style={styles.successBody}>
            I'll review your use cases before our first session<br />
            and come prepared to work on what actually matters to you.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerEyebrow}>AI Fluency · Intake</div>
        <div style={styles.headerTitle}>Before we begin</div>
        <div style={styles.headerBody}>
          Tell me a little about yourself and what you want to do with AI.
          This helps me tailor the sessions to work that actually matters to you.
        </div>
        <div style={styles.delegationNote}>
          <span style={styles.delegationLabel}>Built with AI · Delegation pillar</span>
          I could have used Google Forms for this. Instead I built it — a custom tool that
          fits this exact context, collects structured data I can actually use, and demonstrates
          one of the four pillars I'll teach you: knowing when to delegate a task to AI
          versus reaching for an off-the-shelf tool.
        </div>
      </div>

      {/* Contact */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>About you</div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Name <span style={styles.required}>*</span>
          </label>
          <input
            style={{ ...styles.input, ...(errors.name ? { borderColor: 'hsl(var(--destructive))' } : {}) }}
            value={form.name}
            onChange={e => setField('name', e.target.value)}
            placeholder="Your full name"
            onFocus={e => e.target.style.borderColor = 'hsl(var(--primary))'}
            onBlur={e => e.target.style.borderColor = errors.name ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}
          />
          {errors.name && <div style={styles.fieldError}>{errors.name}</div>}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Email <span style={styles.required}>*</span>
          </label>
          <input
            style={{ ...styles.input, ...(errors.email ? { borderColor: 'hsl(var(--destructive))' } : {}) }}
            type="email"
            value={form.email}
            onChange={e => setField('email', e.target.value)}
            placeholder="you@example.com"
            onFocus={e => e.target.style.borderColor = 'hsl(var(--primary))'}
            onBlur={e => e.target.style.borderColor = errors.email ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}
          />
          {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Phone <span style={styles.labelHint}>(optional)</span>
          </label>
          <input
            style={styles.input}
            type="tel"
            value={form.phone}
            onChange={e => setField('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            onFocus={e => e.target.style.borderColor = 'hsl(var(--primary))'}
            onBlur={e => e.target.style.borderColor = 'hsl(var(--border))'}
          />
        </div>
      </div>

      {/* Experience */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>Your experience with AI</div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>How would you describe your current experience with AI tools?</label>
          <div style={styles.pillGroup}>
            {EXPERIENCE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                style={{ ...styles.pill, ...(form.experience === opt.value ? styles.pillActive : {}) }}
                onClick={() => setField('experience', opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>What kind of work are most of your use cases from?</label>
          <div style={styles.pillGroup}>
            {DOMAIN_OPTIONS.map(opt => (
              <button
                key={opt.value}
                style={{ ...styles.pill, ...(form.domains.includes(opt.value) ? styles.pillActive : {}) }}
                onClick={() => toggleDomain(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>Your use cases</div>

        <div style={styles.tipBox}>
          <span style={styles.tipLabel}>A framing tip — this is your first freebie</span>
          The most useful way to think about a use case isn't "I want AI to help with emails."
          It's three things together: <strong style={{ color: 'hsl(var(--foreground))' }}>what situation you're in</strong>,{' '}
          <strong style={{ color: 'hsl(var(--foreground))' }}>what you're trying to accomplish</strong>, and{' '}
          <strong style={{ color: 'hsl(var(--foreground))' }}>what a good result looks like</strong>.
          The fields below are structured that way on purpose.
        </div>

        {useCases.map((uc, i) => (
          <UseCaseCard
            key={i}
            index={i}
            data={uc}
            onChange={updateUseCase}
            onRemove={removeUseCase}
            canRemove={useCases.length > 1}
          />
        ))}

        {useCases.length < 5 && (
          <button
            style={styles.addBtn}
            onClick={addUseCase}
            onMouseEnter={e => { e.target.style.borderColor = 'hsl(var(--muted-foreground))'; e.target.style.color = 'hsl(var(--foreground))' }}
            onMouseLeave={e => { e.target.style.borderColor = 'hsl(var(--border))'; e.target.style.color = 'hsl(var(--muted-foreground))' }}
          >
            + Add another use case
          </button>
        )}
        <div style={styles.counter}>{useCases.length} / 5</div>
      </div>

      {/* Notes */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>Anything else</div>
        <textarea
          style={{ ...styles.input, minHeight: 80, resize: 'vertical', fontFamily: "'Inter', system-ui, sans-serif" }}
          value={form.notes}
          onChange={e => setField('notes', e.target.value)}
          placeholder="Constraints, concerns, things you've tried that didn't work, goals beyond the sessions…"
          onFocus={e => e.target.style.borderColor = 'hsl(var(--primary))'}
          onBlur={e => e.target.style.borderColor = 'hsl(var(--border))'}
        />
      </div>

      {/* Submit */}
      <div style={styles.submitRow}>
        <button
          style={styles.btnSecondary}
          onClick={handleReset}
          onMouseEnter={e => e.target.style.color = 'hsl(var(--foreground))'}
          onMouseLeave={e => e.target.style.color = 'hsl(var(--muted-foreground))'}
        >
          Clear
        </button>
        <button
          style={{ ...styles.btnPrimary, opacity: submitting ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
      {submitError && <div style={styles.errorMsg}>{submitError}</div>}

    </div>
  )
}
