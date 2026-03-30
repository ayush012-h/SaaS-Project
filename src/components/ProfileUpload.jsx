import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Camera,
  Mail,
  Calendar,
  Loader2,
  Sparkles,
  Pencil,
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  CropIcon
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Avatar from './Avatar'
import toast from 'react-hot-toast'
import { smartCheckout, prefetchOrder } from '../lib/payment'

// ─────────────────────────────────────────────────────────
// Image Crop Modal — pure canvas, no external deps
// ─────────────────────────────────────────────────────────
function CropModal({ src, onCrop, onClose }) {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)
  const SIZE = 280 // crop circle diameter

  // Draw the image on canvas each time state changes
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)

    // Clip to circle
    ctx.save()
    ctx.beginPath()
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2)
    ctx.clip()

    // Draw image centered with pan + scale + rotation
    ctx.translate(SIZE / 2 + offset.x, SIZE / 2 + offset.y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(scale, scale)
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
    ctx.restore()

    // Overlay ring
    ctx.beginPath()
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2)
    ctx.strokeStyle = '#6C63FF'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [scale, rotation, offset])

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      imageRef.current = img
      // Auto-fit: scale image to fill the circle
      const fit = Math.max(SIZE / img.naturalWidth, SIZE / img.naturalHeight) * 1.05
      setScale(fit)
      draw()
    }
  }, [src])

  useEffect(() => { draw() }, [draw])

  // Drag handlers for panning
  const onMouseDown = (e) => {
    setDragging(true)
    dragStart.current = {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - offset.x,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - offset.y,
    }
  }
  const onMouseMove = (e) => {
    if (!dragging) return
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    setOffset({ x: cx - dragStart.current.x, y: cy - dragStart.current.y })
  }
  const onMouseUp = () => setDragging(false)

  function exportCrop() {
    const canvas = canvasRef.current
    canvas.toBlob((blob) => { onCrop(blob) }, 'image/jpeg', 0.9)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#0F0F1A', border: '1px solid #1E1E2E',
        borderRadius: 24, padding: 28, width: '100%', maxWidth: 380,
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#E8E8F0' }}>Crop Photo</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#666680' }}>Drag to reposition • Scroll to zoom</p>
          </div>
          <button onClick={onClose} style={{
            background: '#1A1A2A', border: '1px solid #1E1E2E', borderRadius: 8,
            width: 32, height: 32, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: '#666680',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Canvas crop area */}
        <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUp}
            style={{
              borderRadius: '50%',
              cursor: dragging ? 'grabbing' : 'grab',
              boxShadow: '0 0 0 3px rgba(108,99,255,0.4), 0 8px 32px rgba(0,0,0,0.4)',
              touchAction: 'none',
            }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <button onClick={() => setScale(s => Math.max(0.3, s - 0.1))} style={ctrlBtn}>
            <ZoomOut size={16} />
          </button>
          <input
            type="range" min="0.3" max="4" step="0.05"
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#6C63FF' }}
          />
          <button onClick={() => setScale(s => Math.min(4, s + 0.1))} style={ctrlBtn}>
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setRotation(r => (r + 90) % 360)} style={ctrlBtn} title="Rotate 90°">
            <RotateCw size={16} />
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px 0',
            background: '#1A1A2A', border: '1px solid #1E1E2E',
            borderRadius: 12, color: '#9999BB', fontWeight: 600,
            fontSize: 14, cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={exportCrop} style={{
            flex: 2, padding: '11px 0',
            background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
            border: 'none', borderRadius: 12,
            color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
          }}>
            <CropIcon size={16} /> Apply & Upload
          </button>
        </div>
      </div>
    </div>
  )
}

const ctrlBtn = {
  background: '#1A1A2A', border: '1px solid #1E1E2E',
  borderRadius: 8, width: 34, height: 34,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#9999BB', flexShrink: 0,
}

