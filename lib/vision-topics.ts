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
    desc: 'Chọn 3–5 ý. Sau đó đánh dấu một ý nổi bật nhất để làm mood chính.',
    options: ['Tự do', 'Sáng tạo', 'Bình yên', 'Chậm lại', 'Tập trung', 'Kết nối', 'Năng động', 'Khám phá', 'Hết mình'],
    layout: 'topic--vibe',
    kind: 'multi',
  },
  {
    id: 'career',
    eyebrow: '02 · CÔNG VIỆC & HỌC TẬP',
    title: 'Cuối năm 2027, bạn muốn nhìn lại và tự hào vì điều gì?',
    desc: 'Ít nhất 3 dòng thành tựu ngắn, tối đa 5 dòng.',
    placeholder: 'Ví dụ: Đạt IELTS 8.0',
    layout: 'topic--career',
    kind: 'lines',
  },
  {
    id: 'relationships',
    eyebrow: '03 · MỐI QUAN HỆ',
    title: 'Bạn muốn năm 2027 có thêm những khoảnh khắc nào bên người quan trọng?',
    desc: 'Chọn 3–5 khoảnh khắc, rồi đánh dấu một khoảnh khắc muốn thấy nhất trong ảnh.',
    options: [
      'Ăn tối cùng gia đình',
      'Đi chơi với bạn bè',
      'Gặp người hợp vibe',
      'Có thời gian cho người yêu',
      'Kết nối với người mới',
      'Lắng nghe nhau nhiều hơn',
      'Dành thời gian cho bản thân',
    ],
    layout: 'topic--relationships',
    kind: 'multi',
  },
  {
    id: 'travel',
    eyebrow: '04 · DU LỊCH & TRẢI NGHIỆM',
    title: 'Viết tấm vé cho chuyến đi bạn muốn thực hiện nhất năm 2027.',
    desc: 'Điền 3 dòng bắt buộc, thêm 2 dòng nếu muốn.',
    layout: 'topic--travel',
    kind: 'ticket',
  },
  {
    id: 'learning',
    eyebrow: '05 · KỸ NĂNG & PHÁT TRIỂN',
    title: 'Nếu được mở khóa một phiên bản mới của mình trong 2027, bạn muốn mình làm được gì?',
    desc: 'Viết một mục tiêu cụ thể, tối đa 200 ký tự.',
    placeholder: 'Mình muốn giao tiếp tiếng Nhật đủ tự tin để tự đi du lịch và kết bạn.',
    layout: 'topic--learning',
    kind: 'paragraph',
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
