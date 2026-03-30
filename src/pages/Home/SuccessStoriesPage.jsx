import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, TrendingDown, IndianRupee } from 'lucide-react';
import { LandingNav, LandingFooter } from '../../components/Layout/LandingNavFooter';

const STORIES = [
  {
    name: 'Priya Sharma', city: 'Mumbai', saved: '₹1,200', role: 'UX Designer',
    quote: "Found 3 subscriptions I completely forgot about. The AI scanner went through my HDFC statement in 10 seconds and pinpointed every recurring charge. Saved ₹1,200 in the very first week.",
    subs: ['Canceled Netflix Dual Screen', 'Canceled Adobe XD', 'Downgraded Spotify'],
    stars: 5,
    color: '#6C63FF',
  },
  {
    name: 'Rahul Mehra', city: 'Bangalore', saved: '₹3,400', role: 'Software Engineer',
    quote: "I'm a developer and I had like 18 SaaS tools running simultaneously. I thought I was tracking everything in a spreadsheet. Turns out I wasn't. SubTrackr found tools I literally forgot I signed up for.",
    subs: ['Canceled 3 duplicate CI/CD tools', 'Removed 2 unused design SaaS', 'Consolidated hosting plans'],
    stars: 5,
    color: '#3ECFCF',
  },
  {
    name: 'Arjun Kapoor', city: 'Delhi', saved: '₹4,500', role: 'Freelance Consultant',
    quote: "The cancellation guide is game-changing. I'd been trying to cancel my gym membership for 3 months. SubTrackr gave me a step-by-step guide and I was done in under 4 minutes. Absolute lifesaver.",
    subs: ['Canceled gym membership', 'Removed Coursera Plus', 'Downgraded Adobe CC'],
    stars: 5,
    color: '#FF63B3',
  },
  {
    name: 'Meera Nair', city: 'Hyderabad', saved: '₹2,800', role: 'Startup Founder',
    quote: "We were running a lean startup and couldn't figure out why our monthly burn was so high. SubTrackr identified 6 tools that 3 team members had separately purchased. One unified plan saved us ₹2,800/month.",
    subs: ['Consolidated Notion plans', 'Merged Figma seats', 'Dropped unused Slack upgrades'],
    stars: 5,
    color: '#FFD700',
  },
  {
    name: 'Vikram Singh', city: 'Pune', saved: '₹890', role: 'College Student',
    quote: "As a student, every rupee counts. I got an alert 7 days before my ₹890 Coursera charge and was able to cancel before losing the money. The app paid for itself before I even subscribed to Pro.",
    subs: ['Canceled Coursera Plus renewal', 'Switched to annual Spotify (saved 30%)', 'Found old Canva Pro trial'],
    stars: 5,
    color: '#4CFF8F',
  },
  {
    name: 'Ananya Iyer', city: 'Chennai', saved: '₹5,100', role: 'Finance Manager',
    quote: "The yearly report feature blew my mind. I could see exactly where ₹60,000 went last year. That visibility alone changed my entire approach to budgeting. I've now cut my subscription spend by 40%.",
    subs: ['Removed 8 overlapping streaming apps', 'Switched 4 services to annual billing', 'Canceled 2 abandoned SaaS trials'],
    stars: 5,
    color: '#6C63FF',
  },
];

const STATS = [
  { value: '₹3,900', label: 'Average monthly savings per Pro user' },
  { value: '50,000+', label: 'Active users tracking subscriptions' },
  { value: '₹16 Cr+', label: 'Total subscriptions tracked' },
  { value: '4.9 / 5', label: 'Average user rating' },
];

export default function SuccessStoriesPage() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'Success Stories — SubTrackr'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#E8E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Background glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(62,207,207,0.06) 0%, transparent 70%)' }} />
      </div>

      <LandingNav activePath="/success-stories" />

      <div style={{ position: 'relative', zIndex: 5, paddingTop: 120 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '3rem 5vw 4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(255,189,46,0.1)', border: '1px solid rgba(255,189,46,0.25)', marginBottom: 24 }}>
            <Star size={14} color="#FFBD2E" fill="#FFBD2E" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FFBD2E' }}>Real Results From Real Users</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1rem', lineHeight: 1.0, color: '#E8E8F0' }}>
            Wall of Love 🏆
          </h1>
          <p style={{ color: '#9999BB', fontSize: '1.15rem', maxWidth: 540, margin: '0 auto 3rem', lineHeight: 1.75 }}>
            Thousands of Indians have already stopped leaking money on forgotten subscriptions. Here are some of their stories.
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'rgba(255,255,255,0.04)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '28px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: 'rgba(15,15,26,0.6)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>{s.value}</div>
                <div style={{ color: '#666680', fontSize: 12, lineHeight: 1.4, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {STORIES.map((s, i) => (
              <div key={i} style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 28, padding: 32, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s' }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: s.stars }).map((_, j) => <Star key={j} size={14} color="#FFD700" fill="#FFD700" />)}
                </div>

                {/* Quote */}
                <p style={{ color: '#E8E8F0', fontSize: 15, lineHeight: 1.7, fontStyle: 'italic', flex: 1, marginBottom: 20 }}>"{s.quote}"</p>

                {/* What they canceled */}
                <div style={{ marginBottom: 20 }}>
                  {s.subs.map((sub, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <TrendingDown size={13} color={s.color} />
                      <span style={{ fontSize: 12, color: '#9999BB', fontWeight: 500 }}>{sub}</span>
                    </div>
                  ))}
                </div>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${s.color}, ${s.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>{s.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#E8E8F0', fontSize: 14 }}>{s.name}</div>
                      <div style={{ color: '#666680', fontSize: 12 }}>{s.role} · {s.city}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(76,255,143,0.08)', border: '1px solid rgba(76,255,143,0.2)', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#4CFF8F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Saved {s.saved}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '60px 24px 120px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>Your story starts today</h2>
          <p style={{ color: '#9999BB', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>Join 50,000+ Indians who took control of their subscriptions.</p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 16, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', fontWeight: 800, fontSize: 17, textDecoration: 'none', boxShadow: '0 12px 48px rgba(108,99,255,0.4)' }}>
            Start Saving for Free <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
