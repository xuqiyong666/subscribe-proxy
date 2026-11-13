import { useEffect, useState } from 'react'

import { LAB_DATA_CATALOG } from '../../features/catalog'
import { dataSourceUpstream } from '../../features/runtime'
import type { SPMethod, SPPayload } from 'subscribe-proxy'

export function useUpstreamDebugRows(): UpstreamDebugRow[] {
  const [, setRevision] = useState(0)

  useEffect(() => dataSourceUpstream.subscribe(() => {
    setRevision((current) => current + 1)
  }), [])

  return LAB_DATA_CATALOG.map((def) => ({
    topic: def.topic,
    label: def.label,
    method: def.method,
    unit: def.unit,
    decimals: def.decimals,
    payload: dataSourceUpstream.getPayload(def.topic),
  }))
}

export type UpstreamDebugRow = {
  topic: string
  label: string
  method: SPMethod
  unit: string
  decimals: number
  payload: SPPayload | undefined
}
