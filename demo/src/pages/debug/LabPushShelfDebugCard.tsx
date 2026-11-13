import { Card, Table } from 'antd'
import type { TableColumnsType } from 'antd'

import { PUSH_LAB_DEFS } from '../../features/catalog'
import { proxy } from '../../features/runtime'
import type { SPPayload } from 'subscribe-proxy'
import { labelOf, yesNo } from './debugText'
import { formatInspectPayload } from '../shared/format'
import { useEngineDebug } from './useEngineDebug'

function LabPushShelfDebugCard() {
  const internal = proxy.getInternal()
  const state = useEngineDebug(internal.pushEngine)
  const rows = PUSH_LAB_DEFS.map((def) => ({
    topic: def.topic,
    payload: state.payloads.get(def.topic),
    occupancy: state.occupancy.get(def.topic)?.size ?? 0,
    remote: state.dataSourceTopics.has(def.topic),
  }))

  return (
    <Card title="代理 payload（推送）" size="small">
      <Table<PushShelfRow>
        size="small"
        rowKey="topic"
        pagination={false}
        columns={PUSH_SHELF_COLUMNS}
        dataSource={rows}
      />
    </Card>
  )
}

export { LabPushShelfDebugCard }

type PushShelfRow = {
  topic: string
  payload: SPPayload | undefined
  occupancy: number
  remote: boolean
}

const PUSH_SHELF_COLUMNS: TableColumnsType<PushShelfRow> = [
  {
    title: '数据名称',
    key: 'label',
    ellipsis: true,
    render: (_value: unknown, row) => labelOf(row.topic),
  },
  {
    title: '缓存 payload',
    key: 'payload',
    width: 96,
    render: (_value: unknown, row) => formatInspectPayload({ topic: row.topic, payload: row.payload }),
  },
  {
    title: '占用',
    dataIndex: 'occupancy',
    key: 'occupancy',
    width: 52,
  },
  {
    title: '远端',
    key: 'remote',
    width: 52,
    render: (_value: unknown, row) => yesNo(row.remote),
  },
]
