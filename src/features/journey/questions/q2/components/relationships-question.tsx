import { useState } from 'react'
import { Check, Plus } from 'lucide-react'

import { DirectionIcon } from '@/features/journey/shared'
import type { TopicSectionProps } from '@/features/journey/questions/types'

type RelationshipsQuestionProps = TopicSectionProps & {
  options: readonly string[]
}

export function RelationshipsQuestion({ topic, index, value, onChange, onContinue, onBack, direction, editing, options, question }: RelationshipsQuestionProps) {
  const selected = typeof value === 'string' ? value : ''
  const [customOpen, setCustomOpen] = useState(() => selected.length > 0 && !options.includes(selected))
  const allowCustomAnswer = question?.allowCustomAnswer ?? true

  return (
    <article className={`topic topic--${topic.id} ${topic.layout} paper-reveal relationships-question`}>
      <div className="topic__number">{String(index + 1).padStart(2, '0')}</div>
      <div className="topic__copy">
        <span className="kicker">{topic.eyebrow}</span>
        <h3>{question?.content}</h3>
        <p>{topic.desc}</p>
        <div className="relationships-choice-grid" role="group" aria-label="Khoảnh khắc muốn có thêm">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              aria-pressed={selected === option}
              className={`choice-chip ${selected === option ? 'is-selected' : ''}`}
              onClick={() => {
                setCustomOpen(false)
                onChange(option)
              }}
            >
              {option}
              {selected === option && <Check size={15} />}
            </button>
          ))}
          {allowCustomAnswer && customOpen ? (
            <label className="choice-chip relationships-choice-grid__custom is-selected">
              <Plus size={15} />
              <input
                autoFocus
                aria-label="Khoảnh khắc tự chọn"
                value={selected}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Tự chọn"
              />
            </label>
          ) : allowCustomAnswer ? (
            <button
              type="button"
              className="choice-chip relationships-choice-grid__add"
              onClick={() => {
                setCustomOpen(true)
                onChange('')
              }}
            >
              <Plus size={15} />
              Tự chọn
            </button>
          ) : null}
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
