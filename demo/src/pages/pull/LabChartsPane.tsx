import React from 'react'
import { Box } from 'chakbox-ui'

import { PULL_LAB_DEFS } from '../../features/catalog'
import { MemoLabChartPanel } from './LabChartPanel'
import { LabPaneHint } from '../shared/LabPaneHint'

function LabChartsPane({ hint }: LabChartsPaneProps) {
  const renderHint = () => <LabPaneHint hint={hint} />

  const renderCharts = () => (
    <Box marginTop={16} display="flex" flexDirection="column" gap={12}>
      {PULL_LAB_DEFS.map((def) => (
        <MemoLabChartPanel key={def.topic} def={def} />
      ))}
    </Box>
  )

  return (
    <Box padding={16}>
      {renderHint()}
      {renderCharts()}
    </Box>
  )
}

const MemoLabChartsPane = React.memo(LabChartsPane)

export { LabChartsPane, MemoLabChartsPane }

type LabChartsPaneProps = {
  hint: string
}
