import { useRef, useState } from 'react'
import { Camera, Upload, X, RotateCcw } from 'lucide-react'

export function ImageUpload({
  onImageSelect,
  currentImage = null,
  onClear,
  label = 'Selecionar Imagem',
  description = 'Clique ou arraste uma imagem',
  aspectRatio = 'portrait' // 'portrait' | 'square' | 'landscape'
}) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    landscape: 'aspect-video'
  }

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) return

    setIsLoading(true)

    try {
      // Redimensionar imagem para economizar espaco
      const resizedImage = await resizeImage(file, 800)
      onImageSelect(resizedImage)
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-2">
      {label && <label className="label">{label}</label>}

      <div
        className={`relative ${aspectClasses[aspectRatio]} rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          isDragging
            ? 'border-primary-500 bg-primary-500/10'
            : currentImage
            ? 'border-transparent'
            : 'border-slate-300 dark:border-dark-border hover:border-primary-500/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-6 h-6 text-white" />
              </button>
              {onClear && (
                <button
                  onClick={onClear}
                  className="p-3 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-500 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary-500 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-dark-border flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium">{description}</p>
                  <p className="text-xs text-slate-400">PNG, JPG ate 5MB</p>
                </div>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

// Funcao para redimensionar imagem
async function resizeImage(file, maxWidth) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}
