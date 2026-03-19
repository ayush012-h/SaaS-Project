import { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Trash2, 
  Loader2, 
  Sparkles,
  User,
  ExternalLink
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import Avatar from './Avatar'
import toast from 'react-hot-toast'

export default function ProfileUpload() {
  const { profile, updateProfile, loading: profileLoading } = useUser()
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
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

      // Attempt 2: singular 'avatar' fallback
      if (uploadError && (uploadError.message.includes('not found') || uploadError.error === 'Bucket not found')) {
         const res2 = await supabase.storage.from('avatar').upload(fileName, compressedBlob, { upsert: true })
         uploadError = res2.error
         finalBucket = 'avatar'
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
          size={100}
          loading={uploading}
          showOverlay={true}
          overlayIcon={Camera}
          overlayText="Change"
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Full Name (Inline Edit) */}
        <div>
          <input 
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Your name"
            spellCheck={false}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: '22px', fontWeight: '900', color: '#E8E8F0', padding: 0,
              width: '100%', borderBottom: '1px solid transparent', transition: 'border 0.2s', margin: 0
            }}
            onFocus={e => e.target.style.borderBottomColor = '#6C63FF'}
            onMouseOver={e => e.target.style.borderBottomColor = 'rgba(108, 99, 255, 0.4)'}
            onMouseOut={e => e.target.style.borderBottomColor = 'transparent'}
          />
          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div style={{ 
               padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900',
               background: profile?.plan === 'pro' ? 'linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(62, 207, 207, 0.15))' : 'rgba(102, 102, 128, 0.1)',
               border: profile?.plan === 'pro' ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid rgba(102, 102, 128, 0.2)',
               color: profile?.plan === 'pro' ? '#6C63FF' : '#666680',
               display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase'
             }}>
               {profile?.plan === 'pro' && <Sparkles size={12} />}
               {profile?.plan === 'pro' ? 'PRO MEMBER' : 'FREE ACCOUNT'}
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '24px', marginTop: '4px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8888AA', fontSize: '13px' }}>
             <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(108, 99, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Mail size={14} color="#6C63FF" />
             </div>
             {profile?.email || 'No email set'}
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8888AA', fontSize: '13px' }}>
             <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(76, 255, 143, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Calendar size={14} color="#4CFF8F" />
             </div>
             Joined {memberSince}
           </div>
        </div>
      </div>
    </div>
  )
}
