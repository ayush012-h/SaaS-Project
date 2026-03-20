import { useState } from 'react'
import { supabase } from '../lib/supabase'

const EMOJI_OPTIONS = [
  { emoji: '😍', label: 'Love it', value: 5 },
  { emoji: '😊', label: 'Good', value: 4 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '😕', label: 'Bad', value: 2 },
  { emoji: '😤', label: 'Terrible', value: 1 },
]

const FEEDBACK_TYPES = [
  { icon: '🐛', label: 'Bug', value: 'bug' },
  { icon: '💡', label: 'Idea', value: 'idea' },
  { icon: '💬', label: 'General', value: 'general' },
  { icon: '🙏', label: 'Request', value: 'request' },
]

export default function FeedbackWidget({ darkMode = true, _asModal = false, onModalClose }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) // 1=type, 2=rating, 3=message, 4=success
  const [feedbackType, setFeedbackType] = useState(null)
  const [rating, setRating] = useState(null)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [hoveredEmoji, setHoveredEmoji] = useState(null)

  const bg = darkMode ? '#0F0F1A' : '#FFFFFF'
  const surface = darkMode ? '#1A1A2A' : '#F5F5F8'
  const border = darkMode ? '#2A2A3A' : '#E0E0E8'
  const text = darkMode ? '#E8E8F0' : '#1A1A2A'
  const muted = darkMode ? '#666680' : '#888899'

  function resetWidget() {
    setStep(1)
    setFeedbackType(null)
    setRating(null)
    setMessage('')
    setEmail('')
    setLoading(false)
  }

  function handleClose() {
    setIsOpen(false)
    setTimeout(resetWidget, 300)
    if (onModalClose) onModalClose()
  }

  async function handleSubmit() {
    if (!message.trim()) return
    setLoading(true)

    try {
      // Get current user if logged in
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || null
      const userEmail = session?.user?.email || email || null

      // Step 1 — Save to Supabase
      const { error: dbError } = await supabase
        .from('feedback')
        .insert({
          user_id: userId,
          user_email: userEmail,
          type: feedbackType,
          rating: rating,
          message: message.trim(),
          page: window.location.pathname,
          created_at: new Date().toISOString(),
        })

      if (dbError) {
        console.error('DB error:', dbError.message)
      }

      // Step 2 — Send email via Supabase Edge Function
      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-feedback-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: feedbackType,
            rating: rating,
            message: message.trim(),
            user_email: userEmail,
            page: window.location.pathname,
          }),
        }
      )

      setStep(4)

    } catch (err) {
      console.error('Feedback error:', err)
      // Still show success to user — don't frustrate them
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Trigger Button — hidden when used as modal */}
      {!_asModal && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            top: 24,
            right: 32,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
            border: 'none',
            borderRadius: 50,
            padding: '12px 20px',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(108,99,255,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,99,255,0.4)'
          }}
        >
          <span style={{ fontSize: 16 }}>💬</span>
          Feedback
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Widget Panel — always visible in modal mode */}
      {(_asModal || isOpen) && (
        <div style={{
          position: _asModal ? 'relative' : 'fixed',
          top: _asModal ? 'auto' : 80,
          right: _asModal ? 'auto' : 32,
          zIndex: _asModal ? 1 : 1001,
          width: 360,
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>

          {/* Header */}
          <div style={{
            padding: '20px 24px 16px',
            borderBottom: `1px solid ${border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: `linear-gradient(135deg, rgba(108,99,255,0.08), rgba(62,207,207,0.04))`,
          }}>
            <div>
              <div style={{
                fontSize: 15,
                fontWeight: 800,
                color: text,
                marginBottom: 2,
              }}>
                Share Your Feedback
              </div>
              <div style={{ fontSize: 12, color: muted }}>
                Help us make SubTrackr better
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: 8,
                width: 32, height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: muted,
                fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>

          {/* Step Progress */}
          {step < 4 && (
            <div style={{
              display: 'flex',
              gap: 4,
              padding: '12px 24px 0',
            }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{
                  flex: 1, height: 3,
                  borderRadius: 4,
                  background: s <= step
                    ? 'linear-gradient(135deg, #6C63FF, #3ECFCF)'
                    : border,
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          )}

          <div style={{ padding: '20px 24px 24px' }}>

            {/* STEP 1 — Feedback Type */}
            {step === 1 && (
              <div>
                <div style={{
                  fontSize: 13,
                  color: muted,
                  marginBottom: 16,
                  fontWeight: 600,
                }}>
                  What kind of feedback is this?
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}>
                  {FEEDBACK_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setFeedbackType(type.value)
                        setStep(2)
                      }}
                      style={{
                        background: feedbackType === type.value
                          ? 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(62,207,207,0.1))'
                          : surface,
                        border: `1px solid ${feedbackType === type.value ? '#6C63FF' : border}`,
                        borderRadius: 12,
                        padding: '14px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'all 0.15s',
                        color: text,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#6C63FF'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        if (feedbackType !== type.value) {
                          e.currentTarget.style.borderColor = border
                        }
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{type.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Emoji Rating */}
            {step === 2 && (
              <div>
                <div style={{
                  fontSize: 13,
                  color: muted,
                  marginBottom: 20,
                  fontWeight: 600,
                }}>
                  How would you rate your experience?
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 24,
                }}>
                  {EMOJI_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setRating(opt.value)
                        setStep(3)
                      }}
                      onMouseEnter={() => setHoveredEmoji(opt.value)}
                      onMouseLeave={() => setHoveredEmoji(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 4px',
                        borderRadius: 10,
                        transition: 'transform 0.15s',
                        transform: hoveredEmoji === opt.value
                          ? 'scale(1.2) translateY(-4px)'
                          : 'scale(1)',
                      }}
                    >
                      <span style={{ fontSize: 32 }}>{opt.emoji}</span>
                      <span style={{
                        fontSize: 10,
                        color: muted,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: muted,
                    cursor: 'pointer',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  ← Back
                </button>
              </div>
            )}

            {/* STEP 3 — Message */}
            {step === 3 && (
              <div>
                <div style={{
                  fontSize: 13,
                  color: muted,
                  marginBottom: 12,
                  fontWeight: 600,
                }}>
                  Tell us more
                  <span style={{
                    marginLeft: 6,
                    fontSize: 18,
                  }}>
                    {EMOJI_OPTIONS.find(o => o.value === rating)?.emoji}
                  </span>
                </div>

                {/* Message textarea */}
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={
                    feedbackType === 'bug'
                      ? 'Describe what happened and how to reproduce it...'
                      : feedbackType === 'idea'
                      ? 'Describe your idea and how it would help you...'
                      : feedbackType === 'request'
                      ? 'What feature would you like to see?'
                      : 'Share your thoughts about SubTrackr...'
                  }
                  rows={4}
                  style={{
                    width: '100%',
                    background: surface,
                    border: `1px solid ${border}`,
                    borderRadius: 12,
                    padding: '12px 14px',
                    color: text,
                    fontSize: 13,
                    resize: 'none',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6C63FF'}
                  onBlur={e => e.target.style.borderColor = border}
                />

                {/* Character count */}
                <div style={{
                  textAlign: 'right',
                  fontSize: 11,
                  color: message.length > 450 ? '#FF6363' : muted,
                  marginTop: 4,
                  marginBottom: 12,
                }}>
                  {message.length}/500
                </div>

                {/* Email field (if not logged in) */}
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email (optional — for follow-up)"
                  type="email"
                  style={{
                    width: '100%',
                    background: surface,
                    border: `1px solid ${border}`,
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: text,
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: 16,
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6C63FF'}
                  onBlur={e => e.target.style.borderColor = border}
                />

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      flex: 1,
                      padding: '11px 0',
                      background: surface,
                      border: `1px solid ${border}`,
                      borderRadius: 10,
                      color: muted,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!message.trim() || loading}
                    style={{
                      flex: 2,
                      padding: '11px 0',
                      background: !message.trim()
                        ? surface
                        : 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                      border: 'none',
                      borderRadius: 10,
                      color: !message.trim() ? muted : '#fff',
                      cursor: !message.trim() ? 'not-allowed' : 'pointer',
                      fontSize: 13,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.15s',
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={{
                          width: 13, height: 13,
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        Sending...
                      </>
                    ) : (
                      'Send Feedback ✓'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — Success */}
            {step === 4 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  fontSize: 56,
                  marginBottom: 16,
                  animation: 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  🎉
                </div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: text,
                  marginBottom: 8,
                }}>
                  Thanks for your feedback!
                </div>
                <div style={{
                  fontSize: 13,
                  color: muted,
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}>
                  We read every single message. Your feedback
                  directly shapes what we build next.
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '10px 28px',
                    background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes spin {
          to { transform: rotate(360deg) }
        }
        @keyframes bounceIn {
          from { transform: scale(0) }
          to { transform: scale(1) }
        }
      `}</style>
    </>
  )
}