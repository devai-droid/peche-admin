import React from "react"
import ClosedDayWrapper from "./closed-day-wrapper.component"
import { Button, Checkbox, OutlinedInput, Typography } from "@mui/material"
import { CloseDay, SpecificDate } from "@/lib/orval/model"
import dayjs from "dayjs"
import { useCloseDayControllerRemove } from "@/lib/orval/close-days/close-days"
import { useSpecificDateControllerRemove } from "@/lib/orval/specific-date/specific-date"

type DayType = "closeDay" | "specificDate"

interface Props {
  closeDay?: CloseDay | undefined
  specificDate?: SpecificDate | undefined
  editHandler?: (specificDate: SpecificDate) => void | null
  refetchCloseDays?: () => void
  refetchSpecificDates?: () => void
}

const ClosedDay = ({
  closeDay,
  specificDate,
  editHandler,
  refetchCloseDays,
  refetchSpecificDates,
}: Props) => {
  const [dayType, setDayType] = React.useState<DayType>(closeDay ? "closeDay" : "specificDate")
  const { mutateAsync: removeCloseDay } = useCloseDayControllerRemove()
  const { mutateAsync: removeSpecificDate } = useSpecificDateControllerRemove()

  const sx = {
    p: 0,
    "& input": {
      py: 0,
      px: 2,
      height: "2rem",
    },
  }

  const date = closeDay?.date || specificDate?.date || ""
  const memo = closeDay?.memo || specificDate?.memo || ""

  const onClickRemove = async () => {
    if (dayType === "closeDay" && closeDay) {
      await removeCloseDay({ id: closeDay?.id })
      if (refetchCloseDays) {
        refetchCloseDays()
      }
    }
    if (dayType === "specificDate" && specificDate) {
      await removeSpecificDate({ id: specificDate?.id })
      if (refetchSpecificDates) {
        refetchSpecificDates()
      }
    }
  }

  const onClickEdit = () => {
    if (editHandler) {
      editHandler(specificDate as SpecificDate)
    }
  }

  return (
    <ClosedDayWrapper>
      <div tw="flex items-center gap-1">
        <Checkbox />
        <Typography>{dayType === "closeDay" ? "휴무일" : "특정일 예약시간"}</Typography>
      </div>
      <div tw="flex gap-1">
        <OutlinedInput
          sx={sx}
          type="date"
          placeholder="날짜를 입력해주세요."
          value={dayjs(date).format("YYYY-MM-DD")}
          disabled
        />
        <OutlinedInput
          sx={sx}
          type="text"
          placeholder="메모를 입력해주세요."
          value={memo}
          disabled
        />
        <Button size="small" sx={sx} variant="outlined" color="error" onClick={onClickRemove}>
          삭제
        </Button>
        {specificDate && (
          <Button
            size="small"
            sx={{ ...sx, px: 2 }}
            variant="outlined"
            color="inherit"
            onClick={onClickEdit}>
            설정보기
          </Button>
        )}
      </div>
    </ClosedDayWrapper>
  )
}

export default ClosedDay
