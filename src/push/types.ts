import type {
  PushEngineInspect,
  SPOnMessage,
  SPSubscription,
} from '../types'

export type PushEngine = PushEngineInspect & {
  subscribe: (request: PushSubscribeRequest) => SPSubscription
  dispose: () => void
}

export type PushSubscribeRequest = {
  topic: string
  onMessage?: SPOnMessage
}

export type LiveSub = {
  onMessage: SPOnMessage | undefined
  unsubscribe: () => void
}
