export type SPMethod = 'push' | 'pull'

export type SPPayload<TData = unknown> = {
  data: TData
  time: number
}

export type SPPullPlan =
  | { mode: 'once' }
  | { mode: 'interval'; intervalMs: number }

export type SPOnMessage<TData = unknown> = (payload: SPPayload<TData>) => void

export type SPPushSubscribeRequest<TData = unknown> = {
  method: 'push'
  topic: string
  onMessage?: SPOnMessage<TData>
}

export type SPPullSubscribeRequest<TData = unknown> = {
  method: 'pull'
  topic: string
  /** 拉取间隔；省略或 ≤0 表示不轮询、只拉一次，且 onMessage 只收第一帧 */
  pullIntervalMs?: number
  onMessage?: SPOnMessage<TData>
}

export type SPSubscribeRequest<TData = unknown> =
  | SPPushSubscribeRequest<TData>
  | SPPullSubscribeRequest<TData>

export type SPSubscription = {
  unsubscribe: () => void
}

export type SPPullPlanChange =
  | { mode: 'stop' }
  | { mode: 'once' }
  | { mode: 'interval'; intervalMs: number }

export type SPEngineEvent =
  | { type: 'put'; topic: string }
  | { type: 'subscribe'; topic: string; occupancy: number }
  | { type: 'unsubscribe'; topic: string; occupancy: number }
  | { type: 'remote-start'; topic: string }
  | { type: 'remote-stop'; topic: string }
  | { type: 'pull-plan'; topic: string; plan: SPPullPlanChange }

export type SPEventListener = (event: SPEngineEvent) => void

export type PushDebugState = {
  payloads: ReadonlyMap<string, SPPayload>
  occupancy: ReadonlyMap<string, ReadonlySet<unknown>>
  dataSourceTopics: ReadonlyMap<string, () => void>
}

export type PullDebugState = {
  payloads: ReadonlyMap<string, SPPayload>
  occupancy: ReadonlyMap<string, ReadonlySet<unknown>>
  applied: ReadonlyMap<string, number | 'once'>
  epochs: ReadonlyMap<string, number>
  waitingTopics: ReadonlyMap<string, unknown>
}

export type PushEngineInspect = {
  watch: (onEvent: SPEventListener) => () => void
  getDebugState: () => PushDebugState
}

export type PullEngineInspect = {
  watch: (onEvent: SPEventListener) => () => void
  getDebugState: () => PullDebugState
}

export type TSubscribeProxyInternal = {
  pushEngine: PushEngineInspect
  pullEngine: PullEngineInspect
}

export type TSubscribeProxy = {
  subscribe: <TData = unknown>(request: SPSubscribeRequest<TData>) => SPSubscription
  dispose: () => void
  /** 观察面，业务页不要碰 */
  getInternal: () => TSubscribeProxyInternal
}

export type SPPushDataSource = {
  subscribe: (topic: string, onMessage: SPOnMessage) => () => void
}

export type SPPullDataSource = {
  fetch: (topic: string) => Promise<SPPayload>
}

export type SPDataSource = SPPushDataSource & SPPullDataSource

export type CreateSubscribeProxyOptions = {
  dataSource: SPDataSource
}
