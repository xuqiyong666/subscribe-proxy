import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from 'chakbox-ui'
import { Select, Switch } from 'antd'

import type { LabDataDef } from '../../features/catalog'
import { proxy } from '../../features/runtime'
import type { SPPayload } from 'subscribe-proxy'
import { DEFAULT_PULL_INTERVAL_MS, LAB_TOPIC_CARD_BOX, PULL_INTERVAL_OPTIONS } from '../constants'
import { LabSeriesView } from './LabSeriesView'
import type { TrendPoint } from '../shared/format'

function LabChartPanel({ def }: LabChartPanelProps) {
  const [polling, setPolling] = useState(true)
  const [intervalMs, setIntervalMs] = useState(DEFAULT_PULL_INTERVAL_MS)
  const [payload, setPayload] = useState<SPPayload<TrendPoint[]>>()
  const pullIntervalMs = polling ? intervalMs : 0
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  useEffect(() => {
    const subscription = proxy.subscribe<TrendPoint[]>({
      method: 'pull',
      topic: def.topic,
      pullIntervalMs,
      onMessage: (next) => {
        setPayload(next)
      },
    })
    return () => subscription.unsubscribe()
  }, [def.topic, pullIntervalMs])

  const handlePollingChange = useCallback((checked: boolean) => {
    setPolling(checked)
  }, [])

  const handleIntervalChange = useCallback((value: number) => {
    setIntervalMs(value)
  }, [])

  return (
    <Box {...LAB_TOPIC_CARD_BOX}>
      <Flex justifyContent="space-between" alignItems="center" gap={12}>
        <Box>
          <Text fontSize={14} fontWeight={600}>
            {def.label}
          </Text>
        </Box>
        <Box flexShrink={0}>
          <Text fontSize={13}>渲染 {renderCountRef.current} 次</Text>
        </Box>
      </Flex>
      <Flex gap={16} alignItems="center" flexWrap="wrap" marginTop={12}>
        <Flex gap={8} alignItems="center">
          <Text fontSize={13}>启用轮询</Text>
          <Switch checked={polling} onChange={handlePollingChange} />
        </Flex>
        <Flex gap={8} alignItems="center">
          <Text fontSize={13}>轮询间隔</Text>
          <Select<number>
            value={intervalMs}
            onChange={handleIntervalChange}
            disabled={!polling}
            options={PULL_INTERVAL_OPTIONS.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            style={{ width: 108 }}
          />
        </Flex>
      </Flex>
      <Box marginTop={12}>
        <LabSeriesView def={def} payload={payload} />
      </Box>
    </Box>
  )
}

const MemoLabChartPanel = React.memo(LabChartPanel)

export { LabChartPanel, MemoLabChartPanel }

type LabChartPanelProps = {
  def: LabDataDef
}
