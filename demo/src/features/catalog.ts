import type { SPMethod } from 'subscribe-proxy'

export type LabDataKind = 'point' | 'series'

export type LabDataDef = {
  topic: string
  label: string
  method: SPMethod
  kind: LabDataKind
  unit: string
  initialValue: unknown
  min: number
  max: number
  decimals: number
}

export const LAB_DATA_CATALOG: readonly LabDataDef[] = [
  { topic: 'grid.freq', label: '电网频率', method: 'push', kind: 'point', unit: 'Hz', initialValue: 50.02, min: 49.6, max: 50.4, decimals: 2 },
  { topic: 'grid.voltage', label: '电网电压', method: 'push', kind: 'point', unit: 'V', initialValue: 380, min: 360, max: 400, decimals: 1 },
  { topic: 'grid.power', label: '关口功率', method: 'push', kind: 'point', unit: 'kW', initialValue: 126, min: 80, max: 180, decimals: 1 },
  { topic: 'batt.soc', label: '储能 SOC', method: 'push', kind: 'point', unit: '%', initialValue: 62, min: 8, max: 96, decimals: 1 },
  { topic: 'batt.power', label: '储能功率', method: 'push', kind: 'point', unit: 'kW', initialValue: -38, min: -80, max: 80, decimals: 1 },
  { topic: 'weather.temp', label: '环境温度', method: 'push', kind: 'point', unit: '°C', initialValue: 26.4, min: 12, max: 38, decimals: 1 },
  {
    topic: 'chart.power',
    label: '功率走势',
    method: 'pull',
    kind: 'series',
    unit: 'kW',
    initialValue: [],
    min: 40,
    max: 180,
    decimals: 1,
  },
  {
    topic: 'chart.energy',
    label: '电量走势',
    method: 'pull',
    kind: 'series',
    unit: 'kWh',
    initialValue: [],
    min: 200,
    max: 800,
    decimals: 1,
  },
]

export const PUSH_LAB_DEFS = LAB_DATA_CATALOG.filter((def) => def.method === 'push')

export const PULL_LAB_DEFS = LAB_DATA_CATALOG.filter((def) => def.method === 'pull')

export const PUSH_TOPICS = PUSH_LAB_DEFS.map((def) => def.topic)

export const PULL_TOPICS = PULL_LAB_DEFS.map((def) => def.topic)

export function findLabDataDef(topic: string): LabDataDef | undefined {
  return LAB_DATA_CATALOG.find((item) => item.topic === topic)
}
