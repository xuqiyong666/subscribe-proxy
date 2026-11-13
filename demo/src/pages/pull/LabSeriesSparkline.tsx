import { Box, Text } from 'chakbox-ui'

import type { TrendPoint } from '../shared/format'

function LabSeriesSparkline({ points }: LabSeriesSparklineProps) {
  if (points.length < 2) {
    return (
      <Box height={36}>
        <Text fontSize={12} color="#ccc">
          等待首次拉取
        </Text>
      </Box>
    )
  }

  const ys = points.map((point) => point.y)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const spanY = maxY - minY || 1
  const width = 240
  const height = 36
  const polyline = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width
      const y = height - ((point.y - minY) / spanY) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline fill="none" stroke="#1677ff" strokeWidth="2" points={polyline} />
    </svg>
  )
}

export { LabSeriesSparkline }

type LabSeriesSparklineProps = {
  points: readonly TrendPoint[]
}
