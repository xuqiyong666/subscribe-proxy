import type { SPPayload } from '../types'
import { isOncePull } from './isOncePull'
import type { LiveSub } from './types'

export function notifyHolders(set: Set<LiveSub> | undefined, payload: SPPayload) {
  if (!set) {
    return
  }
  for (const sub of set) {
    if (isOncePull(sub) && sub.delivered) {
      continue
    }
    sub.onMessage?.(payload)
    if (isOncePull(sub)) {
      sub.delivered = true
    }
  }
}
