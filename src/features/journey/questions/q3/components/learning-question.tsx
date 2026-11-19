import { useState } from 'react'
import { Plus } from 'lucide-react'

import { DirectionIcon } from '@/features/journey/shared'
import type { TopicSectionProps } from '@/features/journey/questions/types'
import { LearningChoiceInput } from './learning-choice-input'

type LearningQuestionProps = TopicSectionProps & {
  options: readonly string[]
}

export function LearningQuestion({ topic, value, onChange, onContinue, onBack, direction, editing, options, question }: LearningQuestionProps) {
  const selected = typeof value === 'string' ? value : ''
  const [customOpen, setCustomOpen] = useState(() => selected.length > 0 && !options.includes(selected))

  return (
    <article className={`topic topic--${topic.id} ${topic.layout} paper-reveal learning-question`}>
      <div className="topic__number">03</div>
      <div className="topic__copy">
        <span className="kicker">{topic.eyebrow}</span>
        <h3>{question?.content ?? topic.title}</h3>
        <p>{topic.desc}</p>
        <div className="learning-choice-sheet" role="group" aria-label="Kỹ năng muốn mở khóa">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={`learning-choice ${selected === option ? 'is-selected' : ''}`}
              aria-pressed={selected === option}
              onClick={() => {
                setCustomOpen(false)
                onChange(option)
              }}
            >
              <span className="learning-choice__mark" aria-hidden="true" />
              <span className="learning-choice__text">{option}</span>
            </button>
          ))}
          {customOpen ? (
            <label className="learning-choice learning-choice--custom is-selected">
              <span className="learning-choice__mark" aria-hidden="true" />
              <LearningChoiceInput value={selected} onChange={onChange} />
            </label>
          ) : (
            <button
              type="button"
              className="learning-choice learning-choice--add"
              onClick={() => {
                setCustomOpen(true)
                onChange('')
              }}
            >
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
        <button
          type="button"
          className="topic-continue"
          disabled={!selected.trim()}
          onClick={() => onContinue(selected)}
        >
          {editing ? 'Lưu và xem lại' : 'Tiếp tục hành trình'} <DirectionIcon direction={direction} size={16} />
        </button>
      </div>
    </article>
  )
}
