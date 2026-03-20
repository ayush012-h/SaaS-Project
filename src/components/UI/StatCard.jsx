import { TrendingUp, TrendingDown } from 'lucide-react'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#6C63FF', trend }) {
  const isMobile = useIsMobile()
  
  return (
    <div className={`card group p-3 sm:p-5`} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className={`flex items-start justify-between ${isMobile ? 'mb-1' : 'mb-4'}`}>
        <div className="flex-1 min-w-0">
          <p className="text-text-muted text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">{title}</p>
          <p className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black text-text-primary truncate`}>{value}</p>
          {!isMobile && subtitle && <p className="text-text-muted text-xs mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`${isMobile ? 'w-8 h-8' : 'w-11 h-11'} rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ml-2`}
          style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
          <Icon size={isMobile ? 16 : 20} style={{ color }} />
        </div>
      </div>
      
      {!isMobile && trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-auto pt-2">
          {trend > 0 ? (
            <TrendingUp size={14} className="text-status-danger" />
          ) : trend < 0 ? (
            <TrendingDown size={14} className="text-status-savings" />
          ) : (
            <span className="text-text-muted text-sm font-bold">—</span>
          )}
          {trend !== 0 && (
            <span className={`text-[10px] font-bold ${trend > 0 ? 'text-status-danger' : 'text-status-savings'}`}>
              {Math.abs(trend)}% vs last month
            </span>
          )}
        </div>
      )}

      {isMobile && trend !== undefined && trend !== 0 && (
        <div className="flex items-center gap-1 mt-1">
          {trend > 0 ? (
            <div className="text-[10px] font-bold text-status-danger flex items-center">+{trend}%</div>
          ) : (
            <div className="text-[10px] font-bold text-status-savings flex items-center">{trend}%</div>
          )}
        </div>
      )}
    </div>
  )
}
