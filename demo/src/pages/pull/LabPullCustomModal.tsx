import { useCallback } from 'react'
import { Form, Modal, Select, Switch, message } from 'antd'

import { PULL_LAB_DEFS } from '../../features/catalog'
import { PULL_INTERVAL_OPTIONS } from '../constants'
import type { PullCustomItem } from '../constants'
import type { PullCustomDraft, PullCustomFormValues } from './pullCustomItems'
import { toFormValues } from './pullCustomItems'

function LabPullCustomModal({ mode, initialItem, onSubmit, onClose }: LabPullCustomModalProps) {
  const [form] = Form.useForm<PullCustomFormValues>()
  const polling = Form.useWatch('polling', form)

  const handleOk = useCallback(async () => {
    try {
      const values = await form.validateFields()
      if (values.polling && !(typeof values.intervalMs === 'number' && values.intervalMs > 0)) {
        message.error('请选择轮询间隔')
        return
      }
      onSubmit({
        topic: values.topic,
        pullIntervalMs: values.polling ? values.intervalMs : 0,
      })
    } catch {
      return
    }
  }, [form, onSubmit])

  return (
    <Modal
      title={mode === 'add' ? '新增订阅' : '编辑订阅'}
      open
      onOk={() => {
        void handleOk()
      }}
      onCancel={onClose}
      destroyOnHidden
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={toFormValues(initialItem)}
      >
        <Form.Item
          name="topic"
          label="数据"
          rules={[{ required: true, message: '请选择数据' }]}
        >
          <Select options={TOPIC_OPTIONS} />
        </Form.Item>
        <Form.Item name="polling" label="启用轮询" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="intervalMs" label="轮询间隔">
          <Select
            disabled={polling === false}
            options={PULL_INTERVAL_OPTIONS.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export { LabPullCustomModal }

type LabPullCustomModalProps = {
  mode: 'add' | 'edit'
  initialItem: PullCustomItem | undefined
  onSubmit: (draft: PullCustomDraft) => void
  onClose: () => void
}

const TOPIC_OPTIONS = PULL_LAB_DEFS.map((def) => ({
  label: def.label,
  value: def.topic,
}))
