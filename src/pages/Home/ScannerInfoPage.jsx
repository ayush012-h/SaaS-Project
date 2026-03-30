import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScanSearch, CheckCircle2, Zap, Shield, ArrowRight, FileText, Bot, Clock } from 'lucide-react';
import { LandingNav, LandingFooter } from '../../components/Layout/LandingNavFooter';

const STEPS = [
  { step: '01', title: 'Open your bank statement', desc: "Download any PDF/CSV statement or simply open your bank's SMS inbox or email history. No login to your bank required." },
  { step: '02', title: 'Copy & paste the text', desc: 'Select all the transaction text and paste it into SubTrackr\'s AI Scanner box. Works with any format — messy or clean.' },
  { step: '03', title: 'AI detects everything', desc: 'Our model identifies every subscription charge, extracts the name, amount, and billing frequency — in under 10 seconds.' },
  { step: '04', title: 'Add to tracker with one click', desc: 'Review and confirm the subscriptions found. They\'re pre-filled with all details — just click Add to start tracking.' },
];

const FACTS = [
  { icon: Bot, color: '#6C63FF', title: 'Trained on Indian Transactions', desc: 'Our model understands Indian bank statement formats from HDFC, ICICI, SBI, Axis, Kotak, Yes Bank, and more.' },
  { icon: Shield, color: '#4CFF8F', title: 'Privacy by Design', desc: 'Statement text is processed in-memory and never stored on our servers. Your financial data stays yours.' },
  { icon: Zap, color: '#3ECFCF', title: '99% Accuracy', desc: 'Recognizes over 5,000 global and local Indian subscription services from partially-obscured bank entries.' },
  { icon: Clock, color: '#FFD700', title: 'Under 10 Seconds', desc: 'Process 6 months worth of bank statements and get a full subscription breakdown faster than a cup of chai.' },
  { icon: FileText, color: '#FF63B3', title: 'Any Format', desc: 'Paste bank statement text, email receipt bodies, UPI history screenshots — the AI figures out the rest.' },
  { icon: CheckCircle2, color: '#6C63FF', title: 'One-Click Add', desc: 'All detected subscriptions are pre-filled with details. Confirm with a single click to start tracking.' },
];

export default function ScannerInfoPage() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'AI Scanner — SubTrackr'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#E8E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Background glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(62,207,207,0.07) 0%, transparent 70%)' }} />
      </div>

      <LandingNav activePath="/scanner-info" />

      <div style={{ position: 'relative', zIndex: 5, paddingTop: 120 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '3rem 5vw 5rem' }}>
          <div style={{ width: 80, height: 80, margin: '0 auto 28px', borderRadius: 24, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(108,99,255,0.4)' }}>
            <ScanSearch size={40} color="#fff" />
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1.25rem', lineHeight: 1.0, color: '#E8E8F0' }}>
            The AI Subscription Scanner
          </h1>
          <p style={{ color: '#9999BB', fontSize: '1.15rem', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            The most accurate AI subscription detector for Indian bank statements. Paste any transaction history — we'll find every recurring charge instantly.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 14, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(108,99,255,0.4)' }}>
              Try Scanner Free <ArrowRight size={16} />
            </Link>
            <Link to="/features" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8E8F0', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
              All Features
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 10 }}>How the Scanner Works</h2>
            <p style={{ color: '#9999BB', fontSize: '1rem' }}>Four steps. Under a minute. Zero technical knowledge needed.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px 20px' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#6C63FF', letterSpacing: '0.1em', marginBottom: 12 }}>{s.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#E8E8F0', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: '#9999BB', fontSize: 13, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 10 }}>Why Our Scanner is Different</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {FACTS.map((f, i) => (
              <div key={i} style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, display: 'flex', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}14`, border: `1px solid ${f.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#E8E8F0', marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ color: '#9999BB', fontSize: 13, lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal Mockup */}
        <div style={{ maxWidth: 760, margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ background: '#080810', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
              <span style={{ fontSize: 12, color: '#666680', marginLeft: 8, fontFamily: 'monospace' }}>AI Scanner — Processing HDFC_JAN_2026.txt</span>
            </div>
            <div style={{ padding: '24px 20px', fontFamily: 'monospace', fontSize: 13 }}>
              <div style={{ color: '#6C63FF', marginBottom: 12 }}>▶ Analyzing 3 months of transactions...</div>
              {[
                { name: 'Netflix India (Monthly)', amount: '₹649', color: '#4CFF8F' },
                { name: 'Spotify Premium Family', amount: '₹179', color: '#4CFF8F' },
                { name: 'Hotstar Premium Annual', amount: '₹499', color: '#4CFF8F' },
                { name: 'Adobe Creative Cloud', amount: '₹2,394', color: '#FFD700' },
                { name: 'OpenAI ChatGPT Plus', amount: '₹1,700', color: '#4CFF8F' },
                { name: 'Swiggy One (Unused)', amount: '₹349', color: '#FF6363' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', marginBottom: 6, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#9999BB' }}>✓ Found: <span style={{ color: '#E8E8F0' }}>{item.name}</span></span>
                  <span style={{ color: item.color, fontWeight: 700 }}>{item.amount}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 8, background: 'rgba(76,255,143,0.06)', border: '1px solid rgba(76,255,143,0.2)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4CFF8F', fontWeight: 700 }}>✓ Scan complete — 6 subscriptions found</span>
                <span style={{ color: '#666680' }}>9.2s</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 24px 120px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>Find your hidden subscriptions</h2>
          <p style={{ color: '#9999BB', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>The scanner is included free with Pro. Try SubTrackr free — no credit card needed.</p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 16, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', fontWeight: 800, fontSize: 17, textDecoration: 'none', boxShadow: '0 12px 48px rgba(108,99,255,0.4)' }}>
            Start Scanning for Free <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
