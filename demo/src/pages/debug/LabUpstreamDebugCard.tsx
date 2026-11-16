import { Box, Text } from 'chakbox-ui'
import { Card, Table } from 'antd'
import type { TableColumnsType } from 'antd'

import type { SPMethod } from 'subscribe-proxy'
import { LabMethodTag } from './LabMethodTag'
import { formatPayloadValue, formatTime } from '../shared/format'
import type { UpstreamDebugRow } from './useUpstreamDebugRows'
import { useUpstreamDebugRows } from './useUpstreamDebugRows'

function LabUpstreamDebugCard() {
  const rows = useUpstreamDebugRows()

  return (
    <Card title="现场" size="small">
      <Table<UpstreamDebugRow>
        size="small"
        rowKey="topic"
        pagination={false}
        columns={UPSTREAM_COLUMNS}
        dataSource={rows}
      />
      <Box marginTop={12}>
        <Text fontSize={12} color="#999">
          看现场真值。曲线每秒更新，点位 500–1500ms 随机跳，与有没有订阅无关。有人 subscribe 推送主题时，进线才会写入代理。
        </Text>
      </Box>
    </Card>
  )
}

export { LabUpstreamDebugCard }

const UPSTREAM_COLUMNS: TableColumnsType<UpstreamDebugRow> = [
  {
    title: '数据名称',
    dataIndex: 'label',
    key: 'label',
    ellipsis: true,
  },
  {
    title: 'method',
    dataIndex: 'method',
    key: 'method',
    width: 72,
    render: (method: SPMethod) => <LabMethodTag method={method} />,
  },
  {
    title: '值',
    key: 'value',
    width: 96,
    render: (_value: unknown, row) => formatPayloadValue(row.payload, row.unit, row.decimals),
  },
  {
    title: '更新',
    key: 'time',
    width: 88,
    render: (_value: unknown, row) => formatTime(row.payload?.time ?? 0),
  },
]
