import React, { useEffect, useState } from 'react';

const emptyStateContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  maxWidth: '380px',
  margin: '0 auto',
  padding: '40px 20px',
  transition: 'opacity 0.4s ease-out',
};

const iconBaseStyle = {
  fontSize: '48px',
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: 'var(--color-text-primary, #E8E8F0)',
  marginBottom: '12px',
};

const subtitleStyle = {
  fontSize: '14px',
  color: 'var(--color-text-muted, #A0A0B8)',
  lineHeight: '1.6',
  marginBottom: '24px',
};

const ctaButtonStyle = {
  padding: '12px 24px',
  borderRadius: '12px',
  border: 'none',
  background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 8px 16px rgba(108, 99, 255, 0.2)',
  transition: 'transform 0.2s ease',
};

// Animations are defined globally in index.css — no inline <style> needed.
// float, ring, pulse-glow keyframes are in index.css.

function FadeInContainer({ children }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ ...emptyStateContainerStyle, opacity }}>
      {children}
    </div>
  );
}

export function EmptySubscriptions({ onAddClick }) {
  return (
    <FadeInContainer>
      <div style={{ ...iconBaseStyle, animation: 'float 3s infinite ease-in-out' }}>💳</div>
      <h3 style={titleStyle}>No subscriptions yet</h3>
      <p style={subtitleStyle}>
        Add your first subscription to start tracking your spending and never miss a renewal again.
      </p>
      <button
        style={ctaButtonStyle}
        onClick={onAddClick}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        + Add Your First Subscription
      </button>
    </FadeInContainer>
  );
}

export function EmptyAlerts() {
  return (
    <FadeInContainer>
      <div style={{ ...iconBaseStyle, animation: 'ring 2.5s ease-in-out 3' }}>🔔</div>
      <h3 style={titleStyle}>No upcoming renewals</h3>
      <p style={subtitleStyle}>
        You have no subscriptions renewing in the next 30 days. Enjoy the peace of mind!
      </p>
    </FadeInContainer>
  );
}

export function EmptyInsights({ onGenerateClick }) {
  return (
    <FadeInContainer>
      <div style={{
        ...iconBaseStyle,
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        animation: 'pulse-glow 2s infinite ease-in-out',
      }}>💡</div>
      <h3 style={titleStyle}>No insights yet</h3>
      <p style={subtitleStyle}>
        Add at least 3 subscriptions and click 'Generate Insights' to get AI-powered savings tips.
      </p>
      <button
        style={ctaButtonStyle}
        onClick={onGenerateClick}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Generate Insights
      </button>
    </FadeInContainer>
  );
}

export function EmptySearch({ searchTerm, onClearSearch }) {
  return (
    <FadeInContainer>
      <div style={iconBaseStyle}>🔍</div>
      <h3 style={titleStyle}>No results found</h3>
      <p style={subtitleStyle}>
        No subscriptions match '{searchTerm}'. Try a different name or category.
      </p>
      <button
        style={{
          ...ctaButtonStyle,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-secondary)',
          boxShadow: 'none',
        }}
        onClick={onClearSearch}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Clear Search
      </button>
    </FadeInContainer>
  );
}
