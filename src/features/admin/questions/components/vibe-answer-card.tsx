'use client'

import { CmsField } from '@/components/common/cms-field'
import { ImageUploadOverlay } from '@/components/common/image-upload-overlay'

import type { AdminQuestionAnswer } from '@/types/admin-question.types'

interface VibeAnswerCardProps {
  answer: AdminQuestionAnswer
  onChange: (answer: AdminQuestionAnswer) => void
}

export function VibeAnswerCard({ answer, onChange }: VibeAnswerCardProps) {
  return (
    <article className="cms-vibe-answer-card">
      <ImageUploadOverlay
        imageUrl={answer.imageUrl}
        alt={answer.content}
        onChange={(imageUrl) => onChange({ ...answer, imageUrl })}
      />
      <div className="cms-vibe-answer-card__fields">
        <CmsField
          id={`vibe-content-${answer.id}`}
          label="Tên vibe"
          value={answer.content}
          showPlaceholder={false}
          onChange={(content) => onChange({ ...answer, content })}
        />
        <CmsField
          id={`vibe-value-${answer.id}`}
          label="Giá trị"
          value={answer.value}
          showPlaceholder={false}
          onChange={(value) => onChange({ ...answer, value })}
        />
      </div>
    </article>
  )
}
