import { Tag } from 'antd'

import type { SPMethod } from 'subscribe-proxy'

function LabMethodTag({ method }: LabMethodTagProps) {
  if (method === 'push') {
    return <Tag color="blue">推送</Tag>
  }
  return <Tag color="green">拉取</Tag>
}

export { LabMethodTag }

type LabMethodTagProps = {
  method: SPMethod
}
