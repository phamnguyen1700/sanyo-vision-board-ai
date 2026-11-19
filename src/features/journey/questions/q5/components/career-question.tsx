import { useState } from 'react'
import { Plus } from 'lucide-react'

import { isTopicAnswerValid } from '@/lib/journey-flow'
import { DirectionIcon } from '@/features/journey/shared'
import type { TopicSectionProps } from '@/features/journey/questions/types'
import { CareerChoiceInput } from './career-choice-input'

type CareerQuestionProps = TopicSectionProps & {
  options: readonly string[]
}

export function CareerQuestion({ topic, index, value, onChange, onContinue, onBack, direction, editing, options, question }: CareerQuestionProps) {
  const selected = typeof value === 'string' ? value : ''
  const [customOpen, setCustomOpen] = useState(() => selected.length > 0 && !options.includes(selected))
  const valid = isTopicAnswerValid(topic.id, value)

  return (
    <article data-topic-index={index} className={`topic topic--${topic.id} ${topic.layout} paper-reveal career-question`}>
      <div className="topic__number">0{index + 1}</div>
      <div className="topic__copy">
        <span className="kicker">{String(index + 1).padStart(2, '0')} · {topic.eyebrow.split(' · ')[1]}</span>
        <h3>{question?.content ?? topic.title}</h3>
        <p>{topic.desc}</p>
        <div className="learning-choice-sheet career-choice-sheet" role="group" aria-label="Thành tựu muốn đạt được">
          {options.map((option) => (
            <button type="button" key={option} className={`learning-choice ${selected === option ? 'is-selected' : ''}`} aria-pressed={selected === option} onClick={() => { setCustomOpen(false); onChange(option) }}>
              <span className="career-choice__dot" aria-hidden="true" />
              <span className="learning-choice__text">{option}</span>
            </button>
          ))}
          {customOpen ? (
            <label className="learning-choice learning-choice--custom is-selected">
              <span className="career-choice__dot" aria-hidden="true" />
              <CareerChoiceInput value={selected} onChange={onChange} />
            </label>
          ) : (
            <button type="button" className="learning-choice learning-choice--add" onClick={() => { setCustomOpen(true); onChange('') }}>
              <Plus size={18} aria-hidden="true" />
              <span>Viết thêm</span>
            </button>
          )}
        </div>
        {onBack ? (
          <button type="button" className="topic-continue" onClick={onBack}>
            Quay trở lại <DirectionIcon direction="up" size={16} />
          </button>
        ) : null}
        <button type="button" className="topic-continue" disabled={!valid} onClick={() => onContinue(value)}>
          {editing ? 'Lưu và xem lại' : 'Tiếp tục hành trình'} <DirectionIcon direction={direction} size={16} />
        </button>
      </div>
      <div className="topic__connector paper-line" />
    </article>
  )
}
