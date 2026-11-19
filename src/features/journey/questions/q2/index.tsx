import { RelationshipsQuestion as RelationshipsQuestionComponent } from './components/relationships-question'
import type { TopicSectionProps } from '../types'

export function RelationshipsQuestion(props: TopicSectionProps) {
  return <RelationshipsQuestionComponent {...props} options={props.question?.answers.map((answer) => answer.content) ?? []} />
}
