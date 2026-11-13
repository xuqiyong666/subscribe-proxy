import React from 'react'
import { Box } from 'chakbox-ui'

import { LabPaneHint } from './LabPaneHint'

function LabHintPane({ hint }: LabHintPaneProps) {
  return (
    <Box padding={16}>
      <LabPaneHint hint={hint} />
    </Box>
  )
}

const MemoLabHintPane = React.memo(LabHintPane)

export { LabHintPane, MemoLabHintPane }

type LabHintPaneProps = {
  hint: string
}
