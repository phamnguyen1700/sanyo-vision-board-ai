'use client'

import { ImageOff, RefreshCw, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { LoadingSuccessOverlay } from '@/components/common/loading-success-overlay'
import { Button } from '@/components/ui/button'

interface ImageUploadOverlayProps {
  imageUrl: string | null
  alt: string
  emptyLabel?: string
  uploadLabel?: string
  changeLabel?: string
  removeLabel?: string
  allowRemove?: boolean
  isUploading?: boolean
  onFileSelected?: (file: File) => void | Promise<void>
  onChange: (imageUrl: string | null) => void
}

function revokePreview(imageUrl: string | null) {
  if (imageUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(imageUrl)
  }
}

type ImageUploadStatus = 'idle' | 'loading' | 'success'

export function ImageUploadOverlay({
  imageUrl,
  alt,
  emptyLabel = 'Chưa có ảnh',
  uploadLabel = 'Tải ảnh lên',
  changeLabel = 'Đổi ảnh',
  removeLabel = 'Xóa ảnh',
  allowRemove = true,
  isUploading = false,
  onFileSelected,
  onChange,
}: ImageUploadOverlayProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hideOverlay, setHideOverlay] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<ImageUploadStatus>('idle')
  const successTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current !== null) {
        window.clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isUploading) setUploadStatus('loading')
  }, [isUploading])

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return
    const nextPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(nextPreviewUrl)
    setHideOverlay(true)
    setUploadStatus('loading')
    if (!onFileSelected) {
      revokePreview(imageUrl)
      onChange(nextPreviewUrl)
      setUploadStatus('success')
      return
    }

    try {
      await onFileSelected(file)
      URL.revokeObjectURL(nextPreviewUrl)
      setPreviewUrl(null)
      setUploadStatus('success')
      successTimeoutRef.current = window.setTimeout(() => {
        setUploadStatus('idle')
        successTimeoutRef.current = null
      }, 900)
    } catch {
      URL.revokeObjectURL(nextPreviewUrl)
      setPreviewUrl(null)
      setUploadStatus('idle')
    }
  }

  const handleRemove = () => {
    revokePreview(imageUrl)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setUploadStatus('idle')
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
      {(previewUrl || imageUrl) ? (
        <img src={previewUrl || imageUrl || ''} alt={alt} />
      ) : (
        <span className="cms-common-image-upload__empty">
          <ImageOff aria-hidden="true" />
          {emptyLabel}
        </span>
      )}
      {uploadStatus !== 'idle' ? (
        <LoadingSuccessOverlay
          status={uploadStatus === 'loading' ? 'loading' : 'success'}
          label={uploadStatus === 'loading' ? 'Đang tải ảnh lên' : 'Đã tải ảnh lên'}
        />
      ) : null}
      <div className="cms-common-image-upload__overlay">
        {(previewUrl || imageUrl) ? (
          <>
            <Button
              type="button"
              variant="ghost"
              className="cms-common-image-upload__action"
              disabled={isUploading}
              onClick={() => {
                setHideOverlay(true)
                fileInputRef.current?.click()
              }}
            >
              <RefreshCw aria-hidden="true" />
              {changeLabel}
            </Button>
            {allowRemove ? <Button
              type="button"
              variant="ghost"
              className="cms-common-image-upload__action cms-common-image-upload__action--danger"
              onClick={handleRemove}
            >
              <Trash2 aria-hidden="true" />
              {removeLabel}
            </Button> : null}
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="cms-common-image-upload__action"
              disabled={isUploading}
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
          void handleFileChange(event.target.files?.[0])
          event.target.value = ''
        }}
        aria-label={imageUrl ? changeLabel : uploadLabel}
      />
    </div>
  )
}
