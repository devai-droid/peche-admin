import React from "react"
import tw from "twin.macro"
import Icon from "../../icon/icon.component"
import Typography from "../../typography/typography.component"
import { CloseIcon } from "@/assets/icon"

const Item = tw.div`bg-point rounded-full flex flex-row items-center w-fit px-2 flex-shrink-0`
const ItemText = tw(Typography)`py-1.5 pl-2`
const IconWrapper = tw.div`w-[1.125rem] h-[1.125rem] rounded-full bg-[#8E1E2A] flex justify-center items-center`

const Chip = ({ onClick, text }: { onClick?: () => void; text: string }) => (
  <Item>
    <ItemText type="text" size="md" css={!onClick && tw`pr-2`}>
      {text}
    </ItemText>
    {onClick && (
      <button type="button" tw="py-1.5 px-2" onClick={onClick}>
        <IconWrapper>
          <Icon icon={CloseIcon} size={10} />
        </IconWrapper>
      </button>
    )}
  </Item>
)

export default Chip
