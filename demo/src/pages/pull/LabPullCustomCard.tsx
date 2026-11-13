import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from 'chakbox-ui'
import { Button, Popconfirm, Space } from 'antd'

import { findLabDataDef } from '../../features/catalog'
import { proxy } from '../../features/runtime'
import type { SPPayload } from 'subscribe-proxy'
import { LAB_TOPIC_CARD_BOX } from '../constants'
import type { PullCustomItem } from '../constants'
import { LabSeriesView } from './LabSeriesView'
import { formatPullIntervalLabel } from '../shared/format'

function LabPullCustomCard({ item, onEdit, onDelete }: LabPullCustomCardProps) {
  const [payload, setPayload] = useState<SPPayload>()
  const renderCountRef = useRef(0)
  renderCountRef.current += 1
  const def = findLabDataDef(item.topic)

  useEffect(() => {
    const subscription = proxy.subscribe({
      method: 'pull',
      topic: item.topic,
      pullIntervalMs: item.pullIntervalMs,
      onMessage: (next) => {
        setPayload(next)
      },
    })
    return () => subscription.unsubscribe()
  }, [item.pullIntervalMs, item.topic])

  const handleEdit = useCallback(() => {
    onEdit(item.id)
  }, [item.id, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(item.id)
  }, [item.id, onDelete])

  if (!def) {
    return null
  }

  return (
    <Box {...LAB_TOPIC_CARD_BOX}>
      <Flex justifyContent="space-between" alignItems="center" gap={12}>
        <Box>
          <Text fontSize={14} fontWeight={600}>
            {def.label}
          </Text>
          <Text fontSize={12} color="#999">
            {' '}
            {formatPullIntervalLabel(item.pullIntervalMs)}
          </Text>
        </Box>
        <Flex alignItems="center" gap={8} flexShrink={0}>
          <Text fontSize={13}>渲染 {renderCountRef.current} 次</Text>
          <Space size={4}>
            <Button type="link" size="small" onClick={handleEdit}>
              编辑
            </Button>
            <Popconfirm
              title="删除此订阅？"
              onConfirm={handleDelete}
              okText="删除"
              cancelText="取消"
            >
              <Button type="link" danger size="small">
                删除
              </Button>
            </Popconfirm>
          </Space>
        </Flex>
      </Flex>
      <Box marginTop={12}>
        <LabSeriesView def={def} payload={payload} />
      </Box>
    </Box>
  )
}

const MemoLabPullCustomCard = React.memo(LabPullCustomCard)

export { LabPullCustomCard, MemoLabPullCustomCard }

type LabPullCustomCardProps = {
  item: PullCustomItem
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}
