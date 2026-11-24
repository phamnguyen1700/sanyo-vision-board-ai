'use client'

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { PoolImageStatsResponse } from '@/types/admin-image-pool.types'

const chartConfig = {
  male: {
    label: 'Nam',
    color: 'var(--primary)',
  },
  female: {
    label: 'Nữ',
    color: 'var(--accent)',
  },
} satisfies ChartConfig

export function ImagePoolChart({ data }: { data: PoolImageStatsResponse }) {
  const chartData = ['Q2', 'Q3', 'Q4', 'Q5'].map((questionCode) => ({
    questionCode,
    male: data.byGenderQuestion.find((item) => item.gender === 'male' && item.questionCode === questionCode)?.count ?? 0,
    female: data.byGenderQuestion.find((item) => item.gender === 'female' && item.questionCode === questionCode)?.count ?? 0,
  }))

  return (
    <Card className="cms-image-pool-chart">
      <CardHeader>
        <CardTitle>Số ảnh theo giới tính và câu hỏi</CardTitle>
        <CardDescription>So sánh pool nam/nữ theo từng topic Q2–Q5.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="cms-image-pool-chart__container">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="questionCode" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="male" fill="var(--color-male)" radius={4} />
            <Bar dataKey="female" fill="var(--color-female)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
