import type { SPEngineEvent, SPEventListener, SPSubscription } from './types'

export const NOOP_SUBSCRIPTION: SPSubscription = {
  unsubscribe: () => undefined,
}

export function addWatcher<T>(watchers: Set<T>, watcher: T): () => void {
  watchers.add(watcher)
  return () => {
    watchers.delete(watcher)
  }
}

export function notifyEventListeners(
  listeners: Set<SPEventListener>,
  event: SPEngineEvent,
): void {
  const next = [...listeners]
  for (const listener of next) {
    listener(event)
  }
}

export function methodOf(request: never): string {
  return String((request as { method: unknown }).method)
}
