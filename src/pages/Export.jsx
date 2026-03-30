import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { 
  FileText, 
  BarChart, 
  Download, 
  Table, 
  FileSpreadsheet, 
  Loader2, 
  CheckSquare, 
  Square,
  Sparkles,
  Zap,
  CreditCard
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import toast from 'react-hot-toast'
import ProGate from '../components/ProGate'

export default function Export({ userPlan }) {
  const [loading, setLoading] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [options, setOptions] = useState({
    active: true,
    cancelled: false,
    notes: true,
    summary: true,
    fullList: true,
    monthlyChart: true,
    aiInsights: true
  })

  const isPro = userPlan === 'pro'

  useEffect(() => {
    fetchSubs()
  }, [])

  async function fetchSubs() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id)
      if (data) setSubscriptions(data)
    } finally {
      // Done loading subs
    }
  }

  const exportCSV = () => {
    setLoading(true)
    try {
      const filtered = subscriptions.filter(s => 
        (options.active && s.status === 'active') || 
        (options.cancelled && s.status === 'cancelled')
      )
      
      const headers = ['Name', 'Category', 'Amount', 'Currency', 'Billing Cycle', 'Next Renewal', 'Status']
      if (options.notes) headers.push('Notes')
      
      const rows = filtered.map(s => {
        const row = [
          s.name,
          s.category,
          s.amount,
          s.currency || '₹',
          s.billing_cycle,
          s.next_renewal_date,
          s.status,
        ]
        if (options.notes) row.push(s.notes || '')
        return row
      })

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `SubTrackr-Subscriptions-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      toast.success('Successfully exported CSV! 📊')
    } catch (e) {
      toast.error('Export failed')
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = () => {
    setLoading(true)
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      
      // Purple Header Rectangle
      doc.setFillColor(108, 99, 255)
      doc.rect(0, 0, pageWidth, 40, 'F')
      
      // Header Title
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.text('SubTrackr — Subscription Report', 20, 25)
      
      let y = 55
      
      if (options.summary) {
        const total = subscriptions.reduce((sum, s) => sum + (s.status === 'active' ? s.amount : 0), 0)
        doc.setTextColor(10, 10, 15)
        doc.setFontSize(16)
        doc.text('Performance Summary', 20, y)
        y += 10
        doc.setFontSize(10)
        doc.text(`Total Active Services: ${subscriptions.filter(s => s.status === 'active').length}`, 20, y)
        doc.text(`Monthly Spend (Active): ₹${total.toFixed(2)}`, 100, y)
        y += 15
      }

      if (options.fullList) {
        doc.setFontSize(16)
        doc.text('Subscription Details', 20, y)
        y += 10
        
        // Table Headers
        doc.setFillColor(108, 99, 255)
        doc.rect(20, y, pageWidth - 40, 10, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(10)
        doc.text('Service', 25, y + 7)
        doc.text('Billing', 80, y + 7)
        doc.text('Amount', 130, y + 7)
        doc.text('Status', 170, y + 7)
        y += 10

        subscriptions.forEach((s, idx) => {
          if (y > 270) {
            doc.addPage()
            y = 20
          }
          doc.setTextColor(10, 10, 15)
          if (idx % 2 === 0) {
            doc.setFillColor(248, 249, 250)
            doc.rect(20, y, pageWidth - 40, 10, 'F')
          }
          doc.text(s.name, 25, y + 7)
          doc.text(s.billing_cycle, 80, y + 7)
          doc.text(`₹${s.amount}`, 130, y + 7)
          doc.text(s.status, 170, y + 7)
          y += 10
        })
      }

      const filename = `SubTrackr-Report-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
      toast.success('Generated Premium PDF! 📄')
    } catch (e) {
      console.error(e)
      toast.error('PDF generation failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleOption = (key) => setOptions(prev => ({ ...prev, [key]: !prev[key] }))

  const content = (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#E8E8F0', marginBottom: '12px' }}>Export Subscriptions</h1>
        <p style={{ color: '#9999BB', fontSize: '16px' }}>Take your data everywhere. Export for taxes, budgeting, or just peace of mind.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#1A1A2A', borderRadius: '20px', padding: '24px', border: '1px solid #2A2A3E', textAlign: 'center' }}>
          <p style={{ color: '#666680', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Total Monthly</p>
          <p style={{ color: '#E8E8F0', fontSize: '24px', fontWeight: '900', margin: 0 }}>₹{subscriptions.reduce((s, r) => s + (r.status === 'active' ? r.amount : 0), 0).toFixed(0)}</p>
        </div>
        <div style={{ background: '#1A1A2A', borderRadius: '20px', padding: '24px', border: '1px solid #2A2A3E', textAlign: 'center' }}>
          <p style={{ color: '#666680', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Active Count</p>
          <p style={{ color: '#4CFF8F', fontSize: '24px', fontWeight: '900', margin: 0 }}>{subscriptions.filter(s => s.status === 'active').length}</p>
        </div>
        <div style={{ background: '#1A1A2A', borderRadius: '20px', padding: '24px', border: '1px solid #2A2A3E', textAlign: 'center' }}>
          <p style={{ color: '#666680', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Cancelled</p>
          <p style={{ color: '#FF6363', fontSize: '24px', fontWeight: '900', margin: 0 }}>{subscriptions.filter(s => s.status === 'cancelled').length}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* CSV CARD */}
        <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(62, 207, 207, 0.1)', color: '#3ECFCF' }}><Table size={24} /></div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>Spreadsheet (CSV)</h2>
          </div>
          <p style={{ color: '#9999BB', fontSize: '14px', marginBottom: '24px' }}>Perfect for Excel, Google Sheets, or custom budget trackers.</p>
          
          <div style={{ background: '#0A0A0F', padding: '16px', borderRadius: '12px', marginBottom: '28px' }}>
             <p style={{ color: '#3ECFCF', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Column Preview</p>
             <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666680' }}>
               name, category, amount, currency...
             </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { id: 'active', label: 'Include active subscriptions' },
                { id: 'cancelled', label: 'Include cancelled history' },
                { id: 'notes', label: 'Include personal notes' }
              ].map(opt => (
                <div key={opt.id} onClick={() => toggleOption(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: options[opt.id] ? '#E8E8F0' : '#666680', fontSize: '14px', fontWeight: '500' }}>
                   {options[opt.id] ? <CheckSquare size={18} color="#3ECFCF" /> : <Square size={18} />}
                   {opt.label}
                </div>
              ))}
            </div>
            
            <button 
              onClick={exportCSV}
              disabled={loading}
              style={{ width: '100%', background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', border: 'none', borderRadius: '14px', padding: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />} Download CSV
            </button>
          </div>
        </div>

        {/* PDF CARD */}
        <div style={{ background: '#13131F', borderRadius: '24px', border: '1px solid #1E1E2E', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(108, 99, 255, 0.1)', color: '#6C63FF' }}><FileText size={24} /></div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>Report (PDF)</h2>
          </div>
          <p style={{ color: '#9999BB', fontSize: '14px', marginBottom: '24px' }}>Beautiful premium report with visual summaries and AI insights.</p>
          
          <div style={{ background: '#0A0A0F', height: '90px', borderRadius: '12px', marginBottom: '28px', border: '1px dashed #2A2A3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <p style={{ color: '#666680', fontSize: '12px', fontStyle: 'italic' }}>PDF Preview Mockup</p>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { id: 'summary', label: 'Executive summary stats' },
                { id: 'fullList', label: 'Itemized subscription list' },
                { id: 'monthlyChart', label: 'Include spend breakdown chart' }
              ].map(opt => (
                <div key={opt.id} onClick={() => toggleOption(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: options[opt.id] ? '#E8E8F0' : '#666680', fontSize: '14px', fontWeight: '500' }}>
                   {options[opt.id] ? <CheckSquare size={18} color="#6C63FF" /> : <Square size={18} />}
                   {opt.label}
                </div>
              ))}
            </div>
            
            <button 
              onClick={exportPDF}
              disabled={loading}
              style={{ width: '100%', background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', color: '#fff', border: 'none', borderRadius: '14px', padding: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />} Generate Premium PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return isPro ? content : <ProGate featureName="Data Export">{content}</ProGate>
}
