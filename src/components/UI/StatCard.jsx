import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#6C63FF', trend }) {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {trend >= 0
            ? <TrendingUp size={14} className="text-status-savings" />
            : <TrendingDown size={14} className="text-status-danger" />}
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-status-savings' : 'text-status-danger'}`}>
            {Math.abs(trend)}% vs last month
          </span>
        </div>
      )}
    </div>
  )
}
