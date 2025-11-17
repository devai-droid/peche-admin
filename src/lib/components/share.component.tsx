import { Tooltip } from "@mui/material"
import React from "react"

interface Props {
  children: (clickHandler: () => void) => React.ReactElement
  copyText: string
}

const Share = ({ children, copyText }: Props) => {
  const [showCopiedTooltip, setShowCopiedTooltip] = React.useState(false)
  return (
    <Tooltip
      title="클립보드에 복사되었습니다"
      PopperProps={{
        disablePortal: true,
      }}
      placement="top"
      disableHoverListener
      open={showCopiedTooltip}>
      {children(() => {
        navigator.clipboard.writeText(copyText)
        setShowCopiedTooltip(true)
        setTimeout(() => {
          setShowCopiedTooltip(false)
        }, 2000)
      })}
    </Tooltip>
  )
}

export default Share
