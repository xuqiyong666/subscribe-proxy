import { findLabDataDef } from '../../features/catalog'
import type { SPPayload } from 'subscribe-proxy'

export function formatPointValue(value: number, decimals: number): string {
  return value.toFixed(decimals)
}

export function formatUpdatedAt(updatedAt: number): string {
  if (updatedAt <= 0) {
    return '尚未更新'
  }
  return new Date(updatedAt).toLocaleTimeString('zh-CN', { hour12: false })
}

export function formatAppliedPull(applied: number | 'once' | undefined): string {
  if (applied == null) {
    return '—'
  }
  if (applied === 'once') {
    return 'once'
  }
  return `${applied / 1000}s`
}

export function formatPullIntervalLabel(pullIntervalMs: number): string {
  if (pullIntervalMs <= 0) {
    return '只拉一次'
  }
  return `${pullIntervalMs / 1000}秒`
}

export function formatInspectPayload(row: {
  topic: string
  payload: SPPayload | undefined
}): string {
  const def = findLabDataDef(row.topic)
  return formatPayloadValue(row.payload, def?.unit ?? '', def?.decimals ?? 1)
}

export function formatPayloadValue(
  payload: SPPayload | undefined,
  unit: string,
  decimals: number,
): string {
  if (!payload) {
    return '—'
  }
  const series = asTrendPoints(payload.data)
  if (series) {
    const last = series[series.length - 1]
    if (!last) {
      return '—'
    }
    return `${formatPointValue(last.y, decimals)} ${unit}`
  }
  if (typeof payload.data === 'number') {
    return `${formatPointValue(payload.data, decimals)} ${unit}`
  }
  return '—'
}

export function asTrendPoints(value: unknown): readonly TrendPoint[] | null {
  if (!Array.isArray(value)) {
    return null
  }
  return value as TrendPoint[]
}

export type TrendPoint = {
  t: number
  y: number
}
