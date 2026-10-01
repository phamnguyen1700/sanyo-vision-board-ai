'use client'

import { Copy, RotateCcw, Share2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Session } from '@/lib/vision-session'

type ResultBoardProps = {
  session: Session
  designSrc: string
  onReplay?: () => void
}

export function ResultBoard({ session, designSrc, onReplay }: ResultBoardProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href)
      setError('')
      setCopied(true)
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('Chưa thể sao chép liên kết. Bạn thử lại nhé.')
    }
  }

  const share = async () => {
    if (!navigator.share) {
      await copyLink()
      return
    }
    try {
      await navigator.share({
        title: 'SANYO Vision Board 2027',
        text: `Vision Board 2027 của ${session.identity.name}`,
        url: location.href,
      })
      setError('')
    } catch (reason) {
      if (reason instanceof Error && reason.name === 'AbortError') return
      setError('Chưa thể chia sẻ. Bạn thử lại nhé.')
    }
  }

  return (
    <section className="vision-result" aria-label={`Vision Board 2027 của ${session.identity.name}`}>
      <figure className="vision-result__design">
        <img className="vision-result__image" src={designSrc} alt="SANYO Vision Board 2027" />
      </figure>
      <div className="vision-result__actions">
        <button type="button" className="button button--primary" onClick={() => void share()}>
          <Share2 size={17} aria-hidden="true" /> Chia sẻ vision board
        </button>
        <button type="button" className="button button--ghost" onClick={() => void copyLink()}>
          <Copy size={17} aria-hidden="true" /> {copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
        </button>
        {onReplay && <button type="button" className="button button--ghost" onClick={onReplay}>
          <RotateCcw size={16} aria-hidden="true" /> Chơi lại
        </button>}
      </div>
      {error && <p className="vision-result__error" role="alert">{error}</p>}
    </section>
  )
}
