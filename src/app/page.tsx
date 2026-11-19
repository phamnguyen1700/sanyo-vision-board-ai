'use client'

import { Journey } from '@/features/journey'
import { Shell } from '@/components/layout/shell'

export default function Page() {
  return (
    <Shell immersive>
      <Journey />
    </Shell>
  )
}
