import { useEffect, useState } from 'react'

import type { SPEventListener } from 'subscribe-proxy'

export function useEngineDebug<T>(engine: InspectEngine<T>): T {
  const [, setRevision] = useState(0)

  useEffect(() => engine.watch(() => {
    setRevision((current) => current + 1)
  }), [engine])

  return engine.getDebugState()
}

export type InspectEngine<T> = {
  watch: (onEvent: SPEventListener) => () => void
  getDebugState: () => T
}
