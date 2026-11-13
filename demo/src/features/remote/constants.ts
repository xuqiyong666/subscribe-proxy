export const PULL_HTTP_DELAY_MIN_MS = 120 as const
export const PULL_HTTP_DELAY_MAX_MS = 400 as const

/** 模拟重复报文：value 与 updatedAt 都不变，put 应跳过通知 */
export const DUPLICATE_MESSAGE_CHANCE = 0.12 as const
