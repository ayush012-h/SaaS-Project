import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { LandingNav, LandingFooter } from '../../components/Layout/LandingNavFooter';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: [
      { heading: 'Account Information', body: 'When you register, we collect your email address and optional display name. We do not require your phone number, address, or any government-issued ID.' },
      { heading: 'Subscription Data', body: 'Information about subscriptions you manually enter, including service names, amounts, billing cycles, and renewal dates. This data is entirely under your control.' },
      { heading: 'Usage Analytics', body: 'Basic, anonymized analytics about how you interact with the app (e.g., pages visited, features clicked) to help us understand what to improve. This data is never sold.' },
      { heading: 'AI Scanner Input', body: 'When you use the AI Email/Statement Scanner, you paste text directly into our interface. This text is transmitted to OpenAI\'s API for processing. It is not stored on our servers or in your SubTrackr account — it is processed in-memory and immediately discarded.' },
    ]
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect strictly to:

• Provide, operate, and maintain the SubTrackr service and all its features
• Send renewal alert notifications you have configured (email and in-app)
• Analyze anonymized usage patterns to improve and prioritize our product roadmap
• Communicate service updates, security alerts, and customer support responses
• Process payments securely through Razorpay (we never store, see, or process card details directly)

We do not sell, rent, trade, or share your personal information with any third party for advertising or marketing purposes — ever.`,
  },
  {
    title: '3. Data Storage & Security',
    body: `Your data is stored using Supabase, a Postgres-based platform with built-in Row Level Security (RLS). This means your data is strictly isolated — database-level policies ensure only authenticated requests from your own account can ever read or write your subscription records.

Our security measures include:
• Encrypted data transmission via HTTPS/TLS on all connections
• Row-Level Security (RLS) policies enforced at the database layer on every table
• Secure, JWT-based authentication managed by Supabase Auth
• No plaintext storage of passwords — bcrypt hashing via Supabase's auth service
• No storage of payment card information (all payment processing is handled by Razorpay's PCI-DSS compliant infrastructure)`,
  },
  {
    title: '4. Third-Party Services',
    body: `SubTrackr integrates with the following third-party services. Each has its own privacy policy which we encourage you to review:

• Supabase — Database, authentication, and edge functions (supabase.com/privacy)
• Razorpay — Payment processing for Pro subscriptions (razorpay.com/privacy-policy)
• OpenAI API — Powers the AI Scanner and spending insights for Pro users. Text processed by OpenAI is governed by their API data usage policy (openai.com/policies/privacy-policy)
• Vercel — Hosting and global CDN for fast delivery (vercel.com/legal/privacy-policy)`,
  },
  {
    title: '5. Cookies & Local Storage',
    body: `SubTrackr uses minimal cookies and browser storage:

• Authentication Session Cookie: A secure, httpOnly cookie issued by Supabase Auth to maintain your login session. It expires with your session or when you sign out.
• Preference Data: Your theme choice (dark/light) and any dismissed notification states are stored in localStorage for convenience.

We do not use third-party advertising cookies, cross-site tracking, or fingerprinting technologies. We do not participate in ad networks.`,
  },
  {
    title: '6. Your Rights (GDPR & Indian IT Act)',
    body: `You have full rights over your personal data:

• Access: All your subscription data is always visible and accessible in the app
• Export: Go to Settings → Export to download your full data as CSV, or email us for a JSON dump
• Correction: Edit any subscription data directly in the app at any time
• Deletion: Use the "Delete Account" option in Settings → Account. All your data will be permanently and irrecoverably deleted within 30 days.
• Portability: Your data export includes all subscription records in machine-readable format

For any data rights requests, email: support@subtrackr.me`,
  },
  {
    title: '7. Data Retention',
    body: `We retain your account and subscription data for as long as your account remains active. When you delete your account, all associated personal data is permanently deleted within 30 days of your request.

Anonymized, aggregated analytics data (not linked to any individual user) may be retained indefinitely to inform product improvements and market research.`,
  },
  {
    title: '8. Children\'s Privacy',
    body: `SubTrackr is not intended for use by children under the age of 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us at support@subtrackr.me and we will promptly delete such data.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. When we do, we will:

• Update the "Last updated" date at the top of this page
• Send an email notification to all registered users for material changes
• Display an in-app notice for 14 days following significant policy changes

Continued use of SubTrackr after a policy update constitutes acceptance of the revised terms.`,
  },
  {
    title: '10. Contact Us',
    body: `If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach us at:

Email: support@subtrackr.me
Website: subtrackr.me

SubTrackr, India — We typically respond within 24 hours.`,
  },
];

export default function PrivacyPage() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'Privacy Policy — SubTrackr'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#E8E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)' }} />
      </div>

      <LandingNav activePath="/privacy" />

      <div style={{ position: 'relative', zIndex: 5, paddingTop: 120 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(62,207,207,0.05))', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px 40px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(62,207,207,0.15))', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={24} color="#6C63FF" />
              </div>
              <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, color: '#E8E8F0', letterSpacing: '-0.03em' }}>Privacy Policy</h1>
            </div>
            <p style={{ color: '#666680', fontSize: 14, margin: 0 }}>Last updated: March 17, 2026 · Effective immediately</p>
          </div>
        </div>

        {/* Intro Banner */}
        <div style={{ maxWidth: 760, margin: '40px auto 0', padding: '0 24px' }}>
          <div style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 14, padding: '18px 22px', marginBottom: 48 }}>
            <p style={{ margin: 0, color: '#A8A8C0', fontSize: 14, lineHeight: 1.75 }}>
              <strong style={{ color: '#E8E8F0' }}>The short version:</strong> SubTrackr only collects what's needed to operate the service. We never sell your data. Your subscription records are protected by database-level security. The AI Scanner never stores your bank statement text. We respect your right to access, export, and delete your data at any time.
            </p>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 44, paddingBottom: 80 }}>
            {SECTIONS.map((s, i) => (
              <div key={i}>
                <h2 style={{ color: '#E8E8F0', fontSize: 18, fontWeight: 800, margin: '0 0 16px', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{s.title}</h2>
                {s.content ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {s.content.map((c, j) => (
                      <div key={j}>
                        <div style={{ fontWeight: 700, color: '#C8C8E0', fontSize: 14, marginBottom: 6 }}>{c.heading}</div>
                        <p style={{ margin: 0, color: '#888898', fontSize: 14, lineHeight: 1.8 }}>{c.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#888898', fontSize: 14, lineHeight: 1.85, whiteSpace: 'pre-line' }}>{s.body}</div>
                )}
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div style={{ marginBottom: 80, padding: 24, borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: '#666680', fontSize: 13 }}>© 2026 SubTrackr. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link to="/terms" style={{ color: '#6C63FF', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>
              <Link to="/contact" style={{ color: '#6C63FF', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
