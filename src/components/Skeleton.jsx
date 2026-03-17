import React from 'react';

export function SkeletonBox({ width, height, borderRadius = 8, style = {} }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width: width || '100%',
        height: height || '100%',
        borderRadius: `${borderRadius}px`,
        ...style,
      }}
    />
  );
}

export function SkeletonSubscriptionRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1E1E2E' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SkeletonBox width="40px" height="40px" borderRadius={12} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <SkeletonBox width="120px" height="16px" />
          <SkeletonBox width="80px" height="12px" />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <SkeletonBox width="60px" height="16px" />
        <SkeletonBox width="70px" height="24px" borderRadius={20} />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div style={{ padding: '24px', backgroundColor: '#13131F', borderRadius: '16px', border: '1px solid #1E1E2E', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SkeletonBox width="36px" height="36px" borderRadius={10} />
        <SkeletonBox width="100px" height="14px" />
      </div>
      <SkeletonBox width="60%" height="28px" />
      <SkeletonBox width="40%" height="12px" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
      <div style={{ backgroundColor: '#13131F', borderRadius: '16px', border: '1px solid #1E1E2E', padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <SkeletonBox width="150px" height="20px" />
        </div>
        {[...Array(6)].map((_, i) => (
          <SkeletonSubscriptionRow key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonAnalytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ height: '300px', backgroundColor: '#13131F', borderRadius: '16px', border: '1px solid #1E1E2E', padding: '24px' }}>
           <SkeletonBox width="200px" height="20px" style={{ marginBottom: '24px' }} />
           <SkeletonBox width="100%" height="200px" />
        </div>
        <div style={{ height: '300px', backgroundColor: '#13131F', borderRadius: '16px', border: '1px solid #1E1E2E', padding: '24px' }}>
           <SkeletonBox width="150px" height="20px" style={{ marginBottom: '24px' }} />
           <SkeletonBox width="100%" height="200px" />
        </div>
      </div>
      <div style={{ backgroundColor: '#13131F', borderRadius: '16px', border: '1px solid #1E1E2E', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SkeletonBox width="150px" height="20px" style={{ marginBottom: '8px' }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#1A1A2A', borderRadius: '12px', border: '1px solid #2A2A3A' }}>
            <SkeletonBox width="48px" height="48px" borderRadius={12} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <SkeletonBox width="40%" height="16px" />
              <SkeletonBox width="70%" height="12px" />
            </div>
            <SkeletonBox width="80px" height="20px" />
          </div>
        ))}
      </div>
    </div>
  );
}
