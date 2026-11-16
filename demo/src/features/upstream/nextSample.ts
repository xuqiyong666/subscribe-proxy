import type { SPPayload } from 'subscribe-proxy'

import type { LabDataDef } from '../catalog'
import { CHART_POINT_STEP_MS, CHART_SERIES_LENGTH } from './constants'

export function nextPayload(def: LabDataDef, prev: SPPayload | undefined, now: number): SPPayload {
  if (def.kind === 'series') {
    return {
      data: nextSeries(def, prev, now),
      time: now,
    }
  }

  const prevPoint = typeof prev?.data === 'number' ? prev.data : undefined
  const base = prevPoint ?? (typeof def.initialValue === 'number' ? def.initialValue : midpoint(def))
  return {
    data: walkNumber(base, def),
    time: now,
  }
}

type TrendPoint = {
  t: number
  y: number
}

function nextSeries(def: LabDataDef, prev: SPPayload | undefined, now: number): TrendPoint[] {
  const prevPoints = Array.isArray(prev?.data) ? prev.data as TrendPoint[] : []
  if (prevPoints.length === 0) {
    return seedSeries(def, now)
  }

  const nextPoints = prevPoints.slice(1)
  const lastY = nextPoints[nextPoints.length - 1]?.y ?? midpoint(def)
  nextPoints.push({
    t: now,
    y: walkNumber(lastY, def),
  })
  return nextPoints
}

function seedSeries(def: LabDataDef, now: number): TrendPoint[] {
  const points: TrendPoint[] = []
  let y = midpoint(def)
  const startAt = now - (CHART_SERIES_LENGTH - 1) * CHART_POINT_STEP_MS
  for (let index = 0; index < CHART_SERIES_LENGTH; index += 1) {
    y = walkNumber(y, def)
    points.push({
      t: startAt + index * CHART_POINT_STEP_MS,
      y,
    })
  }
  return points
}

function walkNumber(base: number, def: LabDataDef): number {
  const span = def.max - def.min
  const step = span * 0.04
  let value = base + (Math.random() * 2 - 1) * step
  if (value < def.min) {
    value = def.min
  } else if (value > def.max) {
    value = def.max
  }
  const factor = 10 ** def.decimals
  return Math.round(value * factor) / factor
}

function midpoint(def: LabDataDef): number {
  return (def.min + def.max) / 2
}
