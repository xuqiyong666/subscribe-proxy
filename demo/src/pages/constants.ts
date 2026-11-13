export const DEFAULT_PULL_INTERVAL_MS = 1000

export const PULL_INTERVAL_OPTIONS = [
  { label: '1秒', value: 1000 },
  { label: '2秒', value: 2000 },
  { label: '3秒', value: 3000 },
  { label: '5秒', value: 5000 },
  { label: '10秒', value: 10000 },
] as const

export const LAB_TOPIC_CARD_BOX = {
  padding: 12,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#d9d9d9',
  borderRadius: '8px',
  background: '#fff',
} as const

export const PUSH_SCENE_TABS = [
  {
    key: 'grid',
    tabType: 'points',
    label: '电网',
    hint: '三次 subscribe 各订一个推送主题（频率 / 电压 / 功率）。切走即 unsubscribe。',
    topics: ['grid.freq', 'grid.voltage', 'grid.power'],
  },
  {
    key: 'storage',
    tabType: 'points',
    label: '储能',
    hint: '订 SOC / 储能功率 / 气温。切走即 unsubscribe。',
    topics: ['batt.soc', 'batt.power', 'weather.temp'],
  },
  {
    key: 'overlap',
    tabType: 'points',
    label: '重叠',
    hint: '两次 subscribe 分别订电网频率和 SOC。切走即 unsubscribe。',
    topics: ['grid.freq', 'batt.soc'],
  },
  {
    key: 'idle',
    tabType: 'points',
    label: 'Idle',
    hint: '只订气温。停在此 Tab 时，别的订阅收报不应增加这张卡片的渲染次数。',
    topics: ['weather.temp'],
  },
  {
    key: 'blank',
    tabType: 'hint',
    label: '空白',
    hint: '此 Tab 不发起任何推送订阅，用来模拟「当前推送场景什么都不订」。切到这里后，推送占用应变为 0、远端应变为否。下方拉取场景若仍停在曲线或自定义，拉取不受影响。',
  },
] as const satisfies readonly PushSceneTab[]

export const PULL_SCENE_TABS = [
  {
    key: 'charts',
    tabType: 'charts',
    label: '曲线',
    hint: '功率 / 电量走势在现场每秒都在变。卡片是 onMessage 送来的 payload；默认每 1 秒再拉。关掉轮询后卡片冻结，下方现场仍会动。',
  },
  {
    key: 'custom',
    tabType: 'custom',
    label: '自定义',
    hint: '默认四次拉取：功率 1 秒与 5 秒、电量 2 秒与只拉一次。同一 topic 取大于 0 的最小间隔。可新增 / 编辑 / 删除，数量不限。切走即 unsubscribe，配置回到这四条。',
  },
  {
    key: 'blank',
    tabType: 'hint',
    label: '空白',
    hint: '此 Tab 不发起任何拉取订阅，用来模拟「当前拉取场景什么都不订」。切到这里后，拉取占用应变为 0、计划清空。上方推送场景若仍停在某个点位 Tab，推送不受影响。',
  },
] as const satisfies readonly PullSceneTab[]

export const DEFAULT_PULL_CUSTOM_ITEMS: readonly PullCustomItem[] = [
  { id: 'power-1s', topic: 'chart.power', pullIntervalMs: 1000 },
  { id: 'power-5s', topic: 'chart.power', pullIntervalMs: 5000 },
  { id: 'energy-2s', topic: 'chart.energy', pullIntervalMs: 2000 },
  { id: 'energy-once', topic: 'chart.energy', pullIntervalMs: 0 },
]

export type PullCustomItem = {
  id: string
  topic: string
  pullIntervalMs: number
}

export type LabTabBase = {
  key: string
  label: string
  hint: string
}

export type PointsTab = LabTabBase & {
  tabType: 'points'
  topics: readonly string[]
}

export type ChartsTab = LabTabBase & {
  tabType: 'charts'
}

export type CustomTab = LabTabBase & {
  tabType: 'custom'
}

export type HintTab = LabTabBase & {
  tabType: 'hint'
}

export type PushSceneTab = PointsTab | HintTab

export type PullSceneTab = ChartsTab | CustomTab | HintTab

export type LabSceneTab = PushSceneTab | PullSceneTab
