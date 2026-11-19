import type { SceneTransition } from '@/lib/journey-flow'
import type { TopicAnswer, topics } from '@/lib/vision-topics'
import type { JourneyQuestion } from '@/types/journey-question.types'

export type TopicSectionProps = {
  topic: (typeof topics)[number]
  index: number
  value: TopicAnswer
  onChange: (value: TopicAnswer) => void
  onContinue: (value?: TopicAnswer) => void
  onBack?: () => void
  direction?: SceneTransition
  editing?: boolean
  question?: JourneyQuestion
}
