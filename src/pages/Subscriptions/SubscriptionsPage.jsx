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
import { Download, History, Tag as TagIcon, FileText } from 'lucide-react'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const CATEGORIES = ['All', 'Entertainment', 'Productivity', 'Health & Fitness', 'News & Media',
  'Cloud Storage', 'Gaming', 'Education', 'Finance', 'Music', 'Design', 'Developer Tools', 'Other']

export default function SubscriptionsPage() {
  const { subscriptions, loading, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions()
  const { isPro } = useAuth()

  useEffect(() => {
    document.title = 'My Subscriptions — SubTrackr'
  }, [])
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Subscriptions</h1>
          <p className="text-text-muted mt-1">
            {subscriptions.length} total
            {!isPro && <span className="ml-2 text-status-warning">{subscriptions.length}/{FREE_LIMIT} free</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => isPro ? setShowExportOptions(!showExportOptions) : null}
              className={`btn-secondary flex items-center gap-2 ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download size={18} />
              Export
            </button>
            {showExportOptions && isPro && (
              <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-slide-up">
                <button onClick={handleExportCSV} className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-bg-hover flex items-center gap-2 border-b border-border">
                  <FileText size={16} className="text-brand-purple" />
                  Export as CSV
                </button>
                <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-bg-hover flex items-center gap-2">
                  <CreditCard size={16} className="text-brand-teal" />
                  Export as PDF
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
            onClick={() => canAdd ? setAddOpen(true) : toast.error('Upgrade to Pro to add more subscriptions!')}
            className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Subscription
          </button>
        </div>
      </div>

      {isPro && <DuplicateDetector userPlan="pro" isEmbedded={true} />}

      {/* Filters */}
      <div className="card p-4 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input className="input pl-10" placeholder="Search subscriptions..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                category === cat
                  ? 'text-white shadow-glow-purple'
                  : 'bg-bg-elevated text-text-muted border border-border hover:border-brand-purple/40'
              }`}
              style={category === cat ? { background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' } : {}}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">
            {[...Array(6)].map((_, i) => <SkeletonSubscriptionRow key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          search || category !== 'All' ? (
            <EmptySearch searchTerm={search || category} onClearSearch={() => { setSearch(''); setCategory('All'); }} />
          ) : (
            <EmptySubscriptions onAddClick={() => setAddOpen(true)} />
          )
        ) : (
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
                  <td className="table-cell text-text-secondary">
                    {sub.category ? (sub.category.charAt(0).toUpperCase() + sub.category.slice(1)) : '—'}
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
