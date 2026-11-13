import {
  NOOP_SUBSCRIPTION,
  addWatcher,
  notifyEventListeners,
} from '../helpers'
import type {
  PullDebugState,
  SPEngineEvent,
  SPEventListener,
  SPPayload,
  SPPullDataSource,
  SPSubscription,
} from '../types'
import { isOncePull } from './isOncePull'
import { minPlan } from './minPlan'
import { notifyHolders } from './notifyHolders'
import type {
  AppliedPull,
  LiveSub,
  PullEngine,
  PullSubscribeRequest,
  TimerHandle,
} from './types'

export function createPullEngine(dataSource: SPPullDataSource): PullEngine {
  /** topic → 最新 payload，占用归零即删 */
  const payloads = new Map<string, SPPayload>()
  /** topic → 占用中的 subscription */
  const subsByTopic = new Map<string, Set<LiveSub>>()
  /** topic → 等待下一拍 fetch 的 timer */
  const timers = new Map<string, TimerHandle>()
  /** topic → 用来作废进行中的 fetch */
  const epochs = new Map<string, number>()
  /** topic → 当前真正在执行的拉取计划 */
  const applied = new Map<string, AppliedPull>()
  /** 内部事件监听 */
  const eventListeners = new Set<SPEventListener>()
  /** 全局递增，stop 后删 key 也不会和重订撞上同一代 */
  let epochSeq = 0

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

  const stopPull = (topic: string) => {
    const timer = timers.get(topic)
    if (timer != null) {
      clearTimeout(timer)
    }
    timers.delete(topic)
    epochs.delete(topic)
  }

  const dropTopic = (topic: string) => {
    stopPull(topic)
    applied.delete(topic)
    payloads.delete(topic)
  }

  const runPull = async (topic: string) => {
    const epoch = ++epochSeq
    epochs.set(topic, epoch)

    let payload: SPPayload | undefined
    try {
      payload = await dataSource.fetch(topic)
    } catch {
      payload = undefined
    }

    if (epochs.get(topic) !== epoch) {
      return
    }
    if (payload) {
      put(topic, payload)
    }

    const current = applied.get(topic)
    if (typeof current !== 'number') {
      return
    }
    timers.set(topic, setTimeout(() => {
      timers.delete(topic)
      void runPull(topic)
    }, current))
  }

  const refreshPull = (topic: string) => {
    const set = subsByTopic.get(topic)
    if (!set || set.size === 0) {
      dropTopic(topic)
      emit({ type: 'pull-plan', topic, plan: { mode: 'stop' } })
      return
    }

    const plan = minPlan(set)
    if (!plan) {
      stopPull(topic)
      applied.delete(topic)
      emit({ type: 'pull-plan', topic, plan: { mode: 'stop' } })
      return
    }

    const next: AppliedPull = plan.mode === 'once' ? 'once' : plan.intervalMs
    const prev = applied.get(topic)
    if (prev === next) {
      return
    }

    stopPull(topic)
    applied.set(topic, next)

    if (next === 'once') {
      emit({ type: 'pull-plan', topic, plan: { mode: 'once' } })
      if (prev === undefined) {
        void runPull(topic)
      }
      return
    }

    emit({ type: 'pull-plan', topic, plan: { mode: 'interval', intervalMs: next } })
    void runPull(topic)
  }

  const removeSub = (topic: string, sub: LiveSub) => {
    const set = subsByTopic.get(topic)
    if (!set || !set.has(sub)) {
      return
    }

    set.delete(sub)
    if (set.size === 0) {
      subsByTopic.delete(topic)
    }
    refreshPull(topic)
    emit({ type: 'unsubscribe', topic, occupancy: set.size })
  }

  const subscribe = (request: PullSubscribeRequest): SPSubscription => {
    if (request.topic.length === 0) {
      return NOOP_SUBSCRIPTION
    }

    const topic = request.topic
    const sub: LiveSub = {
      onMessage: request.onMessage,
      pullIntervalMs: request.pullIntervalMs,
      delivered: false,
      unsubscribe: () => {
        removeSub(topic, sub)
      },
    }

    let set = subsByTopic.get(topic)
    if (!set) {
      set = new Set<LiveSub>()
      subsByTopic.set(topic, set)
    }
    set.add(sub)

    const cached = payloads.get(topic)
    if (cached) {
      sub.onMessage?.(cached)
      if (isOncePull(sub)) {
        sub.delivered = true
      }
    }

    refreshPull(topic)
    emit({ type: 'subscribe', topic, occupancy: set.size })
    return sub
  }

  const watch = (onEvent: SPEventListener) => addWatcher(eventListeners, onEvent)

  const getDebugState = (): PullDebugState => ({
    payloads,
    occupancy: subsByTopic,
    applied,
    epochs,
    waitingTopics: timers,
  })

  const dispose = () => {
    applied.forEach((_plan, topic) => {
      stopPull(topic)
    })
    applied.clear()
    subsByTopic.clear()
    payloads.clear()
    epochs.clear()
  }

  return {
    subscribe,
    watch,
    getDebugState,
    dispose,
  }
}
