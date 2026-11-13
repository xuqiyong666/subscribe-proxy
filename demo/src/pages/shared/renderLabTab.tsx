import type { LabSceneTab } from '../constants'
import { MemoLabHintPane } from './LabHintPane'
import { MemoLabChartsPane } from '../pull/LabChartsPane'
import { MemoLabCustomPane } from '../pull/LabCustomPane'
import { MemoLabTabPane } from '../push/LabTabPane'

export function renderLabTab(tab: LabSceneTab) {
  switch (tab.tabType) {
    case 'points':
      return <MemoLabTabPane tab={tab} />
    case 'charts':
      return <MemoLabChartsPane hint={tab.hint} />
    case 'custom':
      return <MemoLabCustomPane hint={tab.hint} />
    case 'hint':
      return <MemoLabHintPane hint={tab.hint} />
  }
}
