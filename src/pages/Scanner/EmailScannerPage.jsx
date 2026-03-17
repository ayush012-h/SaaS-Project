import { useState, useEffect } from 'react'
import { ScanText, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { supabase } from '../../lib/supabase'
import ProGate from '../../components/UI/ProGate'
import toast from 'react-hot-toast'

export default function EmailScannerPage() {
  const { isPro, user } = useAuth()
  const { addSubscription, subscriptions } = useSubscriptions()
  const [text, setText] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState([])
  const [added, setAdded] = useState({})

  useEffect(() => {
    document.title = 'Email Scanner — SubTrackr'
  }, [])

  async function handleScan() {
    if (!text.trim()) return toast.error('Please paste some text first')
    setScanning(true)
    setResults([])
    try {
      const { data, error } = await supabase.functions.invoke('scan-email-text', {
        body: { text, user_id: user.id }
      })
      if (error) throw error
      const found = data.subscriptions || []
      if (found.length === 0) toast.error('No subscriptions detected in the text')
      else toast.success(`Found ${found.length} subscription${found.length > 1 ? 's' : ''}!`)
      setResults(found)
    } catch (err) {
      toast.error('Scan failed. Check your OpenAI API key.')
      console.error(err)
    } finally {
      setScanning(false)
    }
  }

  async function handleAdd(sub) {
    try {
      await addSubscription({
        name: sub.service_name,
        amount: sub.amount,
        billing_cycle: sub.billing_cycle || 'monthly',
        next_renewal_date: sub.next_renewal_date || null,
        category: 'Other',
        status: 'active',
      })
      setAdded(prev => ({ ...prev, [sub.service_name]: true }))
      toast.success(`${sub.service_name} added!`)
    } catch (err) {
      toast.error(err.message || 'Failed to add')
    }
  }

  if (!isPro) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Email Scanner</h1>
          <p className="text-text-muted mt-1">Paste your bank statement or emails to auto-detect subscriptions</p>
        </div>
        <ProGate feature="the AI Email Scanner" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.2))', border: '1px solid rgba(108,99,255,0.4)' }}>
          <ScanText size={22} className="text-brand-purple" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Email Scanner</h1>
          <p className="text-text-muted mt-0.5">AI-powered subscription detection from your emails or bank statements</p>
        </div>
      </div>

      {/* Input */}
      <div className="card">
        <label className="label text-base mb-3">Paste your email or bank statement text</label>
        <textarea
          className="input min-h-48 resize-y font-mono text-sm"
          placeholder="Paste your Gmail inbox, bank statement, or any text containing subscription charges here...

Example:
- Netflix charged $15.99 on March 1
- Spotify Premium: $9.99/month
- Adobe Creative Cloud renewal: $54.99"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-text-muted text-xs">Your text is processed securely via OpenAI and never stored.</p>
          <button onClick={handleScan} disabled={scanning || !text.trim()} className="btn-primary flex items-center gap-2">
            {scanning
              ? <><Loader2 size={16} className="animate-spin" /> Scanning...</>
              : <><ScanText size={16} /> Scan Text</>}
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-5">
            Detected Subscriptions ({results.length})
          </h2>
          <div className="space-y-3">
            {results.map((sub, i) => {
              const alreadyExists = subscriptions.some(s => s.name.toLowerCase() === sub.service_name.toLowerCase())
              const wasAdded = added[sub.service_name]
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: `hsl(${(i * 50) % 360}, 60%, 50%)` }}>
                      {sub.service_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{sub.service_name}</p>
                      <p className="text-text-muted text-xs">
                        ${Number(sub.amount).toFixed(2)}/{sub.billing_cycle || 'month'}
                        {sub.next_renewal_date && ` · Next: ${sub.next_renewal_date}`}
                      </p>
                    </div>
                  </div>
                  {wasAdded || alreadyExists ? (
                    <div className="flex items-center gap-1.5 text-status-savings text-sm font-medium">
                      <CheckCircle size={16} />
                      {alreadyExists && !wasAdded ? 'Already tracked' : 'Added'}
                    </div>
                  ) : (
                    <button onClick={() => handleAdd(sub)} className="btn-secondary flex items-center gap-1.5 text-sm py-2 px-4">
                      <Plus size={15} />
                      Add
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
