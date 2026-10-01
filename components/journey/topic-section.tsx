'use client'

import { Check } from 'lucide-react'

import { TiltCard } from '@/components/motion/tilt-card'
import { DEMO_IMAGE, type TopicAnswer, topics } from '@/lib/vision-topics'
import { isTopicAnswerValid, type SceneTransition } from '@/lib/journey-flow'
import { DirectionIcon } from './direction-icon'

const submitTopicAnswer = async (topicId: string, answer: TopicAnswer) => ({ topicId, answer, queued: true })

type TopicSectionProps = {
  topic: (typeof topics)[number]
  index: number
  value: TopicAnswer
  onChange: (value: TopicAnswer) => void
  onContinue: () => void
  direction?: SceneTransition
  editing?: boolean
}

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

  const lineValue = (key: string) => (typeof value === 'object' && !Array.isArray(value) ? value[key as keyof typeof value] || '' : '')
  const setLine = (key: string, next: string) =>
    onChange({
      destination: lineValue('destination'),
      companion: lineValue('companion'),
      highlight: lineValue('highlight'),
      taste: lineValue('taste'),
      memorable: lineValue('memorable'),
      [key]: next,
    })

  return (
    <article
      data-topic-index={index}
      className={`topic ${topic.layout} paper-reveal`}
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
        {topic.kind === 'lines' && <LinesAnswer topic={topic} value={value} onChange={onChange} />}
        {topic.kind === 'ticket' && (
          <div className="travel-ticket">
            {[
              ['destination', 'Mình muốn đi đến…'],
              ['companion', 'Mình muốn đi cùng…'],
              ['highlight', 'Điều mình muốn làm hoặc nhìn thấy nhất là…'],
              ['taste', 'Món ăn/trải nghiệm muốn thử'],
              ['memorable', 'Điều khiến chuyến đi đáng nhớ'],
            ].map(([key, label], i) => (
              <label key={key}>
                <span>{label}</span>
                <input value={lineValue(key)} onChange={(event) => setLine(key, event.target.value)} required={i < 3} />
              </label>
            ))}
            <small className={valid ? 'ticket-stamp' : 'answer-hint'}>{valid ? 'ĐÃ ĐÓNG DẤU · READY TO GO' : '3 dòng bắt buộc'}</small>
          </div>
        )}
        {topic.kind === 'paragraph' && (
          <label className="journal-answer">
            <textarea aria-label={topic.title} value={typeof value === 'string' ? value : ''} maxLength={200} onChange={(event) => onChange(event.target.value)} placeholder={topic.placeholder} />
            <span>{typeof value === 'string' ? value.length : 0}/200</span>
          </label>
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

function LinesAnswer({ topic, value, onChange }: { topic: (typeof topics)[number]; value: TopicAnswer; onChange: (value: TopicAnswer) => void }) {
  const lines = Array.isArray(value) ? value : []
  const canAdd = lines.length >= 3 && lines.length < 4 && lines.slice(0, 3).every(Boolean)
  const visibleCount = Math.max(3, Math.min(4, lines.length))

  return (
    <div className="answer-lines">
      {Array.from({ length: visibleCount }, (_, index) => (
        <div className="answer-line" key={index}>
          <span>{index + 1}</span>
          <input
            aria-label={`Thành tựu ${index + 1}`}
            value={lines[index] || ''}
            onChange={(event) => {
              const next = [...lines]
              next[index] = event.target.value
              onChange(next)
            }}
            placeholder={'placeholder' in topic ? topic.placeholder : undefined}
          />
          <button
            type="button"
            aria-label="Xóa dòng"
            onClick={() => {
              if (index === 3) onChange(lines.slice(0, 3))
            }}
          >
            ×
          </button>
        </div>
      ))}
      {canAdd && (
        <button type="button" className="answer-lines__add" onClick={() => onChange([...lines, ''])}>
          + <span>Thêm dòng</span>
        </button>
      )}
      <small className="answer-hint">{lines.filter(Boolean).length}/4 · Điền đủ 3 dòng để thêm dòng mới</small>
    </div>
  )
}
