'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { identitySchema, type Identity } from '@/lib/vision-session'
import type { SceneTransition } from '@/lib/journey-flow'
import { DirectionIcon } from './direction-icon'

export type IdentityFormHandle = {
  submit: () => void
}

type IdentityFormProps = {
  onSubmit: (identity: Identity) => void
  onDraftChange: (identity: Identity) => void
  defaultValues: Identity
  direction?: SceneTransition
}

export const IdentityForm = forwardRef<IdentityFormHandle, IdentityFormProps>(function IdentityForm({ onSubmit, onDraftChange, defaultValues, direction }, ref) {
  const formRef = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Identity>({
    resolver: zodResolver(identitySchema),
    defaultValues,
  })

  useImperativeHandle(ref, () => ({
    submit: () => formRef.current?.requestSubmit(),
  }))

  useEffect(() => {
    const subscription = watch((value) => onDraftChange({ name: value.name || '', gender: value.gender || '', age: value.age || '' }))
    return () => subscription.unsubscribe()
  }, [watch, onDraftChange])

  return (
    <form ref={formRef} className="identity-questions paper-reveal" onSubmit={handleSubmit(onSubmit)}>
      <div className="question-heading">
        <span className="kicker">01 · YOUR STARTING POINT</span>
        <h2>Trước khi bắt đầu, SANYO muốn hỏi bạn vài câu.</h2>
        <p>Chọn đáp án gần với bạn nhất. Không có đúng hay sai — chỉ có một vision board rất riêng.</p>
      </div>
      <div className="question-list">
        <label className="question-row">
          <span className="question-number">01</span>
          <span className="question-text">Tên bạn là gì?</span>
          <input {...register('name')} placeholder="Viết tên bạn ở đây" autoComplete="given-name" />
          {errors.name && <small className="error">{errors.name.message}</small>}
        </label>
        <label className="question-row">
          <span className="question-number">02</span>
          <span className="question-text">Bạn muốn SANYO xưng hô với bạn thế nào?</span>
          <select {...register('gender')}>
            <option value="">Chọn câu trả lời</option>
            <option>Nữ</option>
            <option>Nam</option>
            <option>Không muốn nói</option>
          </select>
          {errors.gender && <small className="error">{errors.gender.message}</small>}
        </label>
        <label className="question-row">
          <span className="question-number">03</span>
          <span className="question-text">Bạn đang ở chặng nào của hành trình?</span>
          <select {...register('age')}>
            <option value="">Chọn câu trả lời</option>
            <option>18 - 24</option>
            <option>25 - 34</option>
            <option>35+</option>
          </select>
          {errors.age && <small className="error">{errors.age.message}</small>}
        </label>
      </div>
      <button className="button button--primary question-submit" type="submit">
        Bắt đầu trả lời <DirectionIcon direction={direction} size={17} />
      </button>
    </form>
  )
})
