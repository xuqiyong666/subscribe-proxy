import { methodOf } from './helpers'
import { createPullEngine } from './pull/createPullEngine'
import { createPushEngine } from './push/createPushEngine'
import type {
  CreateSubscribeProxyOptions,
  SPOnMessage,
  SPSubscribeRequest,
  TSubscribeProxy,
} from './types'

export function createSubscribeProxy(options: CreateSubscribeProxyOptions): TSubscribeProxy {
  const pushEngine = createPushEngine(options.dataSource)
  const pullEngine = createPullEngine(options.dataSource)

  const subscribe = <TData = unknown>(request: SPSubscribeRequest<TData>) => {
    if (request.method === 'push') {
      return pushEngine.subscribe({
        topic: request.topic,
        onMessage: request.onMessage as SPOnMessage | undefined,
      })
    }
    if (request.method === 'pull') {
      return pullEngine.subscribe({
        topic: request.topic,
        pullIntervalMs: request.pullIntervalMs,
        onMessage: request.onMessage as SPOnMessage | undefined,
      })
    }
    throw new Error(`subscribe-proxy: unsupported method ${methodOf(request)}`)
  }

  const dispose = () => {
    pushEngine.dispose()
    pullEngine.dispose()
  }

  const internal = {
    pushEngine,
    pullEngine,
  }

  const getInternal = () => internal

  return {
    subscribe,
    dispose,
    getInternal,
  }
}
