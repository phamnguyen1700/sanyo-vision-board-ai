export const endpoints = {
  health: {
    live: '/health/live',
    ready: '/health/ready',
  },
  adminAuth: {
    login: '/admin/auth/login',
    logout: '/admin/auth/logout',
    me: '/admin/auth/me',
  },
  staff: {
    list: '/admin/staff',
    create: '/admin/staff',
    detail: (id: string) => `/admin/staff/${id}`,
    update: (id: string) => `/admin/staff/${id}`,
    delete: (id: string) => `/admin/staff/${id}`,
  },
  adminStats: '/admin/stats',
  journey: {
    questions: '/journey/questions',
  },
  questions: {
    list: '/admin/questions',
    detail: (id: string) => `/admin/questions/${id}`,
    update: (id: string) => `/admin/questions/${id}`,
    answers: (questionId: string) => `/admin/questions/${questionId}/answers`,
    answer: (questionId: string, answerId: string) =>
      `/admin/questions/${questionId}/answers/${answerId}`,
  },
} as const
