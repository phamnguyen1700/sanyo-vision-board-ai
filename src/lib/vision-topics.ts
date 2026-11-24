export type TopicAnswer =
  | string
  | string[]
  | {
      destination: string
      companion: string
      highlight: string
      taste?: string
      memorable?: string
    }

export type ManifestPhase = 'idle' | 'loading' | 'ready' | 'transitioning' | 'result' | 'error'

export const DEMO_IMAGE = '/vision-board-home-demo.jpg'

export const topics = [
  {
    id: 'vibe',
    eyebrow: '01 · VIBE 2027',
    desc: 'Chọn một vibe phù hợp nhất với bạn.',
    layout: 'topic--vibe',
  },
  {
    id: 'career',
    eyebrow: '02 · CÔNG VIỆC & HỌC TẬP',
    desc: 'Chọn một thành tựu bạn muốn đạt được trong năm 2027.',
    layout: 'topic--career',
  },
  {
    id: 'relationships',
    eyebrow: '03 · MỐI QUAN HỆ',
    desc: 'Chọn một điều bạn muốn có thêm trong năm 2027.',
    layout: 'topic--relationships',
  },
  {
    id: 'travel',
    eyebrow: '04 · DU LỊCH & TRẢI NGHIỆM',
    desc: 'Chọn một nơi bạn muốn đặt chân đến trong năm 2027.',
    layout: 'topic--travel',
  },
  {
    id: 'learning',
    eyebrow: '05 · KỸ NĂNG & PHÁT TRIỂN',
    desc: 'Chọn một kỹ năng bạn muốn mở khóa trong năm 2027.',
    layout: 'topic--learning',
  },
] as const

export const slotMeta = [
  { id: 'vibe', label: 'VIBE GOAL', className: 'board__slot--vibe' },
  { id: 'career', label: 'CAREER & GROWTH', className: 'board__slot--career' },
  { id: 'relationships', label: 'RELATIONSHIP & SOCIAL', className: 'board__slot--relationships' },
  { id: 'travel', label: 'TRAVEL & EXPERIENCE', className: 'board__slot--travel' },
  { id: 'learning', label: 'LEARNING & SKILLS', className: 'board__slot--learning' },
]

export function answerPreview(answer: TopicAnswer | undefined) {
  if (!answer) return 'Manifest điều bạn mong muốn'
  if (typeof answer === 'string') return answer
  if (Array.isArray(answer)) return answer.slice(0, 5).join(' · ')
  return [answer.destination, answer.companion, answer.highlight].filter(Boolean).join(' · ')
}

export function highlightedVibe(answer: TopicAnswer | undefined) {
  if (typeof answer === 'string') return answer
  if (Array.isArray(answer)) return answer[0] || ''
  return ''
}
