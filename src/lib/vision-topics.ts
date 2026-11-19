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

export const DEMO_IMAGE =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Demo%20vision%20board-HCvjCn4LR8rVjcOtitUWwTM1inVjhr.jpg'

export const topics = [
  {
    id: 'vibe',
    eyebrow: '01 · VIBE 2027',
    title: 'Năm 2027 của bạn sẽ có những chất riêng nào?',
    desc: 'Chọn một vibe phù hợp nhất với bạn.',
    options: ['Tự do sáng tạo', 'An tĩnh tinh tâm', 'Hướng ngoại năng động'],
    layout: 'topic--vibe',
    kind: 'multi',
  },
  {
    id: 'career',
    eyebrow: '02 · CÔNG VIỆC & HỌC TẬP',
    title: 'Năm nay nhất định phải đạt được thành tựu gì?',
    desc: 'Chọn một thành tựu bạn muốn đạt được trong năm 2027.',
    options: ['Thi đậu đại học', 'Được tăng lương', 'Học thêm 1 kỹ năng mới'],
    layout: 'topic--career',
    kind: 'single',
  },
  {
    id: 'relationships',
    eyebrow: '03 · MỐI QUAN HỆ',
    title: 'Năm nay có điều hay thêm hội thêm thuyền?',
    desc: 'Chọn một điều bạn muốn có thêm trong năm 2027.',
    options: ['Dành thời gian cho gia đình', 'Có người yêu', 'Có thêm bạn bè'],
    layout: 'topic--relationships',
    kind: 'single',
  },
  {
    id: 'travel',
    eyebrow: '04 · DU LỊCH & TRẢI NGHIỆM',
    title: '2027 chu du đâu để bạn ơi?',
    desc: 'Chọn một nơi bạn muốn đặt chân đến trong năm 2027.',
    options: ['Đi Nhật Bản', 'Đi Hàn Quốc', 'Đến Thái Lan', 'Vi vu Châu Âu'],
    layout: 'topic--travel',
    kind: 'single',
  },
  {
    id: 'learning',
    eyebrow: '05 · KỸ NĂNG & PHÁT TRIỂN',
    title: 'Năm nay unlock skill gì mới đây ta?',
    desc: 'Chọn một kỹ năng bạn muốn mở khóa trong năm 2027.',
    options: [
      'Bắn đủ thứ tiếng, học thêm ngoại ngữ',
      'Tập tành đầu tư, tích lũy tài sản',
      'Bật mode sáng tạo, bắt trend triệu view',
      'Trổ tài bếp núc, tập tành làm bánh',
      'Chăm chút chính mình, tập yêu bản thân',
    ],
    layout: 'topic--learning',
    kind: 'single',
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
