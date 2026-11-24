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
  adminPlayers: {
    list: '/admin/players',
    stats: '/admin/players/stats',
  },
  imagePool: {
    stats: '/admin/image-pool/stats',
    fillStart: '/admin/image-pool/fill/start',
    fillStop: '/admin/image-pool/fill/stop',
    fillStatus: '/admin/image-pool/fill/status',
    fillSummary: '/admin/image-pool/fill/summary',
  },
  journey: {
    questions: '/journey/questions',
  },
  players: {
    manifest: '/players/manifest',
    detail: (id: string) => `/players/${id}`,
    generateImage: (id: string) => `/players/${id}/images/generate`,
  },
  questions: {
    list: '/admin/questions',
    detail: (id: string) => `/admin/questions/${id}`,
    update: (id: string) => `/admin/questions/${id}`,
    answers: (questionId: string) => `/admin/questions/${questionId}/answers`,
    answer: (questionId: string, answerId: string) =>
      `/admin/questions/${questionId}/answers/${answerId}`,
    presignImage: (questionId: string, answerId: string) =>
      `/admin/questions/${questionId}/answers/${answerId}/image/presign`,
  },
} as const
