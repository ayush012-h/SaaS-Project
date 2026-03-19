import React, { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Download, 
  Share2, 
  Crown, 
  ChevronRight,
  Loader2,
  Check
} from 'lucide-react'
import html2canvas from 'html2canvas'
import ProGate from '../components/ProGate'
import toast from 'react-hot-toast'

export default function YearlyReport({ userPlan }) {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [loading, setLoading] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [insights, setInsights] = useState([])
  const reportRef = useRef(null)

  const isPro = userPlan === 'pro'

  useEffect(() => {
    fetchSubs()
  }, [])

  async function fetchSubs() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id)
      if (data) setSubscriptions(data)
    } catch (e) {
      console.error(e)
    }
  }

  const reports = useMemo(() => {
    const totalSpend = subscriptions.reduce((sum, sub) => {
      let amount = sub.amount || 0
      if (sub.billing_cycle === 'yearly') return sum + amount
      return sum + (amount * 12)
    }, 0)

    const categories = subscriptions.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + sub.amount
      return acc
    }, {})

    const topCategory = Object.keys(categories).sort((a,b) => categories[b] - categories[a])[0] || 'N/A'
    const mostExpensive = [...subscriptions].sort((a,b) => b.amount - a.amount)[0]
    
    // Fake monthly data for chart
    const monthlyData = Array.from({length: 12}, (_, i) => {
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]
      const base = totalSpend / 12
      return { month, amount: base + (Math.random() * 200 - 100) }
    })

    const peakMonth = monthlyData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current, monthlyData[0])

    return { totalSpend, topCategory, mostExpensive, monthlyData, peakMonth }
  }, [subscriptions])

  async function generateReport() {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/Generate-Insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ subscriptions })
      })
      const data = await response.json()
      setInsights(data.insights || [])
      toast.success('Report updated with AI insights!')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function downloadReport() {
    if (!reportRef.current) return
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: '#0A0A0F',
      scale: 2
    })
    const link = document.createElement('a')
    link.download = `SubTrackr-Report-${selectedYear}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyShare = () => {
    const text = `I spent ₹${reports.totalSpend.toFixed(0)} on ${subscriptions.length} subscriptions in ${selectedYear} 😅\nTracked with SubTrackr — subtrackr.co`
    navigator.clipboard.writeText(text)
    toast.success('Copied for WhatsApp! 📱')
  }

  const content = (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Year Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
        {[2024, 2025, 2026].map(y => (
          <button 
            key={y}
            onClick={() => setSelectedYear(y)}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              background: selectedYear === y ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
              border: `1px solid ${selectedYear === y ? '#6C63FF' : '#1E1E2E'}`,
              color: selectedYear === y ? '#6C63FF' : '#9999BB',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {y}
          </button>
        ))}
      </div>

      <button 
        onClick={generateReport}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
          color: '#fff',
          border: 'none',
          fontWeight: '800',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
        Generate {selectedYear} Report
      </button>

      {/* The Report Card */}
      <div 
        ref={reportRef}
        style={{ 
          background: '#0A0A0F', 
          borderRadius: '32px', 
          border: '1px solid #1E1E2E',
          overflow: 'hidden',
          paddingBottom: '40px'
        }}
      >
        {/* 1. Hero */}
        <div style={{ 
          padding: '60px 40px', 
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(108, 99, 255, 0.1) 0%, transparent 100%)',
          borderBottom: '1px solid #1E1E2E'
        }}>
          <h1 style={{ color: '#E8E8F0', fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Your {selectedYear} Subscription Summary</h1>
          <div style={{ 
            fontSize: '72px', 
            fontWeight: '900', 
            background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px'
          }}>
            ₹{reports.totalSpend.toFixed(0)}
          </div>
          <p style={{ color: '#666680', fontSize: '18px', marginTop: '8px' }}>Spent across {subscriptions.length} active services</p>
        </div>

        {/* 2. Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '40px' }}>
          {[
            { label: 'Most Expensive', value: reports.mostExpensive?.name || 'N/A', icon: Crown, color: '#FFD700' },
            { label: 'Top Category', value: reports.topCategory, icon: TrendingUp, color: '#3ECFCF' },
            { label: 'Monthly Avg', value: `₹${(reports.totalSpend / 12).toFixed(0)}`, icon: Calendar, color: '#6C63FF' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#13131F', borderRadius: '24px', padding: '24px', border: '1px solid #1E1E2E' }}>
              <stat.icon size={20} style={{ color: stat.color, marginBottom: '16px' }} />
              <p style={{ color: '#666680', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 3. Bar Chart */}
        <div style={{ padding: '0 40px 40px' }}>
          <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800', marginBottom: '32px' }}>Spending Trend</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', gap: '8px' }}>
            {reports.monthlyData.map((data, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${(data.amount / reports.peakMonth.amount) * 100}%`,
                  background: data.month === reports.peakMonth.month ? 'linear-gradient(180deg, #FFD700, #FF9F43)' : 'linear-gradient(180deg, #6C63FF, #3ECFCF)',
                  borderRadius: '6px'
                }} />
                <span style={{ fontSize: '11px', color: '#666680', fontWeight: '700' }}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Top Rankings */}
        <div style={{ padding: '0 40px 40px' }}>
           <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Top Rankings</h3>
           <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', overflow: 'hidden' }}>
             {subscriptions.sort((a,b) => b.amount - a.amount).slice(0, 5).map((sub, i) => (
               <div key={sub.id} style={{ 
                 padding: '16px 24px', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'space-between',
                 borderBottom: i === 4 ? 'none' : '1px solid #1E1E2E'
               }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <span style={{ color: '#666680', fontWeight: '800', fontSize: '14px', width: '20px' }}>#{i+1}</span>
                   <img src={`https://logo.clearbit.com/${sub.name.toLowerCase()}.com`} style={{ width: '32px', height: '32px', borderRadius: '8px' }} onError={(e) => e.target.style.display='none'} />
                   <span style={{ color: '#E8E8F0', fontWeight: '700' }}>{sub.name}</span>
                 </div>
                 <span style={{ color: '#fff', fontWeight: '800' }}>₹{sub.amount}</span>
               </div>
             ))}
           </div>
        </div>

        {/* 5. AI Insights */}
        {insights.length > 0 && (
          <div style={{ padding: '0 40px 20px' }}>
            <div style={{ background: 'rgba(108, 99, 255, 0.05)', borderRadius: '24px', border: '1px dashed #6C63FF', padding: '32px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                 <Sparkles size={24} style={{ color: '#6C63FF' }} />
                 <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: 0 }}>AI Savings Projections</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {insights.map((note, i) => (
                   <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                     <div style={{ background: '#6C63FF', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Check size={10} color="#fff" />
                     </div>
                     <p style={{ color: '#A8A8C0', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{note}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
        <button onClick={downloadReport} style={{ background: '#13131F', border: '1px solid #1E1E2E', borderRadius: '16px', padding: '16px', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Download size={20} /> Download Image
        </button>
        <button onClick={copyShare} style={{ background: 'linear-gradient(135deg, #128C7E, #25D366)', border: 'none', borderRadius: '16px', padding: '16px', color: '#fff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Share2 size={20} /> Share to WhatsApp
        </button>
      </div>
    </div>
  )

  return isPro ? content : <ProGate featureName="Yearly Wrapped Report">{content}</ProGate>
}
