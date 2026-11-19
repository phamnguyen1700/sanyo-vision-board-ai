'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import type { RefObject } from 'react'
import { answerPreview, type ManifestPhase, type TopicAnswer } from '@/lib/vision-topics'
import type { JourneyScene, TopicId } from '@/lib/journey-flow'
import { CampaignNoteCard } from '@/components/common/campaign'
import type { JourneyResult } from '../../hooks/use-journey-results'

type ReviewVisionProps = {
  centerRef?: RefObject<HTMLDivElement | null>
  results: readonly JourneyResult[]
  scenes: readonly JourneyScene[]
  manifestPhase: ManifestPhase
  canManifest: boolean
  onManifest: () => void
  onEdit: (id: TopicId) => void
}

export function ReviewVision({ centerRef, results, scenes, manifestPhase, canManifest, onManifest, onEdit }: ReviewVisionProps) {
  const answers = new Map(results.map((result) => [result.topicId, result.answer]))

  return (
    <section className="review-vision">
      <div className="review-vision__grid">
        <div ref={centerRef} className="review-vision__center">
          <span className="kicker">MẢNH GHÉP CUỐI CÙNG</span>
          <h2>Đủ mảnh ghép rồi.<br /><em>Năm 2027 của bạn.</em></h2>
          <p>Xem lại những điều bạn mong muốn trước khi manifest.</p>
          <div className="review-vision__cta">
            {manifestPhase === 'error' && <p role="alert">Chưa thể mở vision board. Bạn thử lại nhé.</p>}
            {!canManifest && <p role="status">Hoàn thành các mảnh ghép để manifest nhé.</p>}
            <button type="button" className="button button--primary" disabled={!canManifest || manifestPhase === 'loading' || manifestPhase === 'transitioning'} onClick={onManifest}>
              <Sparkles size={17} aria-hidden="true" />
              {manifestPhase === 'loading' ? 'Đang chuẩn bị...' : manifestPhase === 'transitioning' ? 'Đang mở vision board...' : 'Manifest vision board của tôi'}
            </button>
          </div>
        </div>
        {scenes.filter((scene) => scene.topicId).map((scene, index) => (
          <CampaignNoteCard key={scene.id} className={`review-vision__note review-vision__note--${index + 1}`}>
            <span>{String(index + 1).padStart(2, '0')} · {scene.label}</span>
            <strong>{answerPreview(answers.get(scene.topicId!))}</strong>
            <button type="button" aria-label={`Chỉnh sửa ${scene.label}`} onClick={() => onEdit(scene.topicId!)}>
              Chỉnh sửa <ArrowRight size={14} aria-hidden="true" />
            </button>
          </CampaignNoteCard>
        ))}
      </div>
    </section>
  )
}
