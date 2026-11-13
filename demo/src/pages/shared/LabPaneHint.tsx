import { useRef } from 'react'
import { Box, Flex, Text } from 'chakbox-ui'

function LabPaneHint({ hint }: LabPaneHintProps) {
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  return (
    <Flex justifyContent="space-between" alignItems="flex-start" gap={12}>
      <Box>
        <Text color="#666" fontSize={13}>
          {hint}
        </Text>
      </Box>
      <Box flexShrink={0}>
        <Text fontSize={13}>
          渲染 {renderCountRef.current} 次
        </Text>
      </Box>
    </Flex>
  )
}

export { LabPaneHint }

type LabPaneHintProps = {
  hint: string
}
