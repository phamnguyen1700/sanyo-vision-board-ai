'use client'

import { CmsField } from '@/components/common/cms-field'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import type { AdminQuestionAnswer } from '@/types/admin-question.types'

interface ChoiceAnswerCardProps {
  answer: AdminQuestionAnswer
  onChange: (answer: AdminQuestionAnswer) => void
  onDelete: (answer: AdminQuestionAnswer) => void | Promise<void>
}

export function ChoiceAnswerCard({ answer, onChange, onDelete }: ChoiceAnswerCardProps) {
  return (
    <article className="cms-choice-answer-card">
      <div className="cms-choice-answer-card__fields">
        <CmsField
          id={`choice-content-${answer.id}`}
          label="Câu trả lời"
          value={answer.content}
          showPlaceholder={false}
          onChange={(content) => onChange({ ...answer, content })}
        />
        <CmsField
          id={`choice-value-${answer.id}`}
          label="Giá trị"
          value={answer.value}
          showPlaceholder={false}
          onChange={(value) => onChange({ ...answer, value })}
        />
        <CmsField
          id={`choice-prompt-hint-${answer.id}`}
          label="Prompt hint"
          value={answer.promptHint ?? ''}
          showPlaceholder={false}
          onChange={(promptHint) => onChange({ ...answer, promptHint: promptHint || null })}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="cms-question-answer-delete"
        aria-label={`Xóa câu trả lời ${answer.content || answer.code}`}
        onClick={() => void onDelete(answer)}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </article>
  )
}
