import { CareerQuestion as CareerQuestionComponent } from './components/career-question'
import type { TopicSectionProps } from '../types'

export function CareerQuestion(props: TopicSectionProps) {
  return <CareerQuestionComponent {...props} options={props.question?.answers.map((answer) => answer.content) ?? []} />
}
