import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `We collect the following types of information:

**Account Information:** When you register, we collect your email address and optional display name.

**Subscription Data:** Information about subscriptions you manually enter, including service names, amounts, billing cycles, and renewal dates.

**Usage Data:** Basic analytics about how you use the app (page visits, feature usage) to improve our service.

**Email Scanner:** When you use the Email Scanner feature, you paste text manually into our app. This text is sent to OpenAI's API for processing and is not stored on our servers.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

- Provide, operate, and maintain the SubTrackr service
- Send renewal alert notifications you have configured
- Analyze usage patterns to improve our product
- Communicate with you about updates, security, and support
- Process payments through Razorpay (we never store card details)

We do **not** sell, rent, or share your personal information with third parties for their marketing purposes.`,
  },
  {
    title: '3. Data Storage & Security',
    content: `Your data is stored securely using Supabase, which uses PostgreSQL with Row Level Security (RLS). This means your data is strictly isolated — only you can access your subscription records.

We implement industry-standard security measures including:
- Encrypted data transmission (HTTPS/TLS)
- Row-level security policies on all database tables
- Secure authentication via Supabase Auth
- No storage of payment card information (handled by Razorpay)`,
  },
  {
    title: '4. Third-Party Services',
    content: `SubTrackr uses the following third-party services:

- **Supabase** — database and authentication (supabase.com/privacy)
- **Razorpay** — payment processing (razorpay.com/privacy)
- **OpenAI** — AI-powered Email Scanner and insights (openai.com/privacy) — only Pro users, text is not stored
- **Vercel / Hosting** — application hosting`,
  },
  {
    title: '5. Cookies',
    content: `SubTrackr uses minimal cookies and local storage:

- **Authentication session:** A secure cookie to keep you logged in
- **Preferences:** Theme (dark/light) and dismissed notification states stored in local storage

We do not use third-party tracking cookies or advertising cookies.`,
  },
  {
    title: '6. Your Rights',
    content: `You have the right to:

- **Access** your data — all your subscription data is visible in the app
- **Export** your data — contact us and we will provide a CSV export
- **Delete** your data — use the "Delete Account" option in Settings, or email us
- **Correct** your data — edit subscriptions directly in the app

For any data requests, contact: privacy@subtrackr.co`,
  },
  {
    title: '7. Data Retention',
    content: `We retain your account and subscription data for as long as your account is active. If you delete your account, all associated data is permanently deleted within 30 days.

Anonymized, aggregated analytics data (not linked to you) may be retained indefinitely to improve our service.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `SubTrackr is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification. Continued use of SubTrackr after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us:

**Email:** privacy@subtrackr.co
**Website:** subtrackr.co

SubTrackr, India`,
  },
]

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — SubTrackr'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      color: '#E8E8F0',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(62,207,207,0.06))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 0 40px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#666680', textDecoration: 'none', fontSize: 13, fontWeight: 600,
            marginBottom: 24,
          }}>
            <ArrowLeft size={14} /> Back to SubTrackr
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(62,207,207,0.15))',
              border: '1px solid rgba(108,99,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={20} style={{ color: '#6C63FF' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#E8E8F0' }}>
              Privacy Policy
            </h1>
          </div>
          <p style={{ color: '#666680', fontSize: 14, margin: 0 }}>
            Last updated: March 17, 2026 · Effective immediately
          </p>
        </div>
      </div>

      {/* Intro */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{
          background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 40,
        }}>
          <p style={{ margin: 0, color: '#A8A8C0', fontSize: 14, lineHeight: 1.7 }}>
            At SubTrackr, your privacy is our priority. This policy explains what data we collect, how we use it, and your rights. We believe in plain language — no legal jargon.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {SECTIONS.map((section, i) => (
            <div key={i}>
              <h2 style={{
                color: '#E8E8F0', fontSize: 17, fontWeight: 700,
                margin: '0 0 12px', paddingBottom: 10,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                {section.title}
              </h2>
              <div style={{ color: '#888898', fontSize: 14, lineHeight: 1.8 }}>
                {section.content.split('\n').map((line, j) => {
                  if (!line.trim()) return <br key={j} />
                  // Bold markdown **text**
                  const parts = line.split(/(\*\*.*?\*\*)/g)
                  return (
                    <p key={j} style={{ margin: '0 0 6px' }}>
                      {parts.map((part, k) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={k} style={{ color: '#C8C8E0' }}>{part.slice(2, -2)}</strong>
                          : part
                      )}
                    </p>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 60, marginBottom: 60,
          padding: '24px', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ color: '#666680', fontSize: 13 }}>© 2026 SubTrackr. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/terms" style={{ color: '#6C63FF', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>
            <Link to="/" style={{ color: '#666680', fontSize: 13, textDecoration: 'none' }}>Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
