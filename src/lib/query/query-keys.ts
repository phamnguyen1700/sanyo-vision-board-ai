export const queryKeys = {
  all: ['sanyo'] as const,
  admin: {
    all: ['sanyo', 'admin'] as const,
    session: () => ['sanyo', 'admin', 'session'] as const,
    stats: () => ['sanyo', 'admin', 'stats'] as const,
    players: (params?: unknown) => params
      ? ['sanyo', 'admin', 'players', params] as const
      : ['sanyo', 'admin', 'players'] as const,
    staff: (params?: unknown) => params
      ? ['sanyo', 'admin', 'staff', params] as const
      : ['sanyo', 'admin', 'staff'] as const,
    questions: (params?: unknown) => params
      ? ['sanyo', 'admin', 'questions', params] as const
      : ['sanyo', 'admin', 'questions'] as const,
    imagePool: {
      stats: () => ['sanyo', 'admin', 'image-pool', 'stats'] as const,
      fillStatus: () => ['sanyo', 'admin', 'image-pool', 'fill-status'] as const,
      fillSummary: () => ['sanyo', 'admin', 'image-pool', 'fill-summary'] as const,
    },
  },
  journey: {
    questions: () => ['sanyo', 'journey', 'questions'] as const,
    player: (id: string) => ['sanyo', 'journey', 'player', id] as const,
  },
} as const
