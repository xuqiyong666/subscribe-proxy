import type {
  PullEngineInspect,
  SPOnMessage,
  SPSubscription,
} from '../types'

export type PullEngine = PullEngineInspect & {
  subscribe: (request: PullSubscribeRequest) => SPSubscription
  dispose: () => void
}

export type PullSubscribeRequest = {
  topic: string
  pullIntervalMs?: number
  onMessage?: SPOnMessage
}

export type LiveSub = {
  onMessage: SPOnMessage | undefined
  pullIntervalMs: number | undefined
  /** once 占用是否已经拿到第一帧 */
  delivered: boolean
  unsubscribe: () => void
}

export type AppliedPull = number | 'once'

export type TimerHandle = ReturnType<typeof setTimeout>
