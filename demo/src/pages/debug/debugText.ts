import { findLabDataDef } from '../../features/catalog'

export function labelOf(topic: string): string {
  return findLabDataDef(topic)?.label ?? topic
}

export function yesNo(value: boolean): string {
  if (value) {
    return '是'
  }
  return '否'
}
