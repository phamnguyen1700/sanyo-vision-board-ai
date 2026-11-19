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
    desc: 'Chọn một thành tựu bạn muốn đạt được trong năm 2027.',
    options: [
      'Cầm 1 tấm bằng lót chuột xịn sò',
      'Việc lên chức, lương lên số',
      'Unlock skill mới, bung hết chất riêng!',
      'Cá chép vượt vũ môn, đậu vào ngôi trường mơ ước',
      'Làm hết mình, chơi hết nấc! Work life balance miễn chê!',
    ],
    layout: 'topic--career',
    kind: 'multi',
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
    desc: 'Chọn một nơi bạn muốn đặt chân đến trong năm 2027.',
    options: [
      'Ghé Nhật Bản phá đảo matcha',
      'Đi Hàn Quốc du idol Kpop',
      'Đến Thái Lan mukbang xôi xoài',
      'Vi vu Châu Âu hoá công nương, bá tước',
      'Phượt mọi miền Việt Nam tôi yêu',
    ],
    layout: 'topic--travel',
    kind: 'multi',
  },
  {
    id: 'learning',
    eyebrow: '05 · KỸ NĂNG & PHÁT TRIỂN',
    title: 'Nếu được mở khóa một phiên bản mới của mình trong 2027, bạn muốn mình làm được gì?',
    desc: 'Chọn một kỹ năng bạn muốn mở khóa trong năm 2027.',
    options: [
      'Bắn đủ thứ tiếng, học thêm ngoại ngữ',
      'Tập tành đầu tư, tích lũy tài sản',
      'Bắt mode sáng tạo, bắt trend triệu view',
      'Trổ tài bếp núc, tập tành làm bánh',
      'Chăm chút chính mình, tập yêu bản thân',
    ],
    layout: 'topic--learning',
    kind: 'multi',
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
