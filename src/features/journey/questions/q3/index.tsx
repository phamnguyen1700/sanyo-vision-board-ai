import { LearningQuestion as LearningQuestionComponent } from './components/learning-question'
import type { TopicSectionProps } from '../types'

export function LearningQuestion(props: TopicSectionProps) {
  return <LearningQuestionComponent {...props} options={props.question?.answers.map((answer) => answer.content) ?? []} />
}
