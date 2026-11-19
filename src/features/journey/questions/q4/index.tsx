import { TravelQuestion as TravelQuestionComponent } from './components/travel-question'
import type { TopicSectionProps } from '../types'

export function TravelQuestion(props: TopicSectionProps) {
  const options = props.question?.answers
    .filter((answer) => answer.value !== 'other_destination')
    .map((answer) => answer.content) ?? []

  return <TravelQuestionComponent {...props} options={options} />
}
