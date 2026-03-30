import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { LandingNav, LandingFooter } from '../../components/Layout/LandingNavFooter';

const SECTIONS = [
  {
    title: '1. Agreement to Terms',
    body: `By accessing or using SubTrackr ("the Service," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.

These Terms apply to all visitors, users, and others who access or use the Service. Our Privacy Policy is incorporated by reference into these Terms.`,
  },
  {
    title: '2. Description of Service',
    body: `SubTrackr is an AI-powered subscription management platform that helps users track, manage, and optimize their recurring software and service subscriptions. The Service includes:

• A subscription tracking dashboard to monitor active, cancelled, and upcoming renewals
• Renewal alert notifications via email and in-app notifications
• An AI-powered scanner that analyzes pasted bank statement or email text to detect subscriptions
• A cancellation guide tool with step-by-step instructions for common services
• Analytics tools including spend trends, category breakdowns, and yearly reports
• A budget management tool to set and monitor spending caps (Pro feature)`,
  },
  {
    title: '3. User Accounts',
    body: `3.1 Registration: To access the Service, you must create an account using a valid email address or Google OAuth. You are responsible for maintaining the confidentiality of your account credentials.

3.2 Accuracy: You agree to provide accurate, current, and complete information during registration and to keep this information updated.

3.3 Account Security: You are responsible for all activities that occur under your account. You must immediately notify SubTrackr at support@subtrackr.me if you suspect any unauthorized use of your account.

3.4 Age Requirement: You must be at least 13 years old to use SubTrackr. By creating an account, you represent that you meet this age requirement.`,
  },
  {
    title: '4. Subscription Plans & Billing',
    body: `4.1 Free Plan: SubTrackr offers a free tier permitting up to 5 stored subscriptions with basic alert functionality.

4.2 Pro Plan: Advanced features including unlimited subscriptions, AI Scanner, cancellation guides, yearly reports, and budget tools are available under the Pro plan (₹49/month or equivalent annual rate).

4.3 Payment: Pro subscriptions are billed through Razorpay, a PCI-DSS compliant payment processor. By subscribing, you authorize recurring charges to your selected payment method.

4.4 Cancellation: You may cancel your Pro subscription at any time from Settings → Billing. Cancellation takes effect at the end of the current billing cycle. We do not offer prorated refunds for partial months.

4.5 Price Changes: SubTrackr reserves the right to modify subscription pricing with 30 days' advance notice via email.`,
  },
  {
    title: '5. Acceptable Use Policy',
    body: `You agree not to use SubTrackr to:

• Violate any applicable local, national, or international laws or regulations
• Transmit or upload malicious code, viruses, or any other software that may damage systems
• Attempt to gain unauthorized access to any part of the Service or its related systems
• Use automated bots, scrapers, or crawlers to access the Service without written permission
• Reverse-engineer, decompile, or disassemble any portion of the Service
• Submit inaccurate, misleading, or fraudulent financial information
• Impersonate any person or entity, or falsely state or misrepresent your affiliation

Violations may result in immediate suspension or permanent termination of your account.`,
  },
  {
    title: '6. Data & Privacy',
    body: `6.1 Financial Data: SubTrackr is a subscription tracker, not a bank. We do not connect to your bank accounts, request banking credentials, or have access to your actual financial accounts.

6.2 AI Scanner: The AI Scanner feature processes text you manually paste into the application. This text is sent to OpenAI's API for analysis and is not stored by SubTrackr. You are responsible for ensuring you have the right to share any text you submit.

6.3 Privacy Policy: Your use of SubTrackr is subject to our Privacy Policy, which explains in detail how we collect, use, store, and protect your personal data. Please review it at subtrackr.me/privacy.`,
  },
  {
    title: '7. Intellectual Property',
    body: `7.1 SubTrackr IP: The Service and all its original content, features, functionality, branding, and UI design are and will remain the exclusive property of SubTrackr and its licensors. Our trademarks, logos, and service marks may not be used in connection with any product or service without prior written consent.

7.2 Your Content: You retain full ownership of any subscription data, preferences, or other content you enter into SubTrackr. You grant SubTrackr a limited, non-exclusive license to process this data solely to provide you with the Service.`,
  },
  {
    title: '8. Disclaimer of Warranties',
    body: `SubTrackr is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.

We do not warrant that:
• The Service will always be available, uninterrupted, or error-free
• AI-generated insights, spending summaries, or detected subscriptions will always be 100% accurate
• Any errors or defects in the Service will be corrected on a specific timeline`,
  },
  {
    title: '9. Limitation of Liability',
    body: `To the maximum extent permitted by applicable law, SubTrackr and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from:

• Your use of or inability to use the Service
• Any unauthorized access to or alteration of your data
• Any inaccuracies in AI-generated subscription detection or spending insights
• Any third-party conduct or content on the Service

In no event shall our total liability to you exceed the amount you have paid SubTrackr in the 12 months prior to the claim.`,
  },
  {
    title: '10. Termination',
    body: `10.1 By You: You may delete your account at any time from Settings → Account → Delete Account.

10.2 By SubTrackr: We reserve the right to suspend or terminate your account immediately, without prior notice, if we determine you have violated these Terms or engaged in fraudulent, harmful, or illegal activity.

10.3 Effect: Upon termination, your right to access the Service ceases immediately. If you have an active Pro subscription at termination, you will not be refunded any prepaid subscription fees. Your data will be deleted in accordance with our Privacy Policy.`,
  },
  {
    title: '11. Governing Law',
    body: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law provisions. Any disputes arising from these Terms or your use of SubTrackr will be subject to the exclusive jurisdiction of the courts located in India.`,
  },
  {
    title: '12. Changes to Terms',
    body: `We reserve the right to modify these Terms at any time. When we do, we will update the "Last updated" date at the top of this page and notify registered users via email. Material changes will be communicated with at least 14 days' advance notice.

Your continued use of SubTrackr following notification of changes constitutes your acceptance of the updated Terms.`,
  },
  {
    title: '13. Contact Information',
    body: `If you have any questions about these Terms, please contact us:

Email: support@subtrackr.me
Website: subtrackr.me

SubTrackr, India — We typically respond within 24 business hours.`,
  },
];

export default function TermsPage() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'Terms of Service — SubTrackr'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#E8E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(62,207,207,0.05) 0%, transparent 70%)' }} />
      </div>

      <LandingNav activePath="/terms" />

      <div style={{ position: 'relative', zIndex: 5, paddingTop: 120 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(62,207,207,0.08), rgba(108,99,255,0.05))', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px 40px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(62,207,207,0.2), rgba(108,99,255,0.15))', border: '1px solid rgba(62,207,207,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} color="#3ECFCF" />
              </div>
              <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, color: '#E8E8F0', letterSpacing: '-0.03em' }}>Terms of Service</h1>
            </div>
            <p style={{ color: '#666680', fontSize: 14, margin: 0 }}>Last updated: March 17, 2026 · Effective immediately</p>
          </div>
        </div>

        {/* Intro Banner */}
        <div style={{ maxWidth: 760, margin: '40px auto 0', padding: '0 24px' }}>
          <div style={{ background: 'rgba(62,207,207,0.05)', border: '1px solid rgba(62,207,207,0.15)', borderRadius: 14, padding: '18px 22px', marginBottom: 48 }}>
            <p style={{ margin: 0, color: '#A8A8C0', fontSize: 14, lineHeight: 1.75 }}>
              <strong style={{ color: '#E8E8F0' }}>Plain-language summary:</strong> Use SubTrackr responsibly, don't misuse the platform, and we'll keep building great things for you. You own your data, we never sell it, and you can delete your account at any time.
            </p>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 44, paddingBottom: 80 }}>
            {SECTIONS.map((s, i) => (
              <div key={i}>
                <h2 style={{ color: '#E8E8F0', fontSize: 18, fontWeight: 800, margin: '0 0 16px', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{s.title}</h2>
                <div style={{ color: '#888898', fontSize: 14, lineHeight: 1.85, whiteSpace: 'pre-line' }}>{s.body}</div>
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div style={{ marginBottom: 80, padding: 24, borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: '#666680', fontSize: 13 }}>© 2026 SubTrackr. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link to="/privacy" style={{ color: '#3ECFCF', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
              <Link to="/contact" style={{ color: '#3ECFCF', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
