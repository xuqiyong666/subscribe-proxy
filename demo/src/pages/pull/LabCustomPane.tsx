import React, { useCallback, useState } from 'react'
import { Box, Flex, Text } from 'chakbox-ui'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { DEFAULT_PULL_CUSTOM_ITEMS } from '../constants'
import type { PullCustomItem } from '../constants'
import { LabPaneHint } from '../shared/LabPaneHint'
import { MemoLabPullCustomCard } from './LabPullCustomCard'
import { LabPullCustomModal } from './LabPullCustomModal'
import {
  applyDraft,
  cloneItem,
  findEditingItem,
} from './pullCustomItems'
import type { PullCustomDraft, PullCustomEditorState } from './pullCustomItems'

function LabCustomPane({ hint }: LabCustomPaneProps) {
  const [items, setItems] = useState<PullCustomItem[]>(() => DEFAULT_PULL_CUSTOM_ITEMS.map(cloneItem))
  const [editor, setEditor] = useState<PullCustomEditorState>(null)

  const handleAdd = useCallback(() => {
    setEditor({ mode: 'add' })
  }, [])

  const handleEdit = useCallback((id: string) => {
    setEditor({ mode: 'edit', id })
  }, [])

  const handleDelete = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const handleCloseEditor = useCallback(() => {
    setEditor(null)
  }, [])

  const handleSubmit = useCallback((draft: PullCustomDraft) => {
    setItems((current) => applyDraft(current, editor, draft))
    setEditor(null)
  }, [editor])

  const editingItem = findEditingItem(items, editor)

  const renderHint = () => <LabPaneHint hint={hint} />

  const renderToolbar = () => (
    <Flex justifyContent="flex-end" marginTop={16}>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        新增
      </Button>
    </Flex>
  )

  const renderCards = () => {
    if (items.length === 0) {
      return (
        <Box marginTop={16}>
          <Text fontSize={13} color="#999">
            暂无订阅
          </Text>
        </Box>
      )
    }

    return (
      <Box marginTop={16} display="flex" flexDirection="column" gap={12}>
        {items.map((item) => (
          <MemoLabPullCustomCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Box>
    )
  }

  return (
    <Box padding={16}>
      {renderHint()}
      {renderToolbar()}
      {renderCards()}
      {editor ? (
        <LabPullCustomModal
          mode={editor.mode}
          initialItem={editingItem}
          onSubmit={handleSubmit}
          onClose={handleCloseEditor}
        />
      ) : null}
    </Box>
  )
}

const MemoLabCustomPane = React.memo(LabCustomPane)

export { LabCustomPane, MemoLabCustomPane }

type LabCustomPaneProps = {
  hint: string
}
