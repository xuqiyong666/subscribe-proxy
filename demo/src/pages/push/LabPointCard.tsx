import React, { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from 'chakbox-ui'

import type { LabDataDef } from '../../features/catalog'
import { proxy } from '../../features/runtime'
import type { SPPayload } from 'subscribe-proxy'
import { LAB_TOPIC_CARD_BOX } from '../constants'
import { formatPointValue, formatUpdatedAt } from '../shared/format'

export function LabPointCard({ def }: LabPointCardProps) {
  const [payload, setPayload] = useState<SPPayload>()
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  useEffect(() => {
    const subscription = proxy.subscribe({
      method: 'push',
      topic: def.topic,
      onMessage: (next) => {
        setPayload(next)
      },
    })
    return () => subscription.unsubscribe()
  }, [def.topic])

  const valueText = typeof payload?.data === 'number'
    ? formatPointValue(payload.data, def.decimals)
    : '—'

  return (
    <Box
      {...LAB_TOPIC_CARD_BOX}
      minWidth={168}
      flex={1}
    >
      <Flex justifyContent="space-between" alignItems="flex-start" gap={8}>
        <Box>
          <Text fontSize={12} color="#999">
            {def.label}
          </Text>
        </Box>
        <Box flexShrink={0}>
          <Text fontSize={12} color="#999">
            渲染 {renderCountRef.current} 次
          </Text>
        </Box>
      </Flex>
      <Box marginTop={6}>
        <Text fontSize={22} fontWeight={600}>
          {valueText}
        </Text>
        <Text fontSize={12} color="#999">
          {' '}
          {def.unit}
        </Text>
      </Box>
      <Box marginTop={6}>
        <Text fontSize={12} color="#999">
          {formatUpdatedAt(payload?.updatedAt ?? 0)}
        </Text>
      </Box>
    </Box>
  )
}

export const MemoLabPointCard = React.memo(LabPointCard)

type LabPointCardProps = {
  def: LabDataDef
}
