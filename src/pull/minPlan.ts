import type { SPPullPlan } from '../types'
import { isOncePull } from './isOncePull'
import type { LiveSub } from './types'

export function minPlan(set: Set<LiveSub>): SPPullPlan | null {
  let minInterval: number | null = null
  let hasOnce = false
  set.forEach((sub) => {
    if (isOncePull(sub)) {
      hasOnce = true
      return
    }
    const intervalMs = sub.pullIntervalMs
    if (intervalMs == null) {
      return
    }
    if (minInterval == null || intervalMs < minInterval) {
      minInterval = intervalMs
    }
  })

  if (minInterval != null) {
    return { mode: 'interval', intervalMs: minInterval }
  }
  if (hasOnce) {
    return { mode: 'once' }
  }
  return null
}
