import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { ServiceLogo } from '../lib/logos'

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { subscriptions } = useSubscriptions()

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredSubs = subscriptions.filter(s => 
    String(s.name || '').toLowerCase().includes(query.toLowerCase()) || 
    String(s.category || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) // Limit to 5 results

  return (
    <div className="modal-overlay flex items-start justify-center pt-[15vh] px-4 z-[100]" onClick={(e) => {
      if (e.target === e.currentTarget) setIsOpen(false)
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg bg-bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search size={20} className="text-text-muted" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search subscriptions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-base placeholder:text-text-muted"
          />
          <div className="flex gap-1 text-[10px] font-bold text-text-muted">
            <kbd className="bg-bg-elevated px-1.5 py-0.5 rounded border border-border">esc</kbd>
            <span>to close</span>
          </div>
        </div>
        
        {query && (
          <div className="py-2">
            {filteredSubs.length > 0 ? (
              filteredSubs.map((sub, i) => (
                <div 
                  key={sub.id} 
                  className={`flex items-center gap-3 p-3 px-4 cursor-pointer hover:bg-bg-hover transition-colors ${i === 0 ? 'bg-bg-elevated/30' : ''}`}
                  onClick={() => {
                    setIsOpen(false)
                    navigate('/subscriptions')
                  }}
                >
                  <ServiceLogo name={sub.name} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{sub.name}</p>
                    {sub.category && <p className="text-xs text-text-muted truncate capitalize">{sub.category}</p>}
                  </div>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-text-muted text-sm">
                No subscriptions found for "{query}"
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
