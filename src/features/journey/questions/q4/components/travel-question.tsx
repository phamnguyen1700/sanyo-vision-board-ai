import { useState } from 'react'
import { Plus } from 'lucide-react'

import { DirectionIcon } from '@/features/journey/shared'
import type { TopicSectionProps } from '@/features/journey/questions/types'
import { TravelChoiceCircle } from './travel-choice-circle'

type TravelQuestionProps = TopicSectionProps & {
  options: readonly string[]
}

export function TravelQuestion({ topic, value, onChange, onContinue, onBack, direction, editing, options, question }: TravelQuestionProps) {
  const selected = typeof value === 'string' ? value : ''
  const [customOpen, setCustomOpen] = useState(() => selected.length > 0 && !options.includes(selected))

  return (
    <article className={`topic topic--${topic.id} ${topic.layout} paper-reveal travel-question`}>
      <div className="topic__number">04</div>
      <div className="topic__copy">
        <span className="kicker">04 · DU LỊCH & TRẢI NGHIỆM</span>
        <h3>{question?.content ?? topic.title}</h3>
        <p>Chọn một nơi bạn muốn đặt chân đến trong năm 2027.</p>
        <div className="travel-choice-ticket" role="group" aria-label="Điểm đến muốn khám phá">
          {options.map((option, index) => (
            <button
              type="button"
              key={option}
              className={`travel-choice ${selected === option ? 'is-selected' : ''}`}
              aria-pressed={selected === option}
              onClick={() => {
                setCustomOpen(false)
                onChange(option)
              }}
            >
              <span className="travel-choice__code">0{index + 1}</span>
              {selected === option ? <TravelChoiceCircle>{option}</TravelChoiceCircle> : <span className="travel-choice__text">{option}</span>}
            </button>
          ))}
          {customOpen ? (
            <label className="travel-choice travel-choice--custom is-selected">
              <span className="travel-choice__code">06</span>
              <TravelChoiceCircle className="travel-choice__custom-input" debounceValue={selected}>
                <input
                  autoFocus
                  aria-label="Điểm đến tự chọn"
                  value={selected}
                  size={Math.max(14, selected.length || 14)}
                  onChange={(event) => onChange(event.target.value)}
                  placeholder="Viết điểm đến khác"
                />
              </TravelChoiceCircle>
            </label>
          ) : (
            <button
              type="button"
              className="travel-choice travel-choice--add"
              onClick={() => {
                setCustomOpen(true)
                onChange('')
              }}
            >
              <span className="travel-choice__code">06</span>
              <span>Viết điểm đến khác</span>
              <Plus size={17} aria-hidden="true" />
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
