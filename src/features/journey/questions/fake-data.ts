import type { JourneyQuestion, JourneyQuestionsResponse } from '@/types/journey-question.types'
import { topics } from '@/lib/vision-topics'

const topicOrder = ['vibe', 'relationships', 'learning', 'travel', 'career'] as const

const topicQuestionTypes: Record<(typeof topicOrder)[number], JourneyQuestion['type']> = {
  vibe: 'frame_selection',
  relationships: 'single_choice',
  learning: 'single_choice',
  travel: 'single_choice',
  career: 'single_choice',
}

const topicCustomAnswer: Record<(typeof topicOrder)[number], boolean> = {
  vibe: false,
  relationships: true,
  learning: true,
  travel: true,
  career: true,
}

export const fallbackJourneyQuestions: JourneyQuestionsResponse = {
  items: topicOrder.map((topicId, index) => {
    const topic = topics.find((item) => item.id === topicId)!
    return {
      code: `Q${index + 1}`,
      content: topic.title,
      type: topicQuestionTypes[topicId],
      sortOrder: index + 1,
      allowCustomAnswer: topicCustomAnswer[topicId],
      answers: topic.options.map((content, answerIndex) => ({
        code: `Q${index + 1}_A${answerIndex + 1}`,
        content,
        value: content,
        imageUrl: topicId === 'vibe' ? '/vibe-image.png' : null,
        sortOrder: answerIndex + 1,
      })),
    }
  }),
}
