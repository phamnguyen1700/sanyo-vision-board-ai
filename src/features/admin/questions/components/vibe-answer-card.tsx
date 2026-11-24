'use client'

import { CmsField } from '@/components/common/cms-field'
import { ImageUploadOverlay } from '@/components/common/image-upload-overlay'

import type { AdminQuestionAnswer } from '@/types/admin-question.types'

interface VibeAnswerCardProps {
  answer: AdminQuestionAnswer
  onChange: (answer: AdminQuestionAnswer) => void
  onImageUpload: (file: File) => Promise<void>
  isUploading?: boolean
}

export function VibeAnswerCard({ answer, onChange, onImageUpload, isUploading = false }: VibeAnswerCardProps) {
  return (
    <article className="cms-vibe-answer-card">
      <ImageUploadOverlay
        imageUrl={answer.imageUrl}
        alt={answer.content}
        allowRemove={false}
        isUploading={isUploading}
        onFileSelected={onImageUpload}
        onChange={(imageUrl) => onChange({ ...answer, imageUrl, imageKey: null })}
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
        <CmsField
          id={`vibe-prompt-hint-${answer.id}`}
          label="Prompt hint"
          value={answer.promptHint ?? ''}
          showPlaceholder={false}
          onChange={(promptHint) => onChange({ ...answer, promptHint: promptHint || null })}
        />
      </div>
    </article>
  )
}
