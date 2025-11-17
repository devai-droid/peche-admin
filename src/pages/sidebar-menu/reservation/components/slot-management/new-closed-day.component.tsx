import React from "react"
import ClosedDayWrapper from "./closed-day-wrapper.component"
import { Button, MenuItem, OutlinedInput, Select } from "@mui/material"
import { useCloseDayControllerCreate } from "@/lib/orval/close-days/close-days"
import { useSpecificDateControllerCreate } from "@/lib/orval/specific-date/specific-date"

type DayType = "closeDay" | "specificDate"

interface NewClosedDayProps {
  refetchCloseDays?: () => void
  refetchSpecificDates?: () => void
}

const NewClosedDay = ({ refetchCloseDays, refetchSpecificDates }: NewClosedDayProps) => {
  const [dayType, setDayType] = React.useState<DayType>("closeDay")
  const [date, setDate] = React.useState<string>("")
  const [memo, setMemo] = React.useState<string>("")
  const { mutateAsync: createCloseDay } = useCloseDayControllerCreate()
  const { mutateAsync: createSpecificDate } = useSpecificDateControllerCreate()

  const sx = {
    p: 0,
    "& input": {
      py: 0,
      px: 2,
      height: "2rem",
    },
  }

  const onClickSave = async () => {
    if (dayType === "closeDay") {
      await createCloseDay({ data: { date, memo } })
      if (refetchCloseDays) {
        refetchCloseDays()
      }
    }
    if (dayType === "specificDate") {
      await createSpecificDate({
        data: {
          date,
          memo,
          slots: [],
        },
      })
      if (refetchSpecificDates) {
        refetchSpecificDates()
      }
    }
  }

  return (
    <ClosedDayWrapper>
      <Select
        fullWidth
        sx={{ ...sx, height: "100%" }}
        value={dayType}
        onChange={(e) => setDayType(e.target.value as DayType)}>
        <MenuItem value="closeDay">휴무일 등록</MenuItem>
        <MenuItem value="specificDate">특정일 예약시간</MenuItem>
      </Select>
      <div tw="flex gap-1">
        <OutlinedInput
          sx={sx}
          type="date"
          placeholder="휴무일을 입력해주세요."
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
          }}
        />
        <OutlinedInput
          sx={sx}
          type="text"
          placeholder="메모를 입력해주세요."
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value)
          }}
        />
        <Button size="small" sx={sx} variant="outlined" onClick={onClickSave}>
          저장
        </Button>
      </div>
    </ClosedDayWrapper>
  )
}

export default NewClosedDay
