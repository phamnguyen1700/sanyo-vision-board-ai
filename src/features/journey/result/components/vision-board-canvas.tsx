'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { LoadingSuccessOverlay } from '@/components/common/loading-success-overlay'
import { answerPreview } from '@/lib/vision-topics'
import type { JourneyResult } from '../../hooks/use-journey-results'
import type { PlayerImageGenerationStatus, PlayerImageResponse } from '@/types/player.types'

type VisionBoardCanvasProps = {
  results: readonly JourneyResult[]
  images: readonly PlayerImageResponse[]
  imageStatusByQuestionCode: Readonly<Record<string, PlayerImageGenerationStatus>>
  imageSlotsVisible: boolean
}

const canvasWidth = 1600
const canvasHeight = 1000
const questionCodes = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'] as const

function drawWrappedText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let lineIndex = 0

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line, x, y + lineIndex * lineHeight)
      line = word
      lineIndex += 1
    } else {
      line = candidate
    }
  }

  if (line) context.fillText(line, x, y + lineIndex * lineHeight)
}

export function VisionBoardCanvas({ results, images, imageStatusByQuestionCode, imageSlotsVisible }: VisionBoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRefs = useRef<HTMLImageElement[]>([])
  const [imageStatuses, setImageStatuses] = useState<Array<'loading' | 'loaded' | 'error'>>(() => results.map(() => 'loading'))

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || imageRefs.current.length === 0) return

    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.fillStyle = '#fff1b8'
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    const rootStyle = getComputedStyle(document.documentElement)
    const fontFamily = rootStyle.getPropertyValue('--cms-font-family').trim() || 'sans-serif'

    const columns = 3
    const imageWidth = 440
    const imageHeight = 330
    const gapX = 48
    const gapY = 56
    const startX = 72
    const startY = 106
    results.forEach((result, index) => {
      const image = imageRefs.current[index]
      if (!image) return
      const column = index % columns
      const row = Math.floor(index / columns)
      const x = startX + column * (imageWidth + gapX)
      const y = startY + row * (imageHeight + gapY)
      context.drawImage(image, x, y, imageWidth, imageHeight)

      context.fillStyle = '#12203a'
      context.font = `700 22px ${fontFamily}`
      context.fillText(`Q${index + 1}`, x, y + imageHeight + 34)
      context.font = `400 24px ${fontFamily}`
      drawWrappedText(context, answerPreview(result.answer), x + 58, y + imageHeight + 34, imageWidth - 58, 30)
    })
  }, [results])

  useEffect(() => {
    let cancelled = false
    setImageStatuses(results.map((_, index) => imageStatusByQuestionCode[questionCodes[index]] ?? 'loading'))
    const imageSources = results.map((_, index) => images.find((image) => image.questionCode === questionCodes[index])?.imageUrl ?? '')
    const loadedImages = imageSources.map((source) => {
      const image = new Image()
      if (source) {
        image.crossOrigin = 'anonymous'
        image.src = source
      }
      return image
    })

    imageRefs.current = loadedImages
    loadedImages.forEach((image, index) => {
      if (!image.src) {
        setImageStatuses((current) => current.map((status, itemIndex) => itemIndex === index
          ? (imageStatusByQuestionCode[questionCodes[index]] === 'loading' ? 'loading' : 'error')
          : status))
        return
      }
      image.onload = () => {
        if (cancelled) return
        draw()
        setImageStatuses((current) => current.map((status, itemIndex) => itemIndex === index ? 'loaded' : status))
      }
      image.onerror = () => {
        if (cancelled) return
        setImageStatuses((current) => current.map((status, itemIndex) => itemIndex === index ? 'error' : status))
      }
    })

    return () => {
      cancelled = true
      imageRefs.current = []
    }
  }, [draw, imageStatusByQuestionCode, images, results])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="vision-result__canvas-wrap">
      <canvas ref={canvasRef} className="vision-result__image vision-result__canvas" width={canvasWidth} height={canvasHeight} aria-label="Vision Board 2027" />
      {imageSlotsVisible && (
        <div className="vision-result__image-loading-grid" aria-live="polite">
          {results.map((_, index) => (
            <div key={`loading-${index}`} className="vision-result__image-loading" data-status={imageStatuses[index]} aria-label={imageStatuses[index] === 'loading' ? `Đang tải ảnh ${index + 1}` : undefined}>
              {imageStatuses[index] === 'loading' && (
                <LoadingSuccessOverlay
                  status="loading"
                  label={`Đang tải ảnh ${index + 1}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function downloadVisionBoard(canvas: HTMLCanvasElement | null) {
  if (!canvas) return
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sanyo-vision-board-2027.png'
    link.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
