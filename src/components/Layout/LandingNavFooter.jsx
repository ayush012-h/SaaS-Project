import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_LINKS = [
  { label: 'Features', to: '/features' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const FOOTER_PRODUCT = [
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Scanner', to: '/scanner-info' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Changelog', to: '/changelog' },
];

const FOOTER_COMPANY = [
  { label: 'About Us', to: '/about' },
  { label: 'Success Stories', to: '/success-stories' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Support', to: '/support' },
];

const FOOTER_COMMUNITY = [
  { label: 'Twitter / X', to: '#' },
  { label: 'Discord', to: '#' },
  { label: 'Indian Indie Hub', to: '#' },
  { label: 'Product Hunt', to: '#' },
];

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>{title}</h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {links.map(l => (
          <li key={l.label}>
            <Link to={l.to} className="footer-link" style={{ color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <style>{`
        .footer-link:hover { color: var(--brand-purple) !important; }
      `}</style>
    </div>
  );
}

export function LandingNav({ activePath }) {
  const { session } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: 80, display: 'flex', alignItems: 'center',
      padding: '0 24px',
      background: scrolled ? 'var(--glass-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(108,99,255,0.3)' }}>
            <Zap size={20} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'var(--text-primary)' }}>SubTrackr</span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {NAV_LINKS.map(l => (
            <Link key={l.label} to={l.to} className="nav-link" style={{
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              color: activePath === l.to ? 'var(--text-primary)' : 'var(--text-muted)',
              position: 'relative', transition: 'color 0.2s',
            }}>
              {l.label}
              {activePath === l.to && (
                <span style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 1, background: 'var(--brand-gradient)', borderRadius: 2 }} />
              )}
            </Link>
          ))}
          <style>{`
            .nav-link:hover { color: var(--text-primary) !important; }
          `}</style>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {session ? (
            <Link to="/dashboard" style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 600, color: '#9999BB', textDecoration: 'none' }}>Sign in</Link>
              <Link to="/register" style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(108,99,255,0.35)' }}>Start Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function LandingFooter() {
  return (
    <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)', padding: '80px 24px 40px', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 60 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={16} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>SubTrackr</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>Stop losing money silently. AI-powered subscription tracking for the modern Indian saver.</p>
          </div>
          <FooterCol title="Product" links={FOOTER_PRODUCT} />
          <FooterCol title="Company" links={FOOTER_COMPANY} />
          <FooterCol title="Community" links={FOOTER_COMMUNITY} />
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>© 2026 SubTrackr INC. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            <span>Made with ❤️ in India</span>
            <span style={{ fontSize: 16 }}>🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
