'use client'

import { Plus, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CmsField } from '@/components/common/cms-field'

import { VibeAnswerCard } from './vibe-answer-card'
import { ChoiceAnswerCard } from './choice-answer-card'
import type { AdminQuestion, AdminQuestionAnswer } from '@/types/admin-question.types'

interface QuestionEditorCardProps {
  question: AdminQuestion
  isDirty: boolean
  isSaving?: boolean
  onSave: () => void
  onQuestionContentChange: (content: string) => void
  onAnswerChange: (answer: AdminQuestionAnswer) => void
  onAnswerDelete: (answer: AdminQuestionAnswer) => void | Promise<void>
  onAddAnswer: () => void
  onImageUpload: (answer: AdminQuestionAnswer, file: File) => Promise<void>
  uploadingAnswerId?: string
}

export function QuestionEditorCard({
  question,
  isDirty,
  isSaving = false,
  onSave,
  onQuestionContentChange,
  onAnswerChange,
  onAnswerDelete,
  onAddAnswer,
  onImageUpload,
  uploadingAnswerId,
}: QuestionEditorCardProps) {
  return (
    <div className="cms-question-editor-card" data-question-type={question.type}>
      <header className="cms-question-editor-card__header">
        <div>
          <span className="cms-question-editor-card__eyebrow">{question.code}</span>
          <CmsField
            id="question-content"
            label="Câu hỏi"
            value={question.content}
            variant="line"
            showLabel={false}
            showPlaceholder={false}
            onChange={onQuestionContentChange}
          />
        </div>
        {isDirty ? (
          <Button type="button" size="sm" disabled={isSaving} onClick={onSave}>
            <Save />
            Cập nhật
          </Button>
        ) : null}
      </header>
      <div className="cms-question-editor-card__answers">
        {question.answers.map((answer) => (
          question.type === 'frame_selection' ? (
            <VibeAnswerCard
              key={answer.id}
              answer={answer}
              onChange={onAnswerChange}
              onImageUpload={(file) => onImageUpload(answer, file)}
              isUploading={uploadingAnswerId === answer.id}
            />
          ) : (
            <ChoiceAnswerCard
              key={answer.id}
              answer={answer}
              onChange={onAnswerChange}
              onDelete={onAnswerDelete}
            />
          )
        ))}
        {question.type === 'single_choice' ? (
          <Button
            type="button"
            variant="outline"
            className="cms-question-editor-card__add-answer"
            onClick={onAddAnswer}
          >
            <Plus aria-hidden="true" />
            Thêm câu trả lời
          </Button>
        ) : null}
      </div>
    </div>
  )
}
