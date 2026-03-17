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
  const FREE_LIMIT = 5

  const canAdd = isPro || subscriptions.length < FREE_LIMIT

  const filtered = subscriptions
    .filter(s => category === 'All' || s.category === category)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
        <button
          onClick={() => canAdd ? setAddOpen(true) : toast.error('Upgrade to Pro to add more subscriptions!')}
          className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Subscription
        </button>
      </div>

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
                        {sub.notes && <p className="text-xs text-text-muted truncate max-w-[120px]">{sub.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-text-secondary">{sub.category || '—'}</td>
                  <td className="table-cell font-semibold text-text-primary">{sub.currency || '₹'}{Number(sub.amount).toFixed(2)}</td>
                  <td className="table-cell text-text-secondary capitalize">{sub.billing_cycle}</td>
                  <td className="table-cell text-text-secondary">
                    {sub.next_renewal_date ? format(new Date(sub.next_renewal_date), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="table-cell"><StatusBadge status={sub.status} /></td>
                  <td className="table-cell text-right">
                    <ChevronRight size={16} className={`text-text-muted transition-transform duration-200 ${selectedSub?.id === sub.id ? 'translate-x-1 text-brand-purple' : ''}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
