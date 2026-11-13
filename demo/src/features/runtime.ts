import { createSubscribeProxy } from 'subscribe-proxy'

import { createMockDataSource } from './remote/createMockDataSource'
import { createDataSourceUpstream } from './upstream/createDataSourceUpstream'

export const dataSourceUpstream = createDataSourceUpstream()
export const dataSource = createMockDataSource(dataSourceUpstream)
export const proxy = createSubscribeProxy({ dataSource })
