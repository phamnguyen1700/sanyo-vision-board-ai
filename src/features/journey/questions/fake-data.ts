import type { JourneyQuestionsResponse } from '@/types/journey-question.types'

// Demo fallback kept in sync with GET /journey/questions.
export const fallbackJourneyQuestions: JourneyQuestionsResponse = {
  items: [
    {
      code: 'Q1', content: 'Bạn muốn năm 2027 mang vibe như thế nào?', type: 'frame_selection', sortOrder: 1, allowCustomAnswer: false,
      answers: [
        { code: 'Q1_A1', content: 'Tự do sáng tạo', value: 'creative', imageUrl: null, sortOrder: 1 },
        { code: 'Q1_A2', content: 'An tĩnh tinh tâm', value: 'peaceful', imageUrl: null, sortOrder: 2 },
        { code: 'Q1_A3', content: 'Hướng ngoại năng động', value: 'outgoing', imageUrl: null, sortOrder: 3 },
      ],
    },
    {
      code: 'Q2', content: 'Năm nay nhất định phải đạt được thành tựu gì?', type: 'single_choice', sortOrder: 2, allowCustomAnswer: true,
      answers: [
        { code: 'Q2_A1', content: 'Thi đậu đại học', value: 'achievement_degree', imageUrl: null, sortOrder: 1 },
        { code: 'Q2_A2', content: 'Được tăng lương', value: 'career_growth', imageUrl: null, sortOrder: 2 },
        { code: 'Q2_A3', content: 'Học thêm 1 kỹ năng mới', value: 'new_skill', imageUrl: null, sortOrder: 3 },
      ],
    },
    {
      code: 'Q3', content: 'Năm nay có điều hay thêm hội thêm thuyền?', type: 'single_choice', sortOrder: 3, allowCustomAnswer: true,
      answers: [
        { code: 'Q3_A1', content: 'Dành thời gian cho gia đình', value: 'family', imageUrl: null, sortOrder: 1 },
        { code: 'Q3_A2', content: 'Có người yêu', value: 'relationship', imageUrl: null, sortOrder: 2 },
        { code: 'Q3_A3', content: 'Có thêm bạn bè', value: 'friends', imageUrl: null, sortOrder: 3 },
      ],
    },
    {
      code: 'Q4', content: '2027 chu du đâu để bạn ơi?', type: 'single_choice', sortOrder: 4, allowCustomAnswer: true,
      answers: [
        { code: 'Q4_A1', content: 'Đi Nhật Bản', value: 'japan', imageUrl: null, sortOrder: 1 },
        { code: 'Q4_A2', content: 'Đi Hàn Quốc', value: 'korea', imageUrl: null, sortOrder: 2 },
        { code: 'Q4_A3', content: 'Đến Thái Lan', value: 'thailand', imageUrl: null, sortOrder: 3 },
        { code: 'Q4_A4', content: 'Vi vu Châu Âu', value: 'europe', imageUrl: null, sortOrder: 4 },
      ],
    },
    {
      code: 'Q5', content: 'Năm nay unlock skill gì mới đây ta?', type: 'single_choice', sortOrder: 5, allowCustomAnswer: true,
      answers: [
        { code: 'Q5_A1', content: 'Bắn đủ thứ tiếng, học thêm ngoại ngữ', value: 'language', imageUrl: null, sortOrder: 1 },
        { code: 'Q5_A2', content: 'Tập tành đầu tư, tích luỹ tài sản', value: 'investment', imageUrl: null, sortOrder: 2 },
        { code: 'Q5_A3', content: 'Bật mode sáng tạo, bắt trend triệu view', value: 'creative_trends', imageUrl: null, sortOrder: 3 },
        { code: 'Q5_A4', content: 'Trổ tài bếp núc, tập tành làm bánh', value: 'cooking', imageUrl: null, sortOrder: 4 },
        { code: 'Q5_A5', content: 'Chăm chút chính mình, tập yêu bản thân', value: 'self_care', imageUrl: null, sortOrder: 5 },
        { code: 'Q5_A6', content: 'Muốn cái gì khác nữa thì ghi ra đây:', value: 'other_skill', imageUrl: null, sortOrder: 6 },
      ],
    },
  ],
}
