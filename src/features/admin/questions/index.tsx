'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  useAdminQuestions,
  useCreateAdminQuestionAnswer,
  useDeleteAdminQuestionAnswer,
  useUpdateAdminQuestion,
  useUpdateAdminQuestionAnswer,
  useUploadAdminQuestionAnswerImage,
} from '@/hooks/admin'
import type { AdminQuestion, AdminQuestionAnswer } from '@/types/admin-question.types'

import { QuestionEditorCard } from './components/question-editor-card'

function flattenQuestions(data: ReturnType<typeof useAdminQuestions>['data']) {
  return data?.pages.flatMap((page) => page.items) ?? []
}

function createDraftAnswer(question: AdminQuestion): AdminQuestionAnswer {
  const sortOrder = question.answers.length + 1
  return {
    id: `draft-${question.id}-${sortOrder}`,
    questionId: question.id,
    code: `${question.code}_A${sortOrder}`,
    content: '',
    value: '',
    promptHint: null,
    imageUrl: null,
    imageKey: null,
    sortOrder,
  }
}

export function AdminQuestionsFeature() {
  const questionsQuery = useAdminQuestions({ pageSize: 5 })
  const updateQuestion = useUpdateAdminQuestion()
  const createAnswer = useCreateAdminQuestionAnswer()
  const deleteAnswer = useDeleteAdminQuestionAnswer()
  const updateAnswer = useUpdateAdminQuestionAnswer()
  const uploadImage = useUploadAdminQuestionAnswerImage()
  const apiQuestions = useMemo(
    () => flattenQuestions(questionsQuery.data),
    [questionsQuery.data],
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [questions, setQuestions] = useState<AdminQuestion[]>([])
  const [savedQuestions, setSavedQuestions] = useState<AdminQuestion[]>([])

  useEffect(() => {
    if (apiQuestions.length === 0) return
    setQuestions(apiQuestions)
    setSavedQuestions(apiQuestions)
    setCurrentIndex((index) => Math.min(index, apiQuestions.length - 1))
  }, [apiQuestions])

  const currentQuestion = questions[currentIndex]
  const savedQuestion = savedQuestions[currentIndex]
  const isDirty = useMemo(
    () => Boolean(currentQuestion && savedQuestion && JSON.stringify(currentQuestion) !== JSON.stringify(savedQuestion)),
    [currentQuestion, savedQuestion],
  )

  const updateCurrentQuestion = (update: (question: AdminQuestion) => AdminQuestion) => {
    setQuestions((current) => current.map((question, index) => (
      index === currentIndex ? update(question) : question
    )))
  }

  const handleAnswerChange = (answer: AdminQuestionAnswer) => {
    updateCurrentQuestion((question) => ({
      ...question,
      answers: question.answers.map((item) => item.id === answer.id ? answer : item),
    }))
  }

  const handleAddAnswer = () => {
    updateCurrentQuestion((question) => ({
      ...question,
      answers: [...question.answers, createDraftAnswer(question)],
    }))
  }

  const handleAnswerDelete = async (answer: AdminQuestionAnswer) => {
    if (!currentQuestion) return

    if (answer.id.startsWith('draft-')) {
      updateCurrentQuestion((question) => ({
        ...question,
        answers: question.answers.filter((item) => item.id !== answer.id),
      }))
      return
    }

    try {
      await deleteAnswer.mutateAsync({
        questionId: currentQuestion.id,
        answerId: answer.id,
      })
    } catch {
      // The mutation hook already reports the API error through the shared toast.
    }
  }

  const handleImageUpload = async (answer: AdminQuestionAnswer, file: File) => {
    if (!currentQuestion) return
    const uploaded = await uploadImage.mutateAsync({
      questionId: currentQuestion.id,
      answerId: answer.id,
      file,
    })
    handleAnswerChange({
      ...answer,
      imageUrl: uploaded.publicUrl,
      imageKey: uploaded.objectKey,
    })
  }

  const handleSave = async () => {
    if (!currentQuestion || !savedQuestion) return

    try {
      const questionChanged = currentQuestion.content !== savedQuestion.content
        || currentQuestion.allowCustomAnswer !== savedQuestion.allowCustomAnswer

      if (questionChanged) {
        await updateQuestion.mutateAsync({
          questionId: currentQuestion.id,
          body: {
            content: currentQuestion.content,
            allowCustomAnswer: currentQuestion.allowCustomAnswer,
          },
        })
      }

      for (const answer of currentQuestion.answers) {
        const previous = savedQuestion.answers.find((item) => item.id === answer.id)
        if (!previous) {
          await createAnswer.mutateAsync({
            questionId: currentQuestion.id,
            body: {
              code: answer.code,
              content: answer.content,
              value: answer.value || answer.content,
              promptHint: answer.promptHint,
              imageUrl: answer.imageUrl,
              sortOrder: answer.sortOrder,
            },
          })
          continue
        }

        const answerChanged = answer.content !== previous.content
          || answer.value !== previous.value
          || answer.promptHint !== previous.promptHint
          || answer.imageUrl !== previous.imageUrl
          || answer.imageKey !== previous.imageKey
          || answer.sortOrder !== previous.sortOrder

        if (answerChanged) {
          await updateAnswer.mutateAsync({
            questionId: currentQuestion.id,
            answerId: answer.id,
            body: {
              content: answer.content,
              value: answer.value,
              promptHint: answer.promptHint,
              imageUrl: answer.imageUrl,
              imageKey: answer.imageKey,
              sortOrder: answer.sortOrder,
            },
          })
        }
      }

      setSavedQuestions((current) => current.map((question, index) => (
        index === currentIndex ? structuredClone(currentQuestion) : question
      )))
    } catch {
      // Mutation hooks already show the normalized validation/server error toast.
    }
  }

  const isSaving = updateQuestion.isPending
    || createAnswer.isPending
    || updateAnswer.isPending
    || deleteAnswer.isPending
    || uploadImage.isPending

  if (questionsQuery.isPending) {
    return <section className="cms-questions-page cms-admin-auth-state cms-glass"><p>Đang tải câu hỏi...</p></section>
  }

  if (questionsQuery.isError) {
    return <section className="cms-questions-page cms-admin-auth-state cms-glass"><p>Không thể tải bộ câu hỏi.</p></section>
  }

  if (!currentQuestion) {
    return <section className="cms-questions-page cms-admin-auth-state cms-glass"><p>Chưa có dữ liệu câu hỏi.</p></section>
  }

  return (
    <section className="cms-questions-page">
      <section className="cms-question-shell cms-glass">
        <div key={currentQuestion.id} className="cms-panel-motion">
          <QuestionEditorCard
            question={currentQuestion}
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={handleSave}
            onQuestionContentChange={(content) => updateCurrentQuestion((question) => ({ ...question, content }))}
            onAnswerChange={handleAnswerChange}
            onAnswerDelete={handleAnswerDelete}
            onAddAnswer={handleAddAnswer}
            onImageUpload={handleImageUpload}
            uploadingAnswerId={uploadImage.variables?.answerId}
          />
        </div>
        <nav className="cms-question-navigation" aria-label="Điều hướng câu hỏi">
          <Button
            type="button"
            variant="ghost"
            className="cms-question-navigation__link"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          >
            <ChevronLeft aria-hidden="true" />
            Câu trước
          </Button>
          <span>Câu {currentIndex + 1}</span>
          <Button
            type="button"
            variant="ghost"
            className="cms-question-navigation__link"
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
          >
            Câu sau
            <ChevronRight aria-hidden="true" />
          </Button>
        </nav>
      </section>
    </section>
  )
}
