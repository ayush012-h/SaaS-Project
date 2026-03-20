import { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Loader2, 
  Sparkles,
  Pencil,
  X,
  Check
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import Avatar from './Avatar'
import toast from 'react-hot-toast'
import { redirectToCheckout } from '../lib/razorpay'


export default function ProfileUpload() {
  const { profile, updateProfile, loading: profileLoading } = useUser()
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
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

  // Standard Compression Utility
  async function compressImage(file, maxWidth = 400) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(resolve, 'image/jpeg', 0.85)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const loadingToast = toast.loading('Optimizing & uploading...')
    
    try {
      // 1. Compress Image
      const compressedBlob = await compressImage(file)
      
      // 2. Upload to Storage with Dual-Bucket Strategy
      const fileName = `${profile.id}-v${Date.now()}.jpg`
      let uploadError = null
      let finalBucket = 'avatars'
      
      // Attempt 1: plural 'avatars'
      const res1 = await supabase.storage.from('avatars').upload(fileName, compressedBlob, { upsert: true })
      uploadError = res1.error

      // Attempt 2: 'avatars' retry with different upsert flag
      if (uploadError && (uploadError.message.includes('not found') || uploadError.error === 'Bucket not found')) {
         const res2 = await supabase.storage.from('avatars').upload(fileName, compressedBlob, { upsert: false })
         uploadError = res2.error
         finalBucket = 'avatars'
      }

      if (uploadError) throw uploadError

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(finalBucket)
        .getPublicUrl(fileName)

      // 4. Update Profile Table
      await updateProfile({ avatar_url: publicUrl })
      
      toast.dismiss(loadingToast)
      toast.success('Identity verified! Profile updated ✨')
    } catch (err) {
      console.error('Upload flow failed:', err)
      toast.dismiss(loadingToast)
      toast.error(err.message || 'Check storage permissions')
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
    } catch (err) {
       toast.error('Failed to remove photo')
    } finally {
       setUploading(false)
    }
  }

  async function handleNameBlur() {
    if (!name || name === profile?.full_name) return
    try {
       await updateProfile({ full_name: name })
       toast.success('Name updated')
    } catch (err) {
       toast.error('Failed to save name')
       setName(profile?.full_name || '')
    }
  }

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'
    
  // Calculate completion percentage
  const fields = [
    Boolean(profile?.full_name),
    Boolean(profile?.avatar_url),
    Boolean(profile?.bio),
    Boolean(profile?.display_name || profile?.currency_code)
  ]
  const completedFields = fields.filter(f => f).length
  const completionPercent = Math.round((completedFields / fields.length) * 100)

  return (
    <div style={{
      background: '#0F0F1A', border: '1px solid #1E1E2E', borderRadius: '16px',
      padding: '28px', marginBottom: '24px', display: 'flex', gap: '32px',
      alignItems: 'center', transition: 'all 0.3s ease', position: 'relative'
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
              fontWeight: '700', cursor: 'pointer', padding: '4px', textDecoration: 'underline' 
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
          onChange={handleAvatarUpload}
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
                    if (e.key === 'Enter') {
                      handleNameBlur()
                      setIsEditingName(false)
                    } else if (e.key === 'Escape') {
                      setName(profile?.full_name || '')
                      setIsEditingName(false)
                    }
                  }}
                  autoFocus
                  placeholder="Your name"
                  spellCheck={false}
                  className="input py-1 px-3"
                  style={{ fontSize: '18px', fontWeight: '800', maxWidth: '250px' }}
                />
                <button 
                  onClick={() => { handleNameBlur(); setIsEditingName(false); }}
                  className="p-1.5 rounded bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/30 transition-colors"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={() => { setName(profile?.full_name || ''); setIsEditingName(false); }}
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
                 background: profile?.plan === 'pro' ? 'linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(62, 207, 207, 0.15))' : 'rgba(255, 255, 255, 0.08)',
                 color: profile?.plan === 'pro' ? '#6C63FF' : '#A0A0B8',
                 display: 'flex', alignItems: 'center', gap: '6px'
               }}>
                 {profile?.plan === 'pro' && <Sparkles size={12} />}
                 {profile?.plan === 'pro' ? 'PRO MEMBER' : 'FREE ACCOUNT'}
               </div>
               {profile?.plan !== 'pro' && (
                 <button 
                   onClick={() => redirectToCheckout()}
                   className="text-xs text-brand-purple hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer"
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

  )
}
