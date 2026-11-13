import { Card, Table } from 'antd'
import type { TableColumnsType } from 'antd'

import { PULL_LAB_DEFS } from '../../features/catalog'
import { proxy } from '../../features/runtime'
import type { SPPayload } from 'subscribe-proxy'
import { labelOf, yesNo } from './debugText'
import { formatAppliedPull, formatInspectPayload } from '../shared/format'
import { useEngineDebug } from './useEngineDebug'

function LabPullShelfDebugCard() {
  const internal = proxy.getInternal()
  const state = useEngineDebug(internal.pullEngine)
  const rows = PULL_LAB_DEFS.map((def) => ({
    topic: def.topic,
    payload: state.payloads.get(def.topic),
    occupancy: state.occupancy.get(def.topic)?.size ?? 0,
    applied: state.applied.get(def.topic),
    waiting: state.waitingTopics.has(def.topic),
  }))

  return (
    <Card title="代理 payload（拉取）" size="small">
      <Table<PullShelfRow>
        size="small"
        rowKey="topic"
        pagination={false}
        columns={PULL_SHELF_COLUMNS}
        dataSource={rows}
      />
    </Card>
  )
}

export { LabPullShelfDebugCard }

type PullShelfRow = {
  topic: string
  payload: SPPayload | undefined
  occupancy: number
  applied: number | 'once' | undefined
  waiting: boolean
}

const PULL_SHELF_COLUMNS: TableColumnsType<PullShelfRow> = [
  {
    title: '数据名称',
    key: 'label',
    ellipsis: true,
    render: (_value: unknown, row) => labelOf(row.topic),
  },
  {
    title: '缓存 payload',
    key: 'payload',
    width: 88,
    render: (_value: unknown, row) => formatInspectPayload({ topic: row.topic, payload: row.payload }),
  },
  {
    title: '占用',
    dataIndex: 'occupancy',
    key: 'occupancy',
    width: 44,
  },
  {
    title: '计划',
    key: 'applied',
    width: 56,
    render: (_value: unknown, row) => formatAppliedPull(row.applied),
  },
  {
    title: '等待',
    key: 'waiting',
    width: 44,
    render: (_value: unknown, row) => yesNo(row.waiting),
  },
]
