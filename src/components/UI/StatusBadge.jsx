const STATUS_CONFIG = {
  active: { label: 'Active', className: 'badge-active' },
  trial: { label: 'Trial', className: 'badge-trial' },
  cancelled: { label: 'Cancelled', className: 'badge-cancelled' },
  paused: { label: 'Paused', className: 'badge-paused' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active
  return <span className={config.className}>{config.label}</span>
}
