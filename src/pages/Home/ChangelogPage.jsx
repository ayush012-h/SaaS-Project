import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Zap, Shield, Bell, ScanText, BarChart3, ArrowRight } from 'lucide-react';
import { LandingNav, LandingFooter } from '../../components/Layout/LandingNavFooter';

const LOGS = [
  {
    version: 'v1.3.0',
    date: 'March 28, 2026',
    tag: 'Major Release',
    tagColor: '#6C63FF',
    icon: Rocket,
    changes: [
      { type: 'new', text: 'Yearly Report — visualize your entire subscription spend across 12 months' },
      { type: 'new', text: 'Duplicate Detector — AI now flags identical or overlapping services automatically' },
      { type: 'new', text: 'Budget Manager — set monthly caps per category and get alerts when near limits' },
      { type: 'improved', text: 'Dashboard now loads 3x faster with smarter caching' },
      { type: 'fixed', text: 'Alert snooze button no longer causes duplicate reminders' },
    ]
  },
  {
    version: 'v1.2.0',
    date: 'March 20, 2026',
    tag: 'Feature Update',
    tagColor: '#3ECFCF',
    icon: ScanText,
    changes: [
      { type: 'new', text: 'AI Scanner support for HDFC, ICICI, and Axis Bank credit card statements' },
      { type: 'new', text: 'New visual trend charts with 6-month rolling window in analytics' },
      { type: 'new', text: 'Automated Cancellation Guide for 50+ new Indian services including Swiggy One, Ajio' },
      { type: 'improved', text: 'Email scanner accuracy improved from 89% to 97% on Indian transactions' },
      { type: 'fixed', text: 'Fixed layout issues on mobile Safari when adding subscriptions' },
    ]
  },
  {
    version: 'v1.1.5',
    date: 'March 15, 2026',
    tag: 'Performance',
    tagColor: '#4CFF8F',
    icon: Zap,
    changes: [
      { type: 'improved', text: 'Optimized database queries — dashboard initial load reduced by 60%' },
      { type: 'improved', text: 'Faster auth flow — login to dashboard in under 800ms' },
      { type: 'new', text: 'Added Discord community link in the app sidebar' },
      { type: 'fixed', text: 'Calendar view date alignment off by one day on certain timezones' },
      { type: 'fixed', text: 'Export CSV now correctly handles subscriptions with ₹ symbols in names' },
    ]
  },
  {
    version: 'v1.1.0',
    date: 'March 8, 2026',
    tag: 'Feature Update',
    tagColor: '#3ECFCF',
    icon: Bell,
    changes: [
      { type: 'new', text: 'Smart Alerts engine — renewal notifications 1 to 14 days in advance' },
      { type: 'new', text: 'Snooze alerts with one click — defer until next billing cycle' },
      { type: 'new', text: 'Email notification delivery for upcoming renewals' },
      { type: 'improved', text: 'Subscription card UI redesigned with clearer renewal countdown' },
    ]
  },
  {
    version: 'v1.0.0',
    date: 'March 1, 2026',
    tag: 'Launch 🚀',
    tagColor: '#FF63B3',
    icon: Rocket,
    changes: [
      { type: 'new', text: 'Public launch! AI-powered subscription tracking built for India' },
      { type: 'new', text: 'Manual subscription management with full CRUD support' },
      { type: 'new', text: 'AI Email & statement scanner using GPT-4o-mini' },
      { type: 'new', text: 'Analytics dashboard with spending trends and category breakdowns' },
      { type: 'new', text: 'Secure auth via Supabase with Google OAuth support' },
    ]
  },
];

const TYPE_STYLES = {
  new: { label: 'New', color: '#4CFF8F', bg: 'rgba(76,255,143,0.08)', border: 'rgba(76,255,143,0.2)' },
  improved: { label: 'Improved', color: '#3ECFCF', bg: 'rgba(62,207,207,0.08)', border: 'rgba(62,207,207,0.2)' },
  fixed: { label: 'Fixed', color: '#FFD700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.2)' },
};

export default function ChangelogPage() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'Changelog — SubTrackr'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#E8E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Background glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(62,207,207,0.06) 0%, transparent 70%)' }} />
      </div>

      <LandingNav activePath="/changelog" />

      <div style={{ position: 'relative', zIndex: 5, paddingTop: 120 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '3rem 5vw 4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', marginBottom: 24 }}>
            <Rocket size={14} color="#6C63FF" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#E8E8F0' }}>What's new in SubTrackr</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1rem', lineHeight: 1.05, color: '#E8E8F0' }}>
            Changelog
          </h1>
          <p style={{ color: '#9999BB', fontSize: '1.15rem', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            Every update that's shipped. We move fast and break nothing.
          </p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 14, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 32px rgba(108,99,255,0.35)' }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 120px', position: 'relative' }}>
          {/* Line */}
          <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #6C63FF, #3ECFCF, rgba(62,207,207,0))', borderRadius: 2, zIndex: 0 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48, paddingLeft: 60 }}>
            {LOGS.map((log, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -52, top: 8,
                  width: 20, height: 20, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${log.tagColor}, ${log.tagColor}88)`,
                  border: `2px solid ${log.tagColor}`,
                  boxShadow: `0 0 16px ${log.tagColor}66`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1,
                }} />

                {/* Card */}
                <div style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '28px 32px', backdropFilter: 'blur(20px)' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: log.tagColor, letterSpacing: '-0.03em' }}>{log.version}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 100, background: `${log.tagColor}14`, border: `1px solid ${log.tagColor}30`, color: log.tagColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{log.tag}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#666680', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{log.date}</span>
                  </div>

                  {/* Changes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {log.changes.map((c, j) => {
                      const ts = TYPE_STYLES[c.type];
                      return (
                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: ts.bg, border: `1px solid ${ts.border}`, color: ts.color, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0, marginTop: 2 }}>{ts.label}</span>
                          <span style={{ color: '#9999BB', fontSize: 14, lineHeight: 1.6 }}>{c.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
