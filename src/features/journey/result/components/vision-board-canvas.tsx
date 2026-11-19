'use client'

import { useCallback, useEffect, useRef } from 'react'

import { answerPreview } from '@/lib/vision-topics'
import type { JourneyResult } from '../../hooks/use-journey-results'

type VisionBoardCanvasProps = {
  results: readonly JourneyResult[]
  gender: string
}

const canvasWidth = 1600
const canvasHeight = 1000
const fallbackImageSource = '/vision-board-final-demo.png'

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

function getPoolImageSource(topicId: JourneyResult['topicId'], gender: string) {
  if (topicId === 'vibe') return '/vibe-image.png'

  const normalizedGender = gender.trim().toLowerCase()
  const genderKey = normalizedGender === 'nữ' || normalizedGender === 'female' ? 'female' : normalizedGender === 'nam' || normalizedGender === 'male' ? 'male' : null

  if (!genderKey) return fallbackImageSource

  const imageNumberByTopic: Record<Exclude<JourneyResult['topicId'], 'vibe'>, string> = {
    relationships: 'q2',
    learning: 'q3',
    travel: 'q4',
    career: 'q5',
  }

  return `/image-pool-demo-v2/result-${genderKey}-${imageNumberByTopic[topicId]}.png`
}

export function VisionBoardCanvas({ results, gender }: VisionBoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRefs = useRef<HTMLImageElement[]>([])

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

    context.fillStyle = '#7a5b00'
    context.font = `600 18px ${fontFamily}`
    context.fillText('DEMO · Ảnh từ model để kiểm tra chất lượng', 72, 52)

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
    const imageSources = results.map((result) => getPoolImageSource(result.topicId, gender))
    const images = imageSources.map((source) => {
      const image = new Image()
      image.src = source
      return image
    })

    Promise.all(images.map((image) => new Promise<void>((resolve) => {
      image.onload = () => resolve()
      image.onerror = () => resolve()
    }))).then(() => {
      if (cancelled) return
      imageRefs.current = images
      draw()
    })

    return () => {
      cancelled = true
      imageRefs.current = []
    }
  }, [draw, gender])

  useEffect(() => {
    draw()
  }, [draw])

  return <canvas ref={canvasRef} className="vision-result__image vision-result__canvas" width={canvasWidth} height={canvasHeight} aria-label="Vision Board 2027" />
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
