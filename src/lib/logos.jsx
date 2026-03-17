import React, { useState } from 'react';

const domainMap = {
  'netflix': 'netflix.com',
  'spotify': 'spotify.com',
  'adobe': 'adobe.com',
  'notion': 'notion.so',
  'github': 'github.com',
  'aws': 'aws.amazon.com',
  'youtube': 'youtube.com',
  'google': 'google.com',
  'microsoft': 'microsoft.com',
  'slack': 'slack.com',
  'figma': 'figma.com',
  'dropbox': 'dropbox.com',
  'zoom': 'zoom.us',
  'canva': 'canva.com',
  'grammarly': 'grammarly.com',
  'discord': 'discord.com',
  'twitter': 'twitter.com',
  'x': 'twitter.com',
  'linkedin': 'linkedin.com',
  'hotstar': 'hotstar.com',
  'amazon prime': 'primevideo.com',
  'prime': 'primevideo.com',
  'apple': 'apple.com',
  'disney+': 'disneyplus.com',
  'disney': 'disneyplus.com',
  'twitch': 'twitch.tv',
  'reddit': 'reddit.com',
  'shopify': 'shopify.com',
  'webflow': 'webflow.com',
  'framer': 'framer.com',
  'linear': 'linear.app',
  'vercel': 'vercel.com',
  'supabase': 'supabase.com',
  'openai': 'openai.com',
  'chatgpt': 'openai.com',
  'midjourney': 'midjourney.com',
  'loom': 'loom.com',
  'calendly': 'calendly.com',
  'typeform': 'typeform.com',
  'mailchimp': 'mailchimp.com',
  'hubspot': 'hubspot.com',
  'intercom': 'intercom.com',
  'jira': 'atlassian.com',
  'trello': 'trello.com',
  'asana': 'asana.com',
  'monday': 'monday.com',
  'razorpay': 'razorpay.com',
  'stripe': 'stripe.com',
  'paypal': 'paypal.com',
  'revolut': 'revolut.com',
  'wise': 'wise.com',
};

export function getServiceLogo(name) {
  if (!name) return null;
  const lowerName = name.toLowerCase().trim();

  // Direct match
  if (domainMap[lowerName]) return `https://logo.clearbit.com/${domainMap[lowerName]}`;

  // Fuzzy match (starts with or includes)
  const match = Object.keys(domainMap).find(key =>
    lowerName.includes(key) || key.includes(lowerName)
  );

  if (match) return `https://logo.clearbit.com/${domainMap[match]}`;

  return null;
}

export function ServiceLogo({ name, size = 36, color = '#6C63FF' }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const logoUrl = getServiceLogo(name);

  const containerStyle = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: imgLoaded && !imgError ? 'transparent' : 'rgba(26, 26, 42, 0.5)',
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: imgLoaded ? 1 : 0,
    transition: 'opacity 300ms ease-in-out',
    position: 'relative',
    zIndex: 2,
  };

  const fallbackStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${color}26`, // 15% opacity
    color: color,
    fontSize: `${size * 0.45}px`,
    fontWeight: '800',
    borderRadius: '10px',
  };

  return (
    <div style={containerStyle}>
      {/* Shimmer overlay while loading — uses global CSS class, no inline <style> */}
      {!imgLoaded && !imgError && logoUrl && (
        <div
          className="skeleton-shimmer"
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        />
      )}

      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={name}
          style={imgStyle}
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgError(true);
            setImgLoaded(true);
          }}
        />
      ) : (
        <div style={fallbackStyle}>
          {name ? name[0].toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
}