// ─────────────────────────────────────────────────────────
// Main ProfileUpload component
// ─────────────────────────────────────────────────────────
export default function ProfileUpload() {
  const { user, profile, isPro, updateProfile, loading: profileLoading } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)   // raw data-url for crop modal
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name)
  }, [profile])

  if (profileLoading) return (
    <div style={{ padding: '28px', background: '#0F0F1A', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin text-brand-purple" />
    </div>
  )

  if (!profile) return null

  // When user picks a file, show the crop modal instead of uploading immediately
  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCropSrc(ev.target.result)
    reader.readAsDataURL(file)
    // Reset input so same file can be picked again
    e.target.value = ''
  }

  // Called after crop modal confirms — receives the cropped Blob
  async function handleCropConfirm(croppedBlob) {
    setCropSrc(null)
    setUploading(true)
    const loadingToast = toast.loading('Uploading...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const filePath = `${user.id}/avatar.jpg`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedBlob, { upsert: true, contentType: 'image/jpeg' })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
      await updateProfile({ avatar_url: `${publicUrl}?t=${Date.now()}` })

      toast.dismiss(loadingToast)
      toast.success('Profile picture updated ✨')
    } catch (err) {
      console.error('Upload failed:', err)
      toast.dismiss(loadingToast)
      toast.error(err.message || 'Upload failed — check storage permissions')
    } finally {
      setUploading(false)
    }
  }

  async function removePhoto() {
    if (!window.confirm('Delete profile picture?')) return
    setUploading(true)
    try {
      await updateProfile({ avatar_url: null })
      toast.success('Profile picture removed')
    } catch { toast.error('Failed to remove photo') }
    finally { setUploading(false) }
  }

  async function handleNameBlur() {
    if (!name || name === profile?.full_name) return
    try {
      await updateProfile({ full_name: name })
      toast.success('Name updated')
    } catch {
      toast.error('Failed to save name')
      setName(profile?.full_name || '')
    }
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'

  const fields = [
    Boolean(profile?.full_name),
    Boolean(profile?.avatar_url),
    Boolean(profile?.bio),
    Boolean(profile?.display_name || profile?.currency_code),
  ]
  const completionPercent = Math.round((fields.filter(Boolean).length / fields.length) * 100)

  return (
    <>
      {/* Crop Modal */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onCrop={handleCropConfirm}
          onClose={() => setCropSrc(null)}
        />
      )}

      <div style={{
        background: '#0F0F1A', border: '1px solid #1E1E2E', borderRadius: '16px',
        padding: '28px', marginBottom: '24px', display: 'flex', gap: '32px',
        alignItems: 'center', transition: 'all 0.3s ease', position: 'relative',
        flexWrap: 'wrap',
      }}>
        {/* Avatar Display */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Avatar
            url={profile?.avatar_url}
            name={profile?.full_name}
            size={80}
            loading={uploading}
            showOverlay={true}
            overlayIcon={Camera}
            overlayText="Upload photo"
            isPro={profile?.plan === 'pro'}
            onClick={() => fileInputRef.current.click()}
          />

          {profile?.avatar_url && !uploading && (
            <button
              onClick={removePhoto}
              style={{
                background: 'none', border: 'none', color: '#666680', fontSize: '11px',
                fontWeight: '700', cursor: 'pointer', padding: '4px', textDecoration: 'underline',
              }}
            >
              Remove photo
            </button>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        {/* User Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          {/* Full Name (Inline Edit) */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { handleNameBlur(); setIsEditingName(false) }
                      else if (e.key === 'Escape') { setName(profile?.full_name || ''); setIsEditingName(false) }
                    }}
                    autoFocus
                    placeholder="Your name"
                    spellCheck={false}
                    className="input py-1 px-3"
                    style={{ fontSize: '18px', fontWeight: '800', maxWidth: '250px' }}
                  />
                  <button
                    onClick={() => { handleNameBlur(); setIsEditingName(false) }}
                    className="p-1.5 rounded bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/30 transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => { setName(profile?.full_name || ''); setIsEditingName(false) }}
                    className="p-1.5 rounded bg-status-danger/20 text-status-danger hover:bg-status-danger/30 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="group flex items-center gap-2 cursor-pointer w-fit"
                  onClick={() => setIsEditingName(true)}
                >
                  <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#E8E8F0', margin: 0 }} className="truncate">
                    {name || 'Add your name'}
                  </h2>
                  <Pencil size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}

              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
                  background: profile?.plan === 'pro' ? 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(62,207,207,0.15))' : 'rgba(255,255,255,0.08)',
                  color: profile?.plan === 'pro' ? '#6C63FF' : '#A0A0B8',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  {profile?.plan === 'pro' && <Sparkles size={12} />}
                  {profile?.plan === 'pro' ? 'PRO MEMBER' : 'FREE ACCOUNT'}
                </div>
                {profile?.plan !== 'pro' && (
                  <button
                    onClick={() => smartCheckout()}
                    onMouseEnter={() => prefetchOrder()}
                    className="btn-pro px-6 py-2"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="mt-2 w-full max-w-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-text-primary">Profile completion</span>
              <span className="text-xs font-bold text-brand-teal">{completionPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-purple to-brand-teal transition-all duration-500 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            {completionPercent < 100 && (
              <p className="text-[10px] text-text-muted mt-1.5">
                Add your {!profile?.full_name ? 'name' : !profile?.avatar_url ? 'avatar' : !profile?.display_name ? 'display name' : 'bio'} to reach 100%
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8888AA', fontSize: '12px' }}>
              <Mail size={14} className="text-text-muted" />
              <span className="truncate max-w-[150px]">{profile?.email || 'No email set'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8888AA', fontSize: '12px' }}>
              <Calendar size={14} className="text-text-muted" />
              <span>Joined {memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
