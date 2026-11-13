import { Box, Text } from 'chakbox-ui'

import type { LabDataDef } from '../../features/catalog'
import type { SPPayload } from 'subscribe-proxy'
import { LabSeriesSparkline } from './LabSeriesSparkline'
import { asTrendPoints, formatPointValue, formatUpdatedAt } from '../shared/format'

function LabSeriesView({ def, payload }: LabSeriesViewProps) {
  const points = asTrendPoints(payload?.data) ?? []
  const last = points[points.length - 1]
  const valueText = last ? formatPointValue(last.y, def.decimals) : '—'

  return (
    <Box>
      <Box>
        <Text fontSize={22} fontWeight={600}>
          {valueText}
        </Text>
        <Text fontSize={12} color="#999">
          {' '}
          {def.unit}
        </Text>
      </Box>
      <Box marginTop={8}>
        <LabSeriesSparkline points={points} />
      </Box>
      <Box marginTop={6}>
        <Text fontSize={12} color="#999">
          {formatUpdatedAt(payload?.updatedAt ?? 0)}
        </Text>
      </Box>
    </Box>
  )
}

export { LabSeriesView }

type LabSeriesViewProps = {
  def: LabDataDef
  payload: SPPayload | undefined
}
