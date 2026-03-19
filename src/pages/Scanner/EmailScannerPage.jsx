import { useState, useEffect } from 'react'
import { 
  ScanText, 
  Plus, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Mail, 
  ShieldCheck, 
  FileText, 
  Zap, 
  ChevronRight,
  Sparkles,
  Search,
  History,
  Info
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { supabase } from '../../lib/supabase'
import ProGate from '../../components/UI/ProGate'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function EmailScannerPage() {
  const { isPro, user } = useAuth()
  const { addSubscription, subscriptions } = useSubscriptions()
  const [text, setText] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState([])
  const [added, setAdded] = useState({})
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    document.title = 'AI Email Scanner — SubTrackr'
  }, [])

  async function handleScan() {
    if (!text.trim()) return toast.error('Please paste some text first')
    setScanning(true)
    setResults([])
    setScanProgress(0)

    // Visual scan progress simulation
    const interval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 5, 95))
    }, 150)

    try {
      const { data, error } = await supabase.functions.invoke('scan-email-text', {
        body: { text, user_id: user.id }
      })
      
      clearInterval(interval)
      setScanProgress(100)
      
      if (error) throw error
      const found = data.subscriptions || []
      
      if (found.length === 0) {
        toast.error('No subscriptions detected in the text')
      } else {
        toast.success(`Found ${found.length} subscription${found.length > 1 ? 's' : ''}! 🚀`)
        setResults(found)
      }
    } catch (err) {
      toast.error('AI Scan failed. Please try again.')
      console.error(err)
    } finally {
      setTimeout(() => {
        setScanning(false)
        setScanProgress(0)
      }, 500)
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
      toast.success(`${sub.service_name} added to your tracker!`)
    } catch (err) {
      toast.error(err.message || 'Failed to add')
    }
  }

  if (!isPro) {
    return (
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">Email Scanner</h1>
          <p className="text-text-muted mt-2 text-lg">Harness AI to automate your subscription tracking.</p>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '32px' }}>
            <div style={{ filter: 'blur(20px)', opacity: 0.1, position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' }} />
            <ProGate featureName="the AI Email Scanner" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in py-8">
      {/* Premium Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                padding: '8px 12px', background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.2)',
                color: '#6C63FF', borderRadius: '10px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase'
              }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '6px' }} /> AI Powered
              </div>
              <div style={{ color: '#4CFF8F', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>
                 Secure & Private
              </div>
           </div>
           <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#E8E8F0', letterSpacing: '-1px', margin: 0 }}>Smart Scanner</h1>
           <p style={{ color: '#9999BB', fontSize: '18px', marginTop: '8px' }}>Paste text from your bank or billing emails to instantly track services.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
        {/* Main Interface */}
        <div className="space-y-8">
          <div style={{ 
            background: '#13131F', borderRadius: '32px', border: '1px solid #1E1E2E', padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
               <div style={{ 
                 width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(108, 99, 255, 0.1)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C63FF'
               }}>
                  <Mail size={20} />
               </div>
               <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Input Content</h2>
            </div>

            <div style={{ position: 'relative' }}>
              <textarea
                style={{ 
                  width: '100%', minHeight: '300px', background: '#0A0A0F', border: '1px solid #1E1E2E',
                  borderRadius: '20px', padding: '24px', color: '#E8E8F0', fontSize: '15px', lineHeight: '1.6',
                  outline: 'none', transition: 'all 0.3s', fontFamily: 'monospace'
                }}
                placeholder="Paste account statements, payment confirmation emails, or app store receipts here..."
                value={text}
                onChange={e => setText(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#6C63FF'}
                onBlur={(e) => e.target.style.borderColor = '#1E1E2E'}
              />
              {text && !scanning && (
                <button 
                   onClick={() => setText('')}
                   style={{ position: 'absolute', top: '16px', right: '16px', background: '#13131F', border: '1px solid #1E1E2E', color: '#666680', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666680', fontSize: '12px' }}>
                 <ShieldCheck size={16} color="#4CFF8F" />
                 End-to-end encrypted processing
              </div>
              <button 
                onClick={handleScan} 
                disabled={scanning || !text.trim()} 
                style={{ 
                  background: scanning ? '#1E1E2E' : 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                  color: '#fff', border: 'none', borderRadius: '16px', padding: '16px 36px',
                  fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: scanning ? 'none' : '0 10px 30px rgba(108, 99, 255, 0.3)'
                }}
              >
                {scanning ? (
                  <><Loader2 size={20} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><ScanText size={20} /> Run AI Extraction</>
                )}
              </button>
            </div>

            {/* Scanning Overlay */}
            <AnimatePresence>
                {scanning && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(4px)', borderRadius: '32px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <motion.div 
                                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    style={{ width: '64px', height: '64px', border: '4px solid rgba(108, 99, 255, 0.2)', borderTopColor: '#6C63FF', borderRadius: '50%', margin: '0 auto' }}
                                />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>AI Brain Scanning</h3>
                            <p style={{ fontSize: '14px', color: '#666680', marginBottom: '24px' }}>Processing your data through neural networks...</p>
                            <div style={{ height: '6px', width: '100%', background: '#1E1E2E', borderRadius: '10px', overflow: 'hidden' }}>
                                <motion.div 
                                    style={{ height: '100%', background: 'linear-gradient(90deg, #6C63FF, #3ECFCF)', width: `${scanProgress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Results Area */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Extraction Results</h2>
                    <span style={{ fontSize: '13px', color: '#6C63FF', fontWeight: '800', background: 'rgba(108, 99, 255, 0.1)', padding: '4px 12px', borderRadius: '100px' }}>{results.length} Detected</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {results.map((sub, i) => {
                    const alreadyExists = subscriptions.some(s => s.name.toLowerCase() === sub.service_name.toLowerCase())
                    const wasAdded = added[sub.service_name]
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        key={i} 
                        style={{ 
                            background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '24px',
                            display: 'flex', flexDirection: 'column', gap: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                           <div style={{ 
                                width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #1A1A2A, #0A0A0F)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', color: '#6C63FF', border: '1px solid #1E1E2E'
                           }}>
                             {sub.service_name?.[0]?.toUpperCase()}
                           </div>
                           <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>{sub.service_name}</h4>
                              <p style={{ margin: 0, fontSize: '12px', color: '#666680' }}>Detected in text</p>
                           </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ background: '#0A0A0F', padding: '12px', borderRadius: '12px', border: '1px solid #1E1E2E' }}>
                                <p style={{ fontSize: '10px', color: '#666680', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Amount</p>
                                <p style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>₹{Number(sub.amount).toFixed(2)}</p>
                            </div>
                            <div style={{ background: '#0A0A0F', padding: '12px', borderRadius: '12px', border: '1px solid #1E1E2E' }}>
                                <p style={{ fontSize: '10px', color: '#666680', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Cycle</p>
                                <p style={{ fontSize: '15px', fontWeight: '700', margin: 0, textTransform: 'capitalize' }}>{sub.billing_cycle || 'Monthly'}</p>
                            </div>
                        </div>

                        {wasAdded || alreadyExists ? (
                          <div style={{ background: 'rgba(76, 255, 143, 0.1)', color: '#4CFF8F', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                             <CheckCircle size={18} /> {alreadyExists && !wasAdded ? 'Tracked' : 'Added'}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAdd(sub)} 
                            style={{ background: '#6C63FF', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >
                             <Plus size={18} /> Add to Dashboard
                          </button>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Help */}
        <div className="space-y-6">
            <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '24px' }}>
               <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={18} color="#6C63FF" /> How to use
               </h3>
               {[
                 { step: '1', text: 'Copy text from your bank or billing email.' },
                 { step: '2', text: 'Paste it into the neural input field.' },
                 { step: '3', text: 'Our AI extracts name, price, and cycles.' },
                 { step: '4', text: 'Add verified items to your tracker.' }
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: '#6C63FF', color: '#fff', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.step}</div>
                    <p style={{ fontSize: '13px', color: '#9999BB', margin: 0, lineHeight: '1.4' }}>{item.text}</p>
                 </div>
               ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(62, 207, 207, 0.1), rgba(108, 99, 255, 0.1))', borderRadius: '24px', border: '1px solid rgba(108, 99, 255, 0.2)', padding: '24px' }}>
               <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#3ECFCF' }}>Pro Tip</h3>
               <p style={{ fontSize: '13px', color: '#9999BB', lineHeight: '1.5', margin: 0 }}>
                  You can paste multiple emails at once. The AI is smart enough to distinguish between separate services and recurring dates.
               </p>
            </div>
            
            <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '24px', textAlign: 'center' }}>
               <History size={32} color="#666680" style={{ margin: '0 auto 16px' }} />
               <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>Scan History</h3>
               <p style={{ fontSize: '11px', color: '#666680', marginBottom: '16px' }}>View your previous AI extraction sessions.</p>
               <button className="btn-secondary" style={{ width: '100%', fontSize: '12px' }}>View Logs</button>
            </div>
        </div>
      </div>
    </div>
  )
}
