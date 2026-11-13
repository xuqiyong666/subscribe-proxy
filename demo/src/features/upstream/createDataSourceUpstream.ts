import type { SPPayload } from 'subscribe-proxy'

import { LAB_DATA_CATALOG, findLabDataDef } from '../catalog'
import type { DataSourceUpstream } from '../types'
import {
  UPSTREAM_POINT_TICK_MAX_MS,
  UPSTREAM_POINT_TICK_MIN_MS,
  UPSTREAM_SERIES_TICK_MS,
} from './constants'
import { nextPayload } from './nextSample'

export function createDataSourceUpstream(): DataSourceUpstream {
  const values = new Map<string, SPPayload>()
  const listeners = new Set<(topic: string) => void>()
  const pointTimers = new Map<string, TimerHandle>()
  const now = Date.now()

  for (const def of LAB_DATA_CATALOG) {
    values.set(def.topic, nextPayload(def, undefined, now))
  }

  const notify = (topic: string) => {
    const next = [...listeners]
    for (const listener of next) {
      listener(topic)
    }
  }

  const tickSeries = () => {
    const tickAt = Date.now()
    for (const def of LAB_DATA_CATALOG) {
      if (def.kind !== 'series') {
        continue
      }
      values.set(def.topic, nextPayload(def, values.get(def.topic), tickAt))
      notify(def.topic)
    }
  }

  const schedulePoint = (topic: string) => {
    const delay = randomBetween(UPSTREAM_POINT_TICK_MIN_MS, UPSTREAM_POINT_TICK_MAX_MS)
    pointTimers.set(topic, setTimeout(() => {
      const def = findLabDataDef(topic)
      if (!def || def.kind !== 'point') {
        return
      }
      values.set(topic, nextPayload(def, values.get(topic), Date.now()))
      notify(topic)
      schedulePoint(topic)
    }, delay))
  }

  for (const def of LAB_DATA_CATALOG) {
    if (def.kind === 'point') {
      schedulePoint(def.topic)
    }
  }

  const seriesTimer = window.setInterval(tickSeries, UPSTREAM_SERIES_TICK_MS)

  return {
    getPayload: <TData = unknown>(topic: string) => {
      return values.get(topic) as SPPayload<TData> | undefined
    },
    subscribe: (onChange) => {
      listeners.add(onChange)
      return () => {
        listeners.delete(onChange)
      }
    },
    dispose: () => {
      window.clearInterval(seriesTimer)
      pointTimers.forEach((timer) => {
        clearTimeout(timer)
      })
      pointTimers.clear()
      listeners.clear()
    },
  }
}

type TimerHandle = ReturnType<typeof setTimeout>

function randomBetween(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1))
}
