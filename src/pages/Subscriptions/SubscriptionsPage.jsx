import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, Filter, CreditCard, ChevronRight } from 'lucide-react'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { useAuth } from '../../contexts/AuthContext'
import StatusBadge from '../../components/UI/StatusBadge'
import SubscriptionModal from '../../components/UI/SubscriptionModal'
import SubscriptionDetailModal from '../../components/UI/SubscriptionDetailModal'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ServiceLogo } from '../../lib/logos'
import { SkeletonSubscriptionRow } from '../../components/Skeleton'
import { EmptySubscriptions, EmptySearch } from '../../components/EmptyState'
import DuplicateDetector from '../DuplicateDetector'
import SubscriptionHistory from '../../components/SubscriptionHistory'
import ProGate from '../../components/UI/ProGate'
import { redirectToCheckout } from '../../lib/razorpay'
import { Download, History, Tag as TagIcon, FileText } from 'lucide-react'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useIsMobile } from '../../hooks/useIsMobile'

const CATEGORIES = ['All', 'Entertainment', 'Productivity', 'Health & Fitness', 'News & Media',
  'Cloud Storage', 'Gaming', 'Education', 'Finance', 'Music', 'Design', 'Developer Tools', 'Other']

export default function SubscriptionsPage() {
  const { subscriptions, loading, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions()
  const { isPro } = useAuth()

  useEffect(() => {
    document.title = 'My Subscriptions — SubTrackr'
  }, [])
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [selectedSub, setSelectedSub] = useState(null)
  const [deletingSub, setDeletingSub] = useState(null)
  const [selectedHistorySub, setSelectedHistorySub] = useState(null)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const FREE_LIMIT = 5

  const canAdd = isPro || subscriptions.length < FREE_LIMIT

  const filtered = subscriptions
    .filter(s => category === 'All' || s.category?.toLowerCase() === category?.toLowerCase())
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                           (s.tags && s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
      return matchesSearch
    })

  const handleExportCSV = () => {
    if (!isPro) return
    const headers = ['Name', 'Amount', 'Currency', 'Cycle', 'Category', 'Next Renewal', 'Status', 'Tags']
    const rows = filtered.map(s => [
      s.name,
      s.amount,
      s.currency || '₹',
      s.billing_cycle,
      s.category,
      s.next_renewal_date,
      s.status,
      (s.tags || []).join(', ')
    ])
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `subscriptions_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    setShowExportOptions(false)
  }

  const handleExportPDF = () => {
    if (!isPro) return
    const doc = new jsPDF()
    doc.text('My Subscriptions Report', 14, 15)
    
    const tableColumn = ["Name", "Amount", "Cycle", "Category", "Renewal"]
    const tableRows = filtered.map(s => [
      s.name,
      `${s.currency || '₹'}${s.amount}`,
      s.billing_cycle,
      s.category,
      s.next_renewal_date
    ])

    doc.autoTable(tableColumn, tableRows, { startY: 20 })
    doc.save(`subscriptions_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
    setShowExportOptions(false)
  }

  async function handleAdd(data) {
    if (!canAdd) return toast.error(`Free plan limited to ${FREE_LIMIT} subscriptions. Upgrade to Pro!`)
    try {
      const promise = addSubscription(data)
      toast.promise(promise, {
        loading: 'Saving...',
        success: `${data.name} added successfully!`,
        error: (err) => err.message || 'Failed to add'
      })
      await promise
    } catch {
      // toast.error handled by toast.promise
    }
  }

  async function handleUpdate(data) {
    try {
      const promise = updateSubscription(selectedSub.id, data)
      toast.promise(promise, {
        loading: 'Saving...',
        success: `${data.name || selectedSub.name} updated`,
        error: (err) => err.message || 'Failed to update'
      })
      await promise
    } catch {
      // handled
    }
  }

  async function handleDelete(sub) {
    try {
      const promise = deleteSubscription(sub.id)
      toast.promise(promise, {
        loading: 'Removing...',
        success: `${sub.name} removed`,
        error: (err) => err.message || 'Failed to delete'
      })
      await promise
      setDeletingSub(null)
      setSelectedSub(null)
    } catch {
      // handled
    }
  }

  return (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-6'} animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-black text-text-primary tracking-tight`}>Subscriptions</h1>
          <p className="text-text-muted text-[11px] sm:text-sm font-bold uppercase tracking-widest mt-0.5">
            {subscriptions.length} total
            {!isPro && <span className="ml-2 text-status-warning/80">{subscriptions.length}/{FREE_LIMIT}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => isPro ? setShowExportOptions(!showExportOptions) : null}
              className={`p-2 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 border border-border bg-bg-elevated/50 text-text-primary hover:bg-bg-hover transition-colors ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download size={isMobile ? 16 : 18} />
              {!isMobile && <span className="text-sm font-bold italic tracking-wide">Export</span>}
            </button>
            {showExportOptions && isPro && (
              <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-slide-up">
                <button onClick={handleExportCSV} className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-bg-hover flex items-center gap-2 border-b border-border font-bold italic">
                  <FileText size={16} className="text-brand-purple" /> CSV Export
                </button>
                <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-bg-hover flex items-center gap-2 font-bold italic">
                  <CreditCard size={16} className="text-brand-teal" /> PDF Export
                </button>
              </div>
            )}
            {!isPro && showExportOptions && (
              <div className="absolute right-0 mt-2 z-20">
                <ProGate feature="data export" />
              </div>
            )}
          </div>
          <button
            onClick={() => canAdd ? setAddOpen(true) : redirectToCheckout()}
            className="p-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-teal text-white shadow-lg hover:opacity-90 transition-all flex items-center gap-2 border-none cursor-pointer"
          >
            <Plus size={isMobile ? 18 : 18} strokeWidth={3} />
            <span className={`${isMobile ? 'hidden sm:inline' : ''} text-sm font-black uppercase tracking-tight`}>Add New</span>
          </button>
        </div>
      </div>

      {isPro && <DuplicateDetector userPlan="pro" isEmbedded={true} />}

      {/* Filters */}
      <div className={`card ${isMobile ? 'p-3' : 'p-4'} space-y-4`}>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            className={`w-full bg-bg-elevated border border-border rounded-xl text-text-primary outline-none focus:border-brand-purple/50 transition-all ${isMobile ? 'py-2 px-9 text-sm' : 'py-2.5 px-10'}`} 
            placeholder="Search subscriptions..." 
            value={search}
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1`}>
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 shrink-0 border border-transparent ${
                category === cat
                  ? 'text-white shadow-glow-purple border-brand-purple/30'
                  : 'bg-bg-elevated/60 text-text-muted hover:text-text-primary border-border/60 hover:border-brand-purple/40'
              }`}
              style={category === cat ? { background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' } : {}}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={isMobile ? "space-y-3" : "card p-0 overflow-hidden"}>
        {error ? (
          <div className="p-8 text-center text-status-danger bg-status-danger/5 rounded-xl border border-status-danger/20">
            <p className="font-bold mb-2">Failed to load subscriptions</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        ) : loading ? (
          <div className="divide-y divide-border">
            {[...Array(6)].map((_, i) => <SkeletonSubscriptionRow key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            {search || category !== 'All' ? (
              <EmptySearch searchTerm={search || category} onClearSearch={() => { setSearch(''); setCategory('All'); }} />
            ) : (
              <EmptySubscriptions onAddClick={() => setAddOpen(true)} />
            )}
          </div>
        ) : isMobile ? (
          /* Mobile Card List */
          filtered.map(sub => (
            <motion.div
              layout
              key={sub.id}
              onClick={() => setSelectedSub(sub)}
              className="card p-3 flex flex-col gap-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ServiceLogo name={sub.name} size={40} color={sub.color || '#6C63FF'} />
                    <div className="absolute -bottom-1 -right-1">
                      <StatusBadge status={sub.status} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-black tracking-tight text-text-primary truncate">{sub.name}</p>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{sub.category || 'Other'}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-brand-teal line-clamp-1">{sub.currency || '₹'}{Number(sub.amount).toFixed(0)}</p>
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-tighter -mt-1">{sub.billing_cycle}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex flex-wrap gap-1">
                  {sub.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                      #{tag}
                    </span>
                  ))}
                  {sub.tags?.length > 2 && <span className="text-[9px] text-text-muted italic px-1">+{sub.tags.length - 2}</span>}
                </div>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Calendar size={12} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    {sub.next_renewal_date ? format(new Date(sub.next_renewal_date), 'MMM d') : 'NO DATE'}
                  </span>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-brand-purple/5 to-transparent pointer-events-none" />
            </motion.div>
          ))
        ) : (
          /* Desktop Table */
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-elevated/50">
                <th className="table-header text-left">Service</th>
                <th className="table-header text-left">Category</th>
                <th className="table-header text-left">Amount</th>
                <th className="table-header text-left">Billing</th>
                <th className="table-header text-left">Next Renewal</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`table-row table-row-clickable ${selectedSub?.id === sub.id ? 'table-row-selected' : ''}`}
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <ServiceLogo name={sub.name} size={36} color={sub.color || '#6C63FF'} />
                      <div>
                        <p className="font-medium text-text-primary">{sub.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {sub.tags?.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-text-secondary capitalize">
                    {sub.category || 'Other'}
                  </td>
                  <td className="table-cell font-semibold text-text-primary">{sub.currency || '₹'}{Number(sub.amount).toFixed(2)}</td>
                  <td className="table-cell text-text-secondary capitalize">{sub.billing_cycle}</td>
                  <td className="table-cell text-text-secondary">
                    {sub.next_renewal_date ? format(new Date(sub.next_renewal_date), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="table-cell"><StatusBadge status={sub.status} /></td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isPro && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedHistorySub(sub); }}
                          className="p-1.5 rounded-lg text-text-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-colors"
                          title="View History"
                        >
                          <History size={16} />
                        </button>
                      )}
                      <ChevronRight size={16} className={`text-text-muted transition-transform duration-200 ${selectedSub?.id === sub.id ? 'translate-x-1 text-brand-purple' : ''}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* History Modal */}
      {selectedHistorySub && (
        <SubscriptionHistory 
          subscriptionId={selectedHistorySub.id}
          subscriptionName={selectedHistorySub.name}
          onClose={() => setSelectedHistorySub(null)}
        />
      )}

      {/* Detail Modal */}
      {selectedSub && (
        <SubscriptionDetailModal
          sub={selectedSub}
          onClose={() => setSelectedSub(null)}
          onSave={handleUpdate}
          onDelete={(sub) => setDeletingSub(sub)}
        />
      )}

      {/* Add Modal */}
      <SubscriptionModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />

      {/* Delete Confirm */}
      {deletingSub && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeletingSub(null)}>
          <div className="modal-content max-w-sm p-6">
            <h3 className="text-xl font-bold text-text-primary mb-2">Remove Subscription</h3>
            <p className="text-text-muted mb-6">
              Are you sure you want to remove <strong className="text-text-primary">{deletingSub.name}</strong>? This is permanent.
            </p>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setDeletingSub(null)}>Cancel</button>
              <button className="btn-danger flex-1" onClick={() => handleDelete(deletingSub)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
