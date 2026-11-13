import type { LiveSub } from './types'

export function isOncePull(sub: LiveSub): boolean {
  const raw = sub.pullIntervalMs
  return raw == null || raw <= 0
}
