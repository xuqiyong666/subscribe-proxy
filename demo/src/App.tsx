import { useMemo } from 'react'
import { Box, Flex, Text } from 'chakbox-ui'
import { Tabs } from 'antd'

import { PULL_SCENE_TABS, PUSH_SCENE_TABS } from './pages/constants'
import { LabDebugPanel } from './pages/debug/LabDebugPanel'
import { renderLabTab } from './pages/shared/renderLabTab'

export default function App() {
  const pushTabItems = useMemo(
    () => PUSH_SCENE_TABS.map((tab) => ({
      key: tab.key,
      label: tab.label,
      children: renderLabTab(tab),
    })),
    [],
  )

  const pullTabItems = useMemo(
    () => PULL_SCENE_TABS.map((tab) => ({
      key: tab.key,
      label: tab.label,
      children: renderLabTab(tab),
    })),
    [],
  )

  return (
    <Box minHeight="100vh" background="#f5f5f5" display="flex" flexDirection="column">
      <Box
        height={40}
        padding="0 16px"
        display="flex"
        alignItems="center"
        background="#fff"
        borderBottomWidth="1px"
        borderBottomColor="#f0f0f0"
        flexShrink={0}
      >
        <Text fontSize={14} fontWeight={600}>
          subscribe-proxy
        </Text>
      </Box>

      <Flex
        flex={1}
        gap={16}
        padding={16}
        maxWidth={1280}
        width="100%"
        margin="0 auto"
        boxSizing="border-box"
        alignItems="flex-start"
      >
        <Box flex={1} minWidth={0} display="flex" flexDirection="column" gap={16}>
          <Box background="#fff" borderRadius={8} overflow="hidden">
            <Box padding="12px 16px 0">
              <Text fontSize={16} fontWeight={600}>
                推送场景
              </Text>
            </Box>
            <Tabs
              defaultActiveKey="grid"
              destroyOnHidden
              styles={{ header: { paddingInline: 16 } }}
              items={pushTabItems}
            />
          </Box>
          <Box background="#fff" borderRadius={8} overflow="hidden">
            <Box padding="12px 16px 0">
              <Text fontSize={16} fontWeight={600}>
                拉取场景
              </Text>
            </Box>
            <Tabs
              defaultActiveKey="charts"
              destroyOnHidden
              styles={{ header: { paddingInline: 16 } }}
              items={pullTabItems}
            />
          </Box>
        </Box>
        <LabDebugPanel />
      </Flex>
    </Box>
  )
}
