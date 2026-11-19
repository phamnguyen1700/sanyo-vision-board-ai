'use client'

import { Check } from 'lucide-react'

import { TiltCard } from '@/components/motion/tilt-card'
import { DEMO_IMAGE, type TopicAnswer } from '@/lib/vision-topics'
import { isTopicAnswerValid, type SceneTransition } from '@/lib/journey-flow'
import { DirectionIcon } from '@/features/journey/shared'
import type { TopicSectionProps } from '@/features/journey/questions/types'

const submitTopicAnswer = async (topicId: string, answer: TopicAnswer) => ({ topicId, answer, queued: true })

export function TopicSection({ topic, index, value, onChange, onContinue, direction, editing }: TopicSectionProps) {
  const selected = Array.isArray(value) ? value : []

  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : selected.length < 5
        ? [...selected, option]
        : selected

    onChange(next)
  }

  const valid = isTopicAnswerValid(topic.id, value)

  return (
    <article
      data-topic-index={index}
      className={`topic topic--${topic.id} ${topic.layout} paper-reveal`}
    >
      <div className="topic__number">0{index + 1}</div>
      <div className="topic__copy">
        <span className="kicker">{String(index + 1).padStart(2, '0')} · {topic.eyebrow.split(' · ')[1]}</span>
        <h3>{topic.title}</h3>
        <p>{topic.desc}</p>
        {topic.kind === 'multi' && (
          <>
            <div className="choice-grid">
              {topic.options.map((option) => (
                <button type="button" key={option} aria-pressed={selected.includes(option)} className={`choice-chip ${selected.includes(option) ? 'is-selected' : ''}`} onClick={() => toggle(option)}>
                  {option}
                  {selected.includes(option) && <Check size={15} />}
                </button>
              ))}
            </div>
            <small className="answer-hint">
              {selected.length}/5 · Chọn ít nhất 3 ý · Ý nổi bật:{' '}
              {selected.length
                ? selected.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={selected[0] === option ? 'is-starred' : ''}
                      onClick={() => onChange(selected.includes(option) ? [option, ...selected.filter((item) => item !== option)] : selected)}
                    >
                      {option}
                    </button>
                  ))
                : 'Chọn ý trước'}
            </small>
          </>
        )}
          <button
            type="button"
            className="topic-continue"
            disabled={!valid}
            onClick={() => {
              void submitTopicAnswer(topic.id, value)
              onContinue()
            }}
          >
            {editing ? 'Lưu và xem lại' : 'Tiếp tục hành trình'} <DirectionIcon direction={direction} size={16} />
          </button>
      </div>
      <TiltCard className="topic__visual-wrap">
        <div className="topic__visual paper-photo">
          <img src={DEMO_IMAGE} alt={`${topic.eyebrow} inspiration`} />
          <span className="tape" />
          <span className="visual-caption">{{ vibe: 'GOOD VIBES ONLY', career: 'BIG DREAMS', relationships: 'STAY CLOSE', travel: 'GO SOMEWHERE', learning: 'UNLOCK MORE' }[topic.id]}</span>
        </div>
      </TiltCard>
      <div className="topic__connector paper-line" />
    </article>
  )
}
