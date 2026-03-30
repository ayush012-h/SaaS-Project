import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, Mail, MessageSquare, ChevronDown, Book, Zap, ArrowRight, Clock, Shield } from 'lucide-react';
import { LandingNav, LandingFooter } from '../../components/Layout/LandingNavFooter';

const FAQS = [
  { q: 'How do I add a subscription?', a: 'Go to the Subscriptions tab and click "Add New". Enter the service name, amount, billing cycle, and renewal date. SubTrackr will automatically track it and alert you before it renews.' },
  { q: 'How does the AI scanner work?', a: 'Copy the text from your bank statement or email receipt, paste it into the AI Scanner box, and our AI extracts every recurring subscription charge automatically — including the name, amount, and billing cycle.' },
  { q: 'Is my data safe?', a: 'Absolutely. We use Supabase with Row-Level Security meaning your data is strictly isolated — only you can access it. We use AES-256 encryption at rest and SSL/TLS in transit. We never store payment credentials.' },
  { q: 'How do I cancel my SubTrackr Pro subscription?', a: 'Go to Settings → Billing → Cancel Plan. Your Pro access continues until the end of your current billing period. You can also email us and we\'ll handle it immediately.' },
  { q: 'What banks does the scanner support?', a: 'The scanner is format-agnostic — it reads plain text. It works with statements from HDFC, ICICI, SBI, Axis, Kotak, Yes Bank, and any other bank. Just copy-paste the transaction history text.' },
  { q: 'Can I use SubTrackr for free?', a: 'Yes! The Free plan lets you track up to 5 subscriptions with basic alerts and manual entry. Upgrade to Pro (₹49/month) for unlimited subscriptions, AI scanner, cancellation guides, and more.' },
  { q: 'Does SubTrackr work on mobile?', a: 'Yes, SubTrackr is fully responsive and works on all modern mobile browsers. A dedicated mobile app is on our roadmap for Q2 2026.' },
  { q: 'How do I export my data?', a: 'Go to Settings → Export and download your full subscription history as a CSV file. You can also email support@subtrackr.me to request a full data export.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}
      >
        <span style={{ color: '#E8E8F0', fontWeight: 600, fontSize: 15 }}>{q}</span>
        <ChevronDown size={18} color="#666680" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px', color: '#9999BB', fontSize: 14, lineHeight: 1.75 }}>{a}</div>
      )}
    </div>
  );
}

export default function SupportPage() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'Support — SubTrackr'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#E8E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(62,207,207,0.06) 0%, transparent 70%)' }} />
      </div>

      <LandingNav activePath="/support" />

      <div style={{ position: 'relative', zIndex: 5, paddingTop: 120 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '3rem 5vw 4rem' }}>
          <div style={{ width: 72, height: 72, margin: '0 auto 24px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.1))', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LifeBuoy size={34} color="#6C63FF" />
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1rem', color: '#E8E8F0' }}>How can we help?</h1>
          <p style={{ color: '#9999BB', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.75 }}>
            Our team is here for you. Most issues are resolved within a few hours.
          </p>
        </div>

        {/* Response time badge */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '0 24px 60px', flexWrap: 'wrap' }}>
          {[
            { icon: Clock, text: 'Avg. response in 3 hours', color: '#4CFF8F' },
            { icon: Shield, text: 'Your data stays private', color: '#3ECFCF' },
            { icon: Zap, text: 'Available 7 days a week', color: '#6C63FF' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 100, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <b.icon size={14} color={b.color} />
              <span style={{ fontSize: 13, color: '#9999BB', fontWeight: 600 }}>{b.text}</span>
            </div>
          ))}
        </div>

        {/* Contact Cards */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {[
              {
                icon: Mail, color: '#3ECFCF', title: 'Email Support',
                desc: 'Drop us an email for technical help, billing, or feature requests. Fast, personal responses.',
                cta: 'support@subtrackr.me', href: 'mailto:support@subtrackr.me', isEmail: true,
              },
              {
                icon: MessageSquare, color: '#FFBD2E', title: 'Community Discord',
                desc: 'Join our active community, get real-time answers, share savings tips, and vote on new features.',
                cta: 'Join Discord Server', href: '#', isEmail: false,
              },
              {
                icon: Book, color: '#6C63FF', title: 'Browse FAQ',
                desc: 'Find quick answers to the most common questions — from scanner setup to billing and privacy.',
                cta: 'Read FAQ Below', href: '#faq', isEmail: false,
              },
            ].map((c, i) => (
              <div key={i} style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${c.color}14`, border: `1px solid ${c.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <c.icon size={26} color={c.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E8E8F0', marginBottom: 10 }}>{c.title}</h3>
                <p style={{ color: '#9999BB', fontSize: 14, lineHeight: 1.7, flex: 1, marginBottom: 20 }}>{c.desc}</p>
                <a href={c.href} style={{ display: 'inline-block', padding: '10px 20px', borderRadius: 12, background: `${c.color}14`, border: `1px solid ${c.color}28`, color: c.color, fontWeight: 700, fontSize: 13, textDecoration: 'none', textAlign: 'center' }}>{c.cta}</a>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 120px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 12 }}>Frequently Asked Questions</h2>
            <p style={{ color: '#9999BB', fontSize: '1rem', lineHeight: 1.7 }}>Can't find what you need? Email us at <a href="mailto:support@subtrackr.me" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: 600 }}>support@subtrackr.me</a></p>
          </div>
          {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
