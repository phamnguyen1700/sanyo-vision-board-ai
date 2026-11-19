'use client'

import { ImageOff, RefreshCw, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

interface ImageUploadOverlayProps {
  imageUrl: string | null
  alt: string
  emptyLabel?: string
  uploadLabel?: string
  changeLabel?: string
  removeLabel?: string
  onChange: (imageUrl: string | null) => void
}

function revokePreview(imageUrl: string | null) {
  if (imageUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(imageUrl)
  }
}

export function ImageUploadOverlay({
  imageUrl,
  alt,
  emptyLabel = 'Chưa có ảnh',
  uploadLabel = 'Tải ảnh lên',
  changeLabel = 'Đổi ảnh',
  removeLabel = 'Xóa ảnh',
  onChange,
}: ImageUploadOverlayProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hideOverlay, setHideOverlay] = useState(false)

  const handleFileChange = (file: File | undefined) => {
    if (!file) return
    revokePreview(imageUrl)
    onChange(URL.createObjectURL(file))
    setHideOverlay(true)
  }

  const handleRemove = () => {
    revokePreview(imageUrl)
    onChange(null)
    setHideOverlay(true)
  }

  return (
    <div
      className="cms-common-image-upload"
      data-overlay-hidden={hideOverlay ? 'true' : 'false'}
      aria-label={imageUrl ? alt : emptyLabel}
      onMouseLeave={() => setHideOverlay(false)}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={alt} />
      ) : (
        <span className="cms-common-image-upload__empty">
          <ImageOff aria-hidden="true" />
          {emptyLabel}
        </span>
      )}
      <div className="cms-common-image-upload__overlay">
        {imageUrl ? (
          <>
            <Button
              type="button"
              variant="ghost"
              className="cms-common-image-upload__action"
              onClick={() => {
                setHideOverlay(true)
                fileInputRef.current?.click()
              }}
            >
              <RefreshCw aria-hidden="true" />
              {changeLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="cms-common-image-upload__action cms-common-image-upload__action--danger"
              onClick={handleRemove}
            >
              <Trash2 aria-hidden="true" />
              {removeLabel}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="cms-common-image-upload__action"
            onClick={() => {
              setHideOverlay(true)
              fileInputRef.current?.click()
            }}
          >
            <Upload aria-hidden="true" />
            {uploadLabel}
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        className="cms-common-image-upload__input"
        type="file"
        accept="image/*"
        onChange={(event) => {
          handleFileChange(event.target.files?.[0])
          event.target.value = ''
        }}
        aria-label={imageUrl ? changeLabel : uploadLabel}
      />
    </div>
  )
}
