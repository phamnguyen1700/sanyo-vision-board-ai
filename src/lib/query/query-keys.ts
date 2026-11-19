export const queryKeys = {
  all: ['sanyo'] as const,
  admin: {
    all: ['sanyo', 'admin'] as const,
    session: () => ['sanyo', 'admin', 'session'] as const,
    stats: () => ['sanyo', 'admin', 'stats'] as const,
    staff: (params?: unknown) => params
      ? ['sanyo', 'admin', 'staff', params] as const
      : ['sanyo', 'admin', 'staff'] as const,
    questions: (params?: unknown) => params
      ? ['sanyo', 'admin', 'questions', params] as const
      : ['sanyo', 'admin', 'questions'] as const,
  },
  journey: {
    questions: () => ['sanyo', 'journey', 'questions'] as const,
  },
} as const
