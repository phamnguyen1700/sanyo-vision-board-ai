'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { identitySchema, type Identity } from '@/lib/vision-session'
import type { SceneTransition } from '@/lib/journey-flow'
import { DirectionIcon } from '@/features/journey/shared'
import { ConsentNoteCard, type ConsentValues } from './consent-note-card'

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
  const [consents, setConsents] = useState<ConsentValues>({ privacy: false, marketing: false, research: false })
  const [showConsentError, setShowConsentError] = useState(false)
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
    const subscription = watch((value) => onDraftChange({ name: value.name || '', gender: value.gender || '', phone: value.phone || '' }))
    return () => subscription.unsubscribe()
  }, [watch, onDraftChange])

  return (
    <div className="identity-form-shell">
      <form
        ref={formRef}
        className="identity-questions paper-reveal"
        onSubmit={handleSubmit((identity) => {
          if (!consents.privacy) {
            setShowConsentError(true)
            return
          }
          setShowConsentError(false)
          onSubmit(identity)
        })}
      >
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
            <span className="question-text">Số điện thoại của bạn là gì?</span>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Nhập số điện thoại"
              autoComplete="tel"
            />
            {errors.phone && <small className="error">{errors.phone.message}</small>}
          </label>
        </div>
        <button className="button button--primary question-submit" type="submit">
          Bắt đầu trả lời <DirectionIcon direction={direction} size={17} />
        </button>
      </form>
      <ConsentNoteCard
        value={consents}
        onChange={(next) => {
          setConsents(next)
          if (next.privacy) setShowConsentError(false)
        }}
        showRequiredError={showConsentError}
      />
    </div>
  )
})
