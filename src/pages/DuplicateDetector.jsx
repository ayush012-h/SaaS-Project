import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { 
  ShieldAlert, 
  Trash2, 
  ChevronRight, 
  Loader2, 
  CheckCircle, 
  Zap, 
  MinusCircle, 
  ArrowRightLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import ProGate from '../components/ProGate'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function DuplicateDetector({ userPlan, isEmbedded = false }) {
  const navigate = useNavigate()
  const { isPro: authIsPro } = useAuth()
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanLabel, setScanLabel] = useState('')
  const [subscriptions, setSubscriptions] = useState([])
  const [duplicates, setDuplicates] = useState([])
  const [dismissedPairs, setDismissedPairs] = useState([])

  const isPro = userPlan === 'pro' || authIsPro

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const [subsRes, dismissedRes] = await Promise.all([
        supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('dismissed_duplicates').select('pair_id').eq('user_id', user.id)
      ])
      if (subsRes.data) setSubscriptions(subsRes.data)
      if (dismissedRes.data) setDismissedPairs(dismissedRes.data.map(d => d.pair_id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function startScan() {
    setScanning(true)
    setDuplicates([])
    
    // Visual effect
    for (let i = 0; i < subscriptions.length; i++) {
      const progress = Math.round(((i + 1) / subscriptions.length) * 100)
      setScanProgress(progress)
      setScanLabel(`Analyzing ${subscriptions[i].name}...`)
      await new Promise(r => setTimeout(r, 400))
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/Detect-duplicates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ subscriptions })
      })
      const data = await response.json()
      
      // Filter out dismissed
      const newDups = (data.duplicates || []).filter(d => !dismissedPairs.includes(d.pair_id))
      setDuplicates(newDups)
      
      if (newDups.length === 0) toast.success('No duplicates found! 🎉')
      else toast.error(`${newDups.length} duplicate pairs detected!`)
    } catch (e) {
      console.error(e)
    } finally {
      setScanning(false)
      setScanProgress(0)
    }
  }

  async function dismissPair(pairId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('dismissed_duplicates').insert({
        user_id: user.id,
        pair_id: pairId
      })
      setDuplicates(prev => prev.filter(d => d.pair_id !== pairId))
      setDismissedPairs(prev => [...prev, pairId])
      toast.success('Duplicate pair dismissed')
    } catch (e) {
      toast.error('Failed to dismiss')
    }
  }

  const potentialSavings = useMemo(() => {
    return duplicates.reduce((sum, d) => sum + Math.min(d.sub1.amount, d.sub2.amount), 0)
  }, [duplicates])

  const content = (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: isEmbedded ? '0 0 40px 0' : '40px 20px' }}>
      {/* Header - Hidden if embedded */}
      {!isEmbedded && (
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#E8E8F0', marginBottom: '12px' }}>
            AI Duplicate Detector
          </h1>
          <p style={{ color: '#9999BB', fontSize: '16px' }}>
            We'll scan your subscriptions for overlapping features or duplicate charges.
          </p>
        </div>
      )}

      {/* Control Box */}
      <div style={{ 
        background: '#1A1A2A', 
        borderRadius: '24px', 
        padding: isEmbedded ? '24px' : '32px', 
        border: '1px solid #2A2A3E',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        {!scanning ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                <div style={{ 
                width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(108, 99, 255, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C63FF'
                }}>
                <Zap size={24} />
                </div>
                <div>
                    <h3 style={{ color: '#E8E8F0', margin: 0, fontSize: '16px' }}>Scan for duplicates</h3>
                    <p style={{ color: '#666680', margin: 0, fontSize: '13px' }}>AI will analyze {subscriptions.length} active subs</p>
                </div>
            </div>
            <button 
              onClick={startScan}
              style={{
                background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px',
                fontWeight: '800', fontSize: '14px', cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(108, 99, 255, 0.3)'
              }}
            >
              Start AI Scan
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#E8E8F0', fontWeight: '700' }}>
               <span>{scanLabel}</span>
               <span>{scanProgress}%</span>
            </div>
            <div style={{ height: '8px', background: '#0F0F1A', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', width: `${scanProgress}%`, 
                background: 'linear-gradient(90deg, #6C63FF, #3ECFCF)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Potential Savings Banner */}
      {duplicates.length > 0 && (
        <div style={{ 
          background: 'rgba(76, 255, 143, 0.1)', 
          border: '1px solid rgba(76, 255, 143, 0.2)',
          borderRadius: '16px', padding: '16px 24px', marginBottom: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4CFF8F', fontWeight: '700' }}>
            <Zap size={20} />
            Potential Monthly Savings: ₹{potentialSavings.toFixed(0)}
          </div>
        </div>
      )}

      {/* Duplicate Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {duplicates.map((dup, idx) => (
          <div 
            key={dup.pair_id} 
            style={{ 
              background: '#13131F', borderRadius: '20px', border: '1px solid #1E1E2E', padding: '20px',
              animation: `fadeIn 0.4s ease backwards ${idx * 0.1}s`
            }}
          >
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>Overlap Detected</span>
              <span style={{ color: dup.confidence === 'high' ? '#FF6363' : '#FFD700', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>{dup.confidence} Confidence</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
              {[dup.sub1, dup.sub2].map((sub, i) => (
                <div key={i} style={{ flex: 1, background: '#1A1A2A', padding: '12px', borderRadius: '16px', border: '1px solid #2A2A3E', textAlign: 'center' }}>
                  <img src={`https://logo.clearbit.com/${sub.name.toLowerCase()}.com`} style={{ width: '32px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
                  <p style={{ color: '#E8E8F0', fontWeight: '700', margin: '0 0 2px 0', fontSize: '13px' }}>{sub.name}</p>
                  <p style={{ color: '#666680', fontSize: '11px', margin: 0 }}>₹{sub.amount}/mo</p>
                </div>
              ))}
            </div>

            <p style={{ color: '#9999BB', fontSize: '13px', lineHeight: '1.5', margin: '0 0 20px 0', textAlign: 'center' }}>{dup.reason}</p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => navigate(`/cancel-guide?service=${dup.sub2.name}`)}
                style={{ flex: 1, background: 'rgba(255, 99, 99, 0.1)', border: '1px solid rgba(255, 99, 99, 0.2)', color: '#FF6363', padding: '10px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
              >
                Cancel {dup.sub2.name}
              </button>
              <button 
                onClick={() => dismissPair(dup.pair_id)}
                style={{ background: '#1A1A2A', border: '1px solid #2A2A3E', color: '#666680', padding: '10px 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
              >
                Ignore
              </button>
            </div>
          </div>
        ))}
        {!scanning && duplicates.length === 0 && !loading && isEmbedded && (
            <div style={{ textAlign: 'center', color: '#666680', fontSize: '13px' }}>Scan your active subscriptions for potential savings.</div>
        )}
      </div>
    </div>
  )

  return isPro ? content : <ProGate featureName="Duplicate Detection">{content}</ProGate>
}
