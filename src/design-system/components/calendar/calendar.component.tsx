/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react"
import { LocalizationProvider, DateCalendar, DateCalendarProps } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/ko"

export interface CalendarProp extends DateCalendarProps<Dayjs> {
  disabledDate?: Array<string>
  footer?: React.ReactNode
}

const Calendar = ({ disabledDate, footer, ...props }: CalendarProp) => {
  const disabledDates = useMemo(
    () => disabledDate?.map((date) => dayjs(date)) || [],
    [disabledDate],
  )

  return (
    <div tw="border border-[#ddd] rounded-lg">
      <LocalizationProvider
        adapterLocale="ko"
        dateAdapter={AdapterDayjs}
        dateFormats={{
          monthAndYear: "YYYY년 MM월",
        }}>
        <DateCalendar
          disableHighlightToday
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          shouldDisableDate={(date: Dayjs) =>
            disabledDates.some((dateFromProp) => dayjs(dateFromProp).isSame(date, "day"))
          }
          {...props}
        />
      </LocalizationProvider>
      {footer && <div tw="border-t border-[#ddd]">{footer}</div>}
    </div>
  )
}

export default Calendar
