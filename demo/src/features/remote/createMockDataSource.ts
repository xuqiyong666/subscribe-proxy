import type { SPPayload, SPDataSource } from 'subscribe-proxy'

import type { DataSourceUpstream } from '../types'
import {
  DUPLICATE_MESSAGE_CHANCE,
  PULL_HTTP_DELAY_MAX_MS,
  PULL_HTTP_DELAY_MIN_MS,
} from './constants'

export function createMockDataSource(upstream: DataSourceUpstream): SPDataSource {
  const lastDelivered = new Map<string, SPPayload>()

  return {
    fetch: async (topic) => {
      const httpDelay = randomBetween(PULL_HTTP_DELAY_MIN_MS, PULL_HTTP_DELAY_MAX_MS)
      await wait(httpDelay)
      const payload = requirePayload(upstream, topic)
      return maybeDuplicate(lastDelivered, topic, payload)
    },
    subscribe: (topic, onMessage) => {
      const payload = upstream.getPayload(topic)
      if (payload) {
        onMessage(maybeDuplicate(lastDelivered, topic, payload))
      }

      return upstream.subscribe((changedTopic) => {
        if (changedTopic !== topic) {
          return
        }
        const next = upstream.getPayload(topic)
        if (!next) {
          return
        }
        onMessage(maybeDuplicate(lastDelivered, topic, next))
      })
    },
  }
}

function requirePayload(upstream: DataSourceUpstream, topic: string): SPPayload {
  const payload = upstream.getPayload(topic)
  if (!payload) {
    throw new Error(`SPDataSource.fetch: missing payload for ${topic}`)
  }
  return payload
}

function maybeDuplicate(
  lastDelivered: Map<string, SPPayload>,
  topic: string,
  payload: SPPayload,
): SPPayload {
  const prev = lastDelivered.get(topic)
  if (prev && Math.random() < DUPLICATE_MESSAGE_CHANCE) {
    return prev
  }
  lastDelivered.set(topic, payload)
  return payload
}

function randomBetween(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1))
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
