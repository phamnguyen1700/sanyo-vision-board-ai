import type { TopicAnswer } from './vision-topics'
import type { JourneyScreenId, TopicId } from './journey-flow'
import { z } from 'zod'

export const identitySchema = z.object({
  name: z.string().trim().min(2, 'Cho SANYO biết tên của bạn nhé'),
  gender: z.string().min(1, 'Chọn một lựa chọn nha'),
  age: z.string().min(1, 'Chọn độ tuổi của bạn'),
})

export type Identity = {
  name: string
  gender: string
  age: string
}

export type Session = {
  identity: Identity
  vibe: string
  answers: Record<string, TopicAnswer>
  boardId: string
  manifestPhase?: 'result'
  activeScreenId?: JourneyScreenId
  editingTopicId?: TopicId
}

const sessionKey = 'sanyo-vision-session'

const storedSessionSchema = z.object({
  identity: z.object({ name: z.string(), gender: z.string(), age: z.string() }),
  answers: z.record(z.string(), z.union([
    z.string(),
    z.array(z.string()),
    z.object({ destination: z.string(), companion: z.string(), highlight: z.string(), taste: z.string().optional(), memorable: z.string().optional() }),
  ])),
  vibe: z.string(),
  boardId: z.string(),
  manifestPhase: z.literal('result').optional(),
  activeScreenId: z.enum(['home', 'identity', 'vibe', 'relationships', 'learning', 'travel', 'career', 'review', 'result']).optional(),
  editingTopicId: z.enum(['vibe', 'relationships', 'learning', 'travel', 'career']).optional(),
})

export function readSession(): Session | null {
  if (typeof window === 'undefined') return null

  try {
    const parsed = storedSessionSchema.safeParse(JSON.parse(window.sessionStorage.getItem(sessionKey) || 'null'))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function saveSession(session: Session) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(sessionKey, JSON.stringify(session))
  } catch {
    // The in-memory journey remains usable when browser storage is unavailable.
  }
}

export function createEmptySession(identity: Identity, vibe = '', answers: Record<string, TopicAnswer> = {}): Session {
  return {
    identity,
    vibe,
    answers,
    boardId: crypto.randomUUID(),
  }
}
