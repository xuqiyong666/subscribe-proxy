import { Box } from 'chakbox-ui'

import { LabPullShelfDebugCard } from './LabPullShelfDebugCard'
import { LabPushShelfDebugCard } from './LabPushShelfDebugCard'
import { LabUpstreamDebugCard } from './LabUpstreamDebugCard'

function LabDebugPanel() {
  return (
    <Box width={500} flexShrink={0} display="flex" flexDirection="column" gap={12}>
      <LabPushShelfDebugCard />
      <LabPullShelfDebugCard />
      <LabUpstreamDebugCard />
    </Box>
  )
}

export { LabDebugPanel }
