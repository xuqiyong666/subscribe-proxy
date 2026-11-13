import {
  NOOP_SUBSCRIPTION,
  addWatcher,
  notifyEventListeners,
} from '../helpers'
import type {
  PushDebugState,
  SPEngineEvent,
  SPEventListener,
  SPPayload,
  SPPushDataSource,
  SPSubscription,
} from '../types'
import { notifyHolders } from './notifyHolders'
import type { LiveSub, PushEngine, PushSubscribeRequest } from './types'

export function createPushEngine(dataSource: SPPushDataSource): PushEngine {
  /** topic → 最新 payload，占用归零即删 */
  const payloads = new Map<string, SPPayload>()
  /** topic → 占用中的 subscription */
  const subsByTopic = new Map<string, Set<LiveSub>>()
  /** topic → 取消 dataSource.subscribe */
  const dataSourceUnsubs = new Map<string, () => void>()
  /** 内部事件监听 */
  const eventListeners = new Set<SPEventListener>()

  const emit = (event: SPEngineEvent) => {
    notifyEventListeners(eventListeners, event)
  }

  const put = (topic: string, payload: SPPayload): void => {
    if (topic.length === 0) {
      return
    }

    const holders = subsByTopic.get(topic)
    if (!holders || holders.size === 0) {
      return
    }

    payloads.set(topic, payload)
    notifyHolders(holders, payload)
    emit({ type: 'put', topic })
  }

  const dropTopic = (topic: string) => {
    payloads.delete(topic)
    const unsubRemote = dataSourceUnsubs.get(topic)
    if (!unsubRemote) {
      return
    }
    unsubRemote()
    dataSourceUnsubs.delete(topic)
    emit({ type: 'remote-stop', topic })
  }

  const removeSub = (topic: string, sub: LiveSub) => {
    const set = subsByTopic.get(topic)
    if (!set || !set.has(sub)) {
      return
    }

    set.delete(sub)
    if (set.size === 0) {
      subsByTopic.delete(topic)
      dropTopic(topic)
    }
    emit({ type: 'unsubscribe', topic, occupancy: set.size })
  }

  const subscribe = (request: PushSubscribeRequest): SPSubscription => {
    if (request.topic.length === 0) {
      return NOOP_SUBSCRIPTION
    }

    const topic = request.topic
    const sub: LiveSub = {
      onMessage: request.onMessage,
      unsubscribe: () => {
        removeSub(topic, sub)
      },
    }

    let set = subsByTopic.get(topic)
    if (!set) {
      set = new Set<LiveSub>()
      subsByTopic.set(topic, set)
    }
    const firstHolder = set.size === 0
    set.add(sub)

    const cached = payloads.get(topic)
    if (cached) {
      sub.onMessage?.(cached)
    }

    if (firstHolder) {
      const unsubRemote = dataSource.subscribe(topic, (payload) => {
        put(topic, payload)
      })
      dataSourceUnsubs.set(topic, unsubRemote)
      emit({ type: 'remote-start', topic })
    }

    emit({ type: 'subscribe', topic, occupancy: set.size })
    return sub
  }

  const watch = (onEvent: SPEventListener) => addWatcher(eventListeners, onEvent)

  const getDebugState = (): PushDebugState => ({
    payloads,
    occupancy: subsByTopic,
    dataSourceTopics: dataSourceUnsubs,
  })

  const dispose = () => {
    dataSourceUnsubs.forEach((unsubRemote) => {
      unsubRemote()
    })
    dataSourceUnsubs.clear()
    subsByTopic.clear()
    payloads.clear()
  }

  return {
    subscribe,
    watch,
    getDebugState,
    dispose,
  }
}
