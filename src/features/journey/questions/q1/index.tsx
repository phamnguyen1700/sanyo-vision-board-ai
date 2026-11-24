import { VibeQuestion as VibeQuestionComponent, type VibeCardData } from './components/vibe-question'
import type { TopicSectionProps } from '../types'

export type { VibeCardData }

export function VibeQuestion(props: TopicSectionProps) {
  const cards: readonly VibeCardData[] = (props.question?.answers ?? []).map((answer) => ({
    id: answer.code,
    value: answer.value,
    tag: answer.content,
    imageSrc: answer.imageUrl ?? '',
  }))

  return <VibeQuestionComponent {...props} cards={cards} />
}
