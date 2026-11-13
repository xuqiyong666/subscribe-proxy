import React, { useMemo } from 'react'
import { Box, Flex } from 'chakbox-ui'

import { findLabDataDef } from '../../features/catalog'
import type { LabDataDef } from '../../features/catalog'
import type { PointsTab } from '../constants'
import { LabPaneHint } from '../shared/LabPaneHint'
import { MemoLabPointCard } from './LabPointCard'

export function LabTabPane({ tab }: LabTabPaneProps) {
  const topicDefs = useMemo(
    () => tab.topics.map(findLabDataDef).filter((def): def is LabDataDef => def != null),
    [tab.topics],
  )

  const renderHint = () => <LabPaneHint hint={tab.hint} />

  const renderCards = () => (
    <Flex gap={12} flexWrap="wrap" marginTop={16}>
      {topicDefs.map((def) => (
        <MemoLabPointCard key={def.topic} def={def} />
      ))}
    </Flex>
  )

  return (
    <Box padding={16}>
      {renderHint()}
      {renderCards()}
    </Box>
  )
}

export const MemoLabTabPane = React.memo(LabTabPane)

type LabTabPaneProps = {
  tab: PointsTab
}
