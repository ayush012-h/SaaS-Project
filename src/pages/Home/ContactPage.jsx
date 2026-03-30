import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { LandingNav, LandingFooter } from '../../components/Layout/LandingNavFooter';

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'Contact — SubTrackr'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#E8E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Background glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(62,207,207,0.06) 0%, transparent 70%)' }} />
      </div>

      <LandingNav activePath="/contact" />

      <div style={{ position: 'relative', zIndex: 5, paddingTop: 120 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '3rem 5vw 4rem' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 24px', borderRadius: 18, background: 'rgba(62,207,207,0.12)', border: '1px solid rgba(62,207,207,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={30} color="#3ECFCF" />
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1rem', color: '#E8E8F0' }}>Contact Us</h1>
          <p style={{ color: '#9999BB', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.75 }}>
            Have questions, feedback, or need help? We're always here — and we respond fast.
          </p>
        </div>

        {/* Contact Cards */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {[
              {
                icon: Send, color: '#6C63FF', title: 'Feedback & Support',
                desc: 'For technical issues, billing questions, feature requests, or general feedback about SubTrackr.',
                cta: 'support@subtrackr.me', href: 'mailto:support@subtrackr.me',
              },
              {
                icon: MessageSquare, color: '#3ECFCF', title: 'Partnerships & Press',
                desc: "Interested in writing about SubTrackr or exploring a partnership? We'd love to chat with you.",
                cta: 'hello@subtrackr.me', href: 'mailto:hello@subtrackr.me',
              },
              {
                icon: Mail, color: '#FFBD2E', title: 'Community & Careers',
                desc: "Join our Discord community for product discussions, tips, and to stay up to date on what's being built.",
                cta: 'Join Discord →', href: '#',
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

          {/* Current user card */}
          <div style={{ marginTop: 24, padding: '36px 40px', background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#E8E8F0', marginBottom: 12 }}>Are you a current user?</h3>
            <p style={{ color: '#9999BB', fontSize: 14, maxWidth: 450, margin: '0 auto 24px', lineHeight: 1.7 }}>
              You can also use the feedback widget directly inside the app for faster context-aware support from our team.
            </p>
            <Link to="/dashboard" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8E8F0', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Go to Dashboard →
            </Link>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
