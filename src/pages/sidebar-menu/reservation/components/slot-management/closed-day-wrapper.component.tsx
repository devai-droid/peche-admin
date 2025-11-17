import React from "react"

interface Props {
  children: React.ReactNode[]
}

const ClosedDayWrapper = ({ children }: Props) => {
  return (
    <div tw="border border-[#333] h-10 rounded-md">
      <div tw="h-full flex items-center">
        <div tw="py-1 px-2 h-full w-48 border-r border-[#333] flex items-center">{children[0]}</div>
        <div tw="py-1 px-2 h-full flex-1 flex items-center">{children[1]}</div>
      </div>
    </div>
  )
}

export default ClosedDayWrapper
