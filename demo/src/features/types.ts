import type { SPPayload } from 'subscribe-proxy'

export type DataSourceUpstream = {
  getPayload: <TData = unknown>(topic: string) => SPPayload<TData> | undefined
  subscribe: (onChange: (topic: string) => void) => () => void
  dispose: () => void
}
