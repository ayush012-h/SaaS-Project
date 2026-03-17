import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using SubTrackr ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.

These terms apply to all users of the service, including users on the free plan and Pro plan subscribers.`,
  },
  {
    title: '2. Description of Service',
    content: `SubTrackr is a subscription tracking and management tool that allows users to:

- Track personal and business subscriptions in one place
- Receive renewal alerts before subscriptions charge
- View spending analytics and trends
- Use AI-powered tools to detect subscriptions from email or bank statement text (Pro plan)

SubTrackr is provided "as is" and may be updated, modified, or discontinued at any time.`,
  },
  {
    title: '3. Eligibility',
    content: `You must be at least 13 years old to use SubTrackr. By using the service, you represent that:

- You are at least 13 years of age
- You have the legal capacity to enter into this agreement
- Your use of the service will comply with all applicable laws and regulations`,
  },
  {
    title: '4. Account Registration',
    content: `To use SubTrackr, you must create an account with a valid email address. You are responsible for:

- Maintaining the confidentiality of your account credentials
- All activity that occurs under your account
- Notifying us immediately of any unauthorized use of your account

We reserve the right to terminate accounts that violate these terms.`,
  },
  {
    title: '5. Free Plan & Pro Plan',
    content: `**Free Plan:** Allows tracking of up to 5 subscriptions with basic features including dashboard, charts, and renewal alerts. No credit card required.

**Pro Plan:** Paid subscription (₹499/month) providing unlimited subscriptions, AI spending insights, email scanner, and advanced analytics.

**Billing:** Pro plan billing is handled by Razorpay. By subscribing, you authorize us to charge your payment method on a recurring monthly basis.

**Cancellation:** You may cancel your Pro plan at any time via Settings. You will retain Pro access until the end of the current billing period. No refunds are issued for partial months.`,
  },
  {
    title: '6. Acceptable Use',
    content: `You agree not to use SubTrackr to:

- Violate any applicable laws or regulations
- Upload or transmit malicious code or content
- Attempt to gain unauthorized access to our systems
- Use the service to harass, harm, or defraud others
- Reverse engineer or attempt to extract our source code
- Resell or sublicense access to the service

We reserve the right to suspend or terminate your account for violations of these terms.`,
  },
  {
    title: '7. Intellectual Property',
    content: `The SubTrackr service, including its design, code, logos, and content, is owned by SubTrackr and protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the service for personal, non-commercial purposes.

You retain ownership of any data you input into the service (subscription records, etc.).`,
  },
  {
    title: '8. Data & Privacy',
    content: `Your use of SubTrackr is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the service, you consent to the collection and use of your data as described in our Privacy Policy.

We implement industry-standard security measures but cannot guarantee absolute security. You use the service at your own risk.`,
  },
  {
    title: '9. Disclaimer of Warranties',
    content: `SubTrackr is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that:

- The service will be uninterrupted or error-free
- Renewal alerts will be delivered without delay or failure
- The service will meet your specific requirements

Financial decisions made based on information in SubTrackr are your sole responsibility.`,
  },
  {
    title: '10. Limitation of Liability',
    content: `To the maximum extent permitted by law, SubTrackr shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including:

- Loss of data or profits
- Missed subscription renewals or unexpected charges
- Unauthorized access to your account

Our total liability to you for any claims arising from your use of the service shall not exceed the amount you paid us in the 3 months preceding the claim.`,
  },
  {
    title: '11. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will notify you of material changes via email or in-app notification at least 14 days before the changes take effect.

Your continued use of SubTrackr after the effective date of updated Terms constitutes your acceptance of those changes.`,
  },
  {
    title: '12. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in India.`,
  },
  {
    title: '13. Contact Us',
    content: `If you have questions about these Terms of Service, please contact us:

**Email:** legal@subtrackr.co
**Website:** subtrackr.co

SubTrackr, India`,
  },
]

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Terms of Service — SubTrackr'
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
        background: 'linear-gradient(135deg, rgba(62,207,207,0.08), rgba(108,99,255,0.06))',
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
              background: 'linear-gradient(135deg, rgba(62,207,207,0.2), rgba(108,99,255,0.1))',
              border: '1px solid rgba(62,207,207,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={20} style={{ color: '#3ECFCF' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#E8E8F0' }}>
              Terms of Service
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
          background: 'rgba(62,207,207,0.05)', border: '1px solid rgba(62,207,207,0.15)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 40,
        }}>
          <p style={{ margin: 0, color: '#A8A8C0', fontSize: 14, lineHeight: 1.7 }}>
            Please read these Terms of Service carefully before using SubTrackr. These terms govern your access to and use of our subscription tracking service. By using SubTrackr, you agree to these terms.
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
            <Link to="/privacy" style={{ color: '#3ECFCF', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
            <Link to="/" style={{ color: '#666680', fontSize: 13, textDecoration: 'none' }}>Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
