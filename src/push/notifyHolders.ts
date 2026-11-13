import type { SPPayload } from '../types'
import type { LiveSub } from './types'

export function notifyHolders(set: Set<LiveSub> | undefined, payload: SPPayload) {
  if (!set) {
    return
  }
  for (const sub of set) {
    sub.onMessage?.(payload)
  }
}
