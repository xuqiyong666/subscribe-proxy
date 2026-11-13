import { PULL_LAB_DEFS } from '../../features/catalog'
import { DEFAULT_PULL_INTERVAL_MS } from '../constants'
import type { PullCustomItem } from '../constants'

export function cloneItem(item: PullCustomItem): PullCustomItem {
  return {
    id: item.id,
    topic: item.topic,
    pullIntervalMs: item.pullIntervalMs,
  }
}

export function findEditingItem(
  items: readonly PullCustomItem[],
  editor: PullCustomEditorState,
): PullCustomItem | undefined {
  if (!editor || editor.mode !== 'edit') {
    return undefined
  }
  return items.find((item) => item.id === editor.id)
}

export function applyDraft(
  items: PullCustomItem[],
  editor: PullCustomEditorState,
  draft: PullCustomDraft,
): PullCustomItem[] {
  if (!editor) {
    return items
  }
  if (editor.mode === 'add') {
    return [
      ...items,
      {
        id: crypto.randomUUID(),
        topic: draft.topic,
        pullIntervalMs: draft.pullIntervalMs,
      },
    ]
  }
  return items.map((item) => {
    if (item.id !== editor.id) {
      return item
    }
    return {
      ...item,
      topic: draft.topic,
      pullIntervalMs: draft.pullIntervalMs,
    }
  })
}

export function toFormValues(item: PullCustomItem | undefined): PullCustomFormValues {
  if (!item) {
    return {
      topic: PULL_LAB_DEFS[0]?.topic ?? '',
      polling: true,
      intervalMs: DEFAULT_PULL_INTERVAL_MS,
    }
  }
  if (item.pullIntervalMs > 0) {
    return {
      topic: item.topic,
      polling: true,
      intervalMs: item.pullIntervalMs,
    }
  }
  return {
    topic: item.topic,
    polling: false,
    intervalMs: DEFAULT_PULL_INTERVAL_MS,
  }
}

export type PullCustomDraft = {
  topic: string
  pullIntervalMs: number
}

export type PullCustomEditorState =
  | null
  | { mode: 'add' }
  | { mode: 'edit', id: string }

export type PullCustomFormValues = {
  topic: string
  polling: boolean
  intervalMs: number
}
