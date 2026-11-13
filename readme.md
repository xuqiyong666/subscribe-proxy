# subscribe-proxy

客户端最新值缓存 + I/O 占用，不是 broker。与 React 无关。

内部是两套互不干扰的引擎：`PushEngine` 与 `PullEngine`。每套按 `topic` 缓存最新一份 `SPPayload`，占用归零即丢掉。同一 topic 可以有多份 `subscription` 占用；`subscription` 对象就是占用身份。

Push 的 `put` 通知每一位占用者。Pull 里 `pullIntervalMs > 0` 的占用每次 `put` 都通知；省略或 `≤0` 只收第一帧（缓存回放或之后第一次成功的 `put`），后续 `put` 不再推给这份占用。

## 安装

```bash
npm install subscribe-proxy
```

本地联调可用 `file:` 协议指向本仓库。

## 用法

```ts
import { createSubscribeProxy } from 'subscribe-proxy'

const proxy = createSubscribeProxy({ dataSource })

const subscription = proxy.subscribe({
  topic: 'chart.power',
  method: 'pull',
  pullIntervalMs: 1000,
  onMessage: (payload) => {
    console.log(payload.data, payload.updatedAt)
  },
})

subscription.unsubscribe()
proxy.dispose()
```

一次 `subscribe` 只订一个 `topic`。`method` 决定进哪套引擎。成功且该 topic 仍有占用（因而仍有缓存）时，立刻 `onMessage` 一次当前值。之后每次 `put` 再调一次。没有读口：数据只从 `onMessage` 来。`method` 不是 `push` / `pull` 会抛错。空 `topic` 返回空订阅，不占位、不开 I/O。

## DataSource

调用方提供同一个 `dataSource`，两套引擎各取所需：

```ts
type SPDataSource = {
  subscribe: (topic: string, onMessage: (payload: SPPayload) => void) => () => void
  fetch: (topic: string) => Promise<SPPayload>
}

type SPPayload = {
  data: unknown
  updatedAt: number
}
```

Push 只用 `subscribe`（一次一个 topic），Pull 只用 `fetch`。某 topic 占用从 0→1 才开 I/O，最后一份退订才停 I/O 并丢掉缓存；第二份占用不重绑远端。`put` 写入缓存时不做相等跳过、不做浅拷贝；写入后把 payload 当不可变。无人占用时迟到的 `put` 直接丢弃。

## Pull 间隔

`pullIntervalMs` 只属于 pull 请求。省略或 `≤0` 只拉一次、不轮询，且 `onMessage` 只收第一帧。同一 topic 多份 pull 占用时，按大于 0 的最小间隔拉。

## 结构

```
Client  -- proxy.subscribe({ method, topic }) -->  SubscribeProxy
                                                    PushEngine  -- dataSource.subscribe(topic)
                                                    PullEngine  -- dataSource.fetch(topic)
```

同一 `topic` 可以同时存在于两套引擎，互不覆盖。

## 观察面

业务页不要碰。调试可先取内部引擎：

```ts
const { pushEngine, pullEngine } = proxy.getInternal()

const stop = pushEngine.watch((event) => {
  // put | subscribe | unsubscribe | remote-start | remote-stop | pull-plan
})

const state = pullEngine.getDebugState()
// 直接返回内部表，不复制：payloads / occupancy / applied / epochs / waitingTopics
```

`watch` 返回取消函数。`getDebugState()` 返回的 Map / Set 是引擎内部引用。

## 构建

```bash
npm install
npm run build
```

## 示例

`demo/` 是独立 Vite 应用，不随包发布。改库可直接热更新：

```bash
npm run demo
```
