import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProGate from '../components/ProGate'
import toast from 'react-hot-toast'

export default function Export({ userPlan }) {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [csvOptions, setCsvOptions] = useState({
    active: true,
    cancelled: true,
    notes: false,
  })
  const [pdfOptions, setPdfOptions] = useState({
    summary: true,
    list: true,
    chart: false,
    insights: false,
  })
  const [exporting, setExporting] = useState(null)

  useEffect(() => { fetchSubs() }, [])

  async function fetchSubs() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
    setSubscriptions(data || [])
    setLoading(false)
  }

  function exportCSV() {
    setExporting('csv')
    try {
      let filtered = subscriptions
      if (!csvOptions.active) filtered = filtered.filter(s => s.status !== 'active')
      if (!csvOptions.cancelled) filtered = filtered.filter(s => s.status !== 'cancelled')

      const headers = ['Name', 'Category', 'Amount (₹)', 'Billing Cycle', 'Next Renewal', 'Status', 'Added On']
      if (csvOptions.notes) headers.push('Notes')

      const rows = filtered.map(sub => {
        const row = [
          `"${sub.name}"`,
          `"${sub.category || ''}"`,
          sub.amount,
          `"${sub.billing_cycle || 'monthly'}"`,
          sub.next_renewal_date || '',
          sub.status,
          sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '',
        ]
        if (csvOptions.notes) row.push(`"${sub.notes || ''}"`)
        return row
      })

      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `subtrackr-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('CSV downloaded successfully!')
    } catch (err) {
      toast.error('Export failed. Try again.')
    } finally {
      setExporting(null)
    }
  }

  async function exportPDF() {
    setExporting('pdf')
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      const now = new Date()
      const dateStr = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      const totalMonthly = subscriptions
        .filter(s => s.status === 'active')
        .reduce((sum, s) => sum + parseFloat(s.amount || 0), 0)
      const activeCount = subscriptions.filter(s => s.status === 'active').length

      // Brand color
      const primary = [108, 99, 255]
      const surface = [26, 26, 42]

      // Header background
      doc.setFillColor(...primary)
      doc.rect(0, 0, 220, 40, 'F')

      // Header text
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('SubTrackr', 14, 18)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Subscription Report', 14, 28)
      doc.text(dateStr, 14, 35)

      // Summary section
      if (pdfOptions.summary) {
        doc.setFillColor(26, 26, 42)
        doc.rect(10, 48, 190, 32, 'F')

        doc.setTextColor(108, 99, 255)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('MONTHLY SPEND', 20, 58)
        doc.text('ACTIVE SUBS', 90, 58)
        doc.text('YEARLY ESTIMATE', 150, 58)

        doc.setTextColor(232, 232, 240)
        doc.setFontSize(16)
        doc.text(`₹${totalMonthly.toFixed(0)}`, 20, 70)
        doc.setFontSize(16)
        doc.text(`${activeCount}`, 90, 70)
        doc.setFontSize(16)
        doc.text(`₹${(totalMonthly * 12).toFixed(0)}`, 150, 70)
      }

      // Subscriptions list
      if (pdfOptions.list) {
        let y = 92

        doc.setTextColor(108, 99, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('All Subscriptions', 14, y)
        y += 10

        // Table headers
        doc.setFillColor(26, 26, 42)
        doc.rect(10, y - 4, 190, 10, 'F')
        doc.setTextColor(160, 160, 180)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.text('NAME', 14, y + 2)
        doc.text('CATEGORY', 70, y + 2)
        doc.text('AMOUNT', 120, y + 2)
        doc.text('BILLING', 150, y + 2)
        doc.text('RENEWAL', 175, y + 2)
        y += 12

        const activeSubs = subscriptions.filter(s =>
          (pdfOptions.list && s.status === 'active')
        )

        activeSubs.forEach((sub, i) => {
          if (y > 270) {
            doc.addPage()
            y = 20
          }

          if (i % 2 === 0) {
            doc.setFillColor(15, 15, 26)
            doc.rect(10, y - 4, 190, 10, 'F')
          }

          doc.setTextColor(232, 232, 240)
          doc.setFontSize(8)
          doc.setFont('helvetica', 'normal')
          doc.text(sub.name?.substring(0, 18) || '', 14, y + 2)
          doc.text((sub.category || 'Other')?.substring(0, 14), 70, y + 2)

          doc.setTextColor(108, 99, 255)
          doc.setFont('helvetica', 'bold')
          doc.text(`₹${sub.amount}`, 120, y + 2)

          doc.setTextColor(160, 160, 180)
          doc.setFont('helvetica', 'normal')
          doc.text(sub.billing_cycle || 'monthly', 150, y + 2)
          doc.text(sub.next_renewal_date || '—', 175, y + 2)

          y += 10
        })
      }

      // Footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFillColor(10, 10, 15)
        doc.rect(0, 285, 220, 15, 'F')
        doc.setTextColor(68, 68, 96)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(`Generated by SubTrackr — subtrackr.co`, 14, 292)
        doc.text(`Page ${i} of ${pageCount}`, 180, 292)
      }

      doc.save(`subtrackr-report-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('PDF downloaded successfully!')
    } catch (err) {
      console.error(err)
      toast.error('PDF export failed. Try again.')
    } finally {
      setExporting(null)
    }
  }

  const totalActive = subscriptions.filter(s => s.status === 'active').length
  const totalCancelled = subscriptions.filter(s => s.status === 'cancelled').length

  const pageContent = (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Export Your Data
        </h1>
        <p style={{ color: '#666680', margin: 0, fontSize: 14 }}>
          Download your subscription data for records, taxes, or analysis
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Subscriptions', value: subscriptions.length, color: '#6C63FF' },
          { label: 'Active', value: totalActive, color: '#4CFF8F' },
          { label: 'Cancelled', value: totalCancelled, color: '#FF6363' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#0F0F1A',
            border: '1px solid #1E1E2E',
            borderRadius: 12,
            padding: '16px 20px',
            flex: 1,
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#666680', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Export cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* CSV card */}
        <div style={{
          background: '#0F0F1A',
          border: '1px solid #1E1E2E',
          borderRadius: 16,
          padding: 28,
        }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>📊</div>
          <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>
            Spreadsheet (CSV)
          </h3>
          <p style={{ color: '#666680', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 }}>
            Opens in Excel, Google Sheets, or any spreadsheet app.
            Perfect for analysis and record keeping.
          </p>

          {/* Column preview */}
          <div style={{
            background: '#1A1A2A',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: 10,
            color: '#555570',
            fontFamily: 'monospace',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}>
            Name | Category | Amount | Billing | Renewal | Status
          </div>

          {/* Options */}
          <div style={{ marginBottom: 24 }}>
            {[
              { key: 'active', label: 'Include active subscriptions' },
              { key: 'cancelled', label: 'Include cancelled subscriptions' },
              { key: 'notes', label: 'Include notes' },
            ].map(opt => (
              <label key={opt.key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
                cursor: 'pointer',
                fontSize: 13,
                color: '#C0C0D0',
              }}>
                <input
                  type="checkbox"
                  checked={csvOptions[opt.key]}
                  onChange={e => setCsvOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                  style={{ accentColor: '#6C63FF', width: 14, height: 14 }}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <button
            onClick={exportCSV}
            disabled={exporting === 'csv'}
            style={{
              width: '100%',
              padding: '13px 0',
              background: exporting === 'csv' ? '#1A1A2A' : 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
              border: 'none',
              borderRadius: 10,
              color: exporting === 'csv' ? '#666' : '#fff',
              fontWeight: 800,
              fontSize: 14,
              cursor: exporting === 'csv' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {exporting === 'csv' ? 'Downloading...' : '⬇️ Download CSV'}
          </button>
        </div>

        {/* PDF card */}
        <div style={{
          background: '#0F0F1A',
          border: '1px solid #1E1E2E',
          borderRadius: 16,
          padding: 28,
        }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>📄</div>
          <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>
            PDF Report
          </h3>
          <p style={{ color: '#666680', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 }}>
            Formatted report for your records, accountant,
            or tax filing. Includes SubTrackr branding.
          </p>

          {/* PDF preview */}
          <div style={{
            background: '#1A1A2A',
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 20,
            fontSize: 11,
            color: '#555',
          }}>
            <div style={{ color: '#6C63FF', fontWeight: 700, marginBottom: 4 }}>SubTrackr Report</div>
            <div style={{ borderTop: '1px solid #2A2A3A', paddingTop: 6 }}>
              Monthly Spend | Active Subs | Full List
            </div>
          </div>

          {/* Options */}
          <div style={{ marginBottom: 24 }}>
            {[
              { key: 'summary', label: 'Include summary statistics' },
              { key: 'list', label: 'Include full subscription list' },
              { key: 'chart', label: 'Include monthly breakdown' },
              { key: 'insights', label: 'Include AI insights' },
            ].map(opt => (
              <label key={opt.key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
                cursor: 'pointer',
                fontSize: 13,
                color: '#C0C0D0',
              }}>
                <input
                  type="checkbox"
                  checked={pdfOptions[opt.key]}
                  onChange={e => setPdfOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                  style={{ accentColor: '#6C63FF', width: 14, height: 14 }}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <button
            onClick={exportPDF}
            disabled={exporting === 'pdf'}
            style={{
              width: '100%',
              padding: '13px 0',
              background: exporting === 'pdf' ? '#1A1A2A' : 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
              border: 'none',
              borderRadius: 10,
              color: exporting === 'pdf' ? '#666' : '#fff',
              fontWeight: 800,
              fontSize: 14,
              cursor: exporting === 'pdf' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {exporting === 'pdf' ? 'Generating PDF...' : '⬇️ Download PDF'}
          </button>
        </div>
      </div>
    </div>
  )

  if (userPlan !== 'pro') {
    return <ProGate featureName="CSV & PDF Export">{pageContent}</ProGate>
  }

  return pageContent
}