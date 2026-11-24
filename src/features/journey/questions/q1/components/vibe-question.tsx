import { TiltCard } from '@/components/motion/tilt-card'
import { CampaignTape } from '@/components/common/campaign'
import { ImageOff } from 'lucide-react'
import type { TopicSectionProps } from '@/features/journey/questions/types'

export type VibeCardData = {
  id: string
  value: string
  tag: string
  imageSrc: string
}

type VibeQuestionProps = TopicSectionProps & {
  cards: readonly VibeCardData[]
}

export function VibeQuestion({ topic, index, value, onChange, onContinue, cards, question }: VibeQuestionProps) {
  const selected = typeof value === 'string' ? value : ''

  return (
    <article className={`topic ${topic.layout} paper-reveal vibe-question`}>
      <div className="topic__number">{String(index + 1).padStart(2, '0')}</div>
      <div className="topic__copy">
        <span className="kicker">{topic.eyebrow}</span>
        <h3>{question?.content}</h3>
        <p>{topic.desc}</p>
        {cards.map((card, index) => (
          <TiltCard
            shape="square"
              size="vibe"
            key={card.id}
            className={`vibe-option-card vibe-option-card-wrap--${index + 1} ${selected === card.value ? 'is-selected' : ''}`}
          >
            <button
              type="button"
              className="vibe-option-card__button"
              aria-pressed={selected === card.value}
              onClick={() => {
                onChange(card.value)
                onContinue(card.value)
              }}
            >
              <span className="vibe-option-card__image-wrap">
                {card.imageSrc ? (
                  <img src={card.imageSrc} alt={card.tag} className="vibe-option-card__image" />
                ) : (
                  <span className="vibe-option-card__image-empty">
                    <ImageOff aria-hidden="true" />
                    Chưa có ảnh
                  </span>
                )}
                <span className="tape vibe-option-card__tape" aria-hidden="true" />
                <CampaignTape tone="vibe" className="vibe-option-card__tag">
                  {card.tag}
                </CampaignTape>
              </span>
            </button>
          </TiltCard>
        ))}
      </div>
    </article>
  )
}
