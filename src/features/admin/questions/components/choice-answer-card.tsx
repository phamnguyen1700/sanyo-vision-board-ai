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
      <CmsField
        id={`choice-content-${answer.id}`}
        label="Câu trả lời"
        value={answer.content}
        showLabel={false}
        showPlaceholder={false}
        onChange={(content) => onChange({ ...answer, content })}
      />
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
