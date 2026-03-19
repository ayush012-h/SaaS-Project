import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, X, RotateCcw, ZoomIn } from 'lucide-react'

export default function ImageCropper({ image, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = useCallback((crop) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom)
  }, [])

  const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  async function handleConfirm() {
    try {
      // Create a canvas to crop the image
      const canvas = document.createElement('canvas')
      const img = new Image()
      img.src = image
      
      await new Promise((resolve) => (img.onload = resolve))
      
      const ctx = canvas.getContext('2d')
      
      // Set canvas size to the desired cropped area
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )
      
      canvas.toBlob((blob) => {
        onCropComplete(blob)
      }, 'image/jpeg', 0.95)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '600px', background: '#13131F', 
          borderRadius: '32px', border: '1px solid #1E1E2E', overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #1E1E2E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#E8E8F0' }}>Fine-tune your Avatar</h3>
            <p style={{ margin: '4px 0 0 0', color: '#666680', fontSize: '14px' }}>Crop to perfectly fit the circle dashboard</p>
          </div>
          <button onClick={onCancel} style={{ background: '#1A1A2A', border: 'none', color: '#666680', cursor: 'pointer', padding: '8px', borderRadius: '12px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Cropping Area */}
        <div style={{ position: 'relative', height: '400px', background: '#0A0A0F' }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Controls */}
        <div style={{ padding: '32px', borderTop: '1px solid #1E1E2E', background: '#13131F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
             <ZoomIn size={18} color="#666680" />
             <input 
               type="range" 
               min={1} max={3} step={0.1} 
               value={zoom} 
               onChange={(e) => setZoom(parseFloat(e.target.value))}
               style={{ flex: 1, accentColor: '#6C63FF' }}
             />
             <button onClick={() => setZoom(1)} style={{ background: 'transparent', border: 'none', color: '#6C63FF', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>
                RESET
             </button>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
             <button 
                onClick={onCancel}
                style={{ flex: 1, padding: '16px', borderRadius: '16px', background: '#1A1A2A', border: '1px solid #2A2A3E', color: '#E8E8F0', fontWeight: '800', cursor: 'pointer' }}
             >
                Cancel
             </button>
             <button 
                onClick={handleConfirm}
                style={{ 
                  flex: 2, padding: '16px', borderRadius: '16px', 
                  background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', 
                  border: 'none', color: '#fff', fontWeight: '800', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
             >
                <Save size={18} /> Apply Changes
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
