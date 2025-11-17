/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button, Paper, CircularProgress } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import tw, { styled } from "twin.macro"
import { Calendar } from "@/design-system/components"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import dayjs from "dayjs"
import { useReservationControllerGetReservationSlotsByMonth } from "@/lib/orval/reservations/reservations"
import { useCloseDayControllerFindMany } from "@/lib/orval/close-days/close-days"
import { ReservationCountByDatetimeResultDto } from "@/lib/orval/model"

const Row = tw.div`flex border-b items-center h-16 last:border-0`
const Time = tw.div`w-20 border-r border-[#ddd] h-full`
const Item = tw.div`flex-1 border-r border-[#ddd] h-full last:border-0`
const center = tw`flex items-center justify-center`
const HeaderItem = styled(Item)([center, tw`text-md font-bold`])

const Slot = tw.div`h-8 leading-8 first:bg-yellow-300 last:bg-orange-300 tracking-widest`

const CalendarView = ({ onSlotClick }: { onSlotClick: (day: any, time: any) => void }) => {
  const [date, setDate] = useState(dayjs())
  const {
    data: reservationCounts,
    refetch,
    isLoading,
  } = useReservationControllerGetReservationSlotsByMonth({
    year: date.year(),
    month: date.month() + 1,
  })

  const { data: closeDays } = useCloseDayControllerFindMany({ limit: 1000 })

  const times = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  const handleSlotClick = (
    day: dayjs.Dayjs,
    time: number,
    slot: ReservationCountByDatetimeResultDto | undefined,
    thirty: boolean,
  ) => {
    // 해당 타임슬롯 시간을 KST로 변경 후 reservation-view 에서 사용할 수 있도록 전달
    if (slot?.datetime.endsWith("Z")) {
      onSlotClick(day, `${slot?.datetime.slice(0, -1)}+09:00`)
    } else {
      onSlotClick(day, slot?.datetime)
    }
  }

  return (
    <Box tw="flex gap-4 mt-8">
      <Box tw="mt-16">
        <Calendar
          value={date}
          onChange={(newDate) => {
            if (newDate) {
              setDate(newDate)
            }
          }}
        />
      </Box>
      <Box tw="flex-1 overflow-hidden">
        {isLoading && ( // Show overlay with loading spinner
          <Box
            tw="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50"
            style={{ backdropFilter: "blur(8px)" }}>
            <CircularProgress />
          </Box>
        )}
        <Typography variant="h3">확정+대기 / 대기 / 전체 현황</Typography>
        <Box tw="flex gap-2 items-center mt-4">
          <Button
            color="inherit"
            tw="p-[8px] min-w-0"
            variant="outlined"
            onClick={() => {
              setDate(date.subtract(1, "month"))
            }}>
            <KeyboardArrowLeft />
          </Button>
          <Button
            color="inherit"
            tw="p-[8px] min-w-0"
            variant="outlined"
            onClick={() => {
              setDate(date.add(1, "month"))
            }}>
            <KeyboardArrowRight />
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => {
              setDate(dayjs())
            }}>
            오늘
          </Button>
          <Typography variant="h3">{date.format("YYYY년 MM월")}</Typography>
        </Box>
        <Paper tw="mt-4 mb-8 w-full border border-[#ddd] text-center text-sm overflow-hidden">
          <div tw="overflow-auto">
            <div tw="min-w-[68rem]">
              <Row>
                <Time></Time>
                {Array.from({ length: 7 }).map((_, i) => {
                  const day = date.clone().startOf("week").add(i, "day").locale("ko")
                  const selected = date.isSame(day, "day")
                  return (
                    <HeaderItem key={i} css={selected && tw`text-blue-500`}>
                      {day.format("D일 dd")}
                    </HeaderItem>
                  )
                })}
              </Row>

              <Row>
                <Time></Time>
                <Item css={center}>휴무일</Item>
                {Array.from({ length: 6 }).map((_, i) => {
                  if (closeDays && closeDays.items.length > 0) {
                    const day = date
                      .clone()
                      .startOf("week")
                      .add(i + 1, "day")
                      .locale("ko")
                    const closed = closeDays.items.some((closeDay) =>
                      day.isSame(dayjs(closeDay.date), "day"),
                    )
                    return (
                      <Item css={center} key={i}>
                        {closed ? "휴무일" : ""}
                      </Item>
                    )
                  }
                  return <Item css={center} key={i}></Item>
                })}
              </Row>

              {times.map((time) => {
                const timeString = time.toString()
                const timeStringPlusOne = (time + 1).toString()
                return (
                  <Row key={time}>
                    <Time
                      css={{
                        ...center,
                        fontSize: "0.65rem",
                      }}>{`${timeString}:00~${timeString}:30\n${timeString}:30~${timeStringPlusOne}:00`}</Time>
                    <Item></Item>
                    {Array.from({ length: 6 }).map((_, i) => {
                      const day = date
                        .clone()
                        .startOf("week")
                        .add(i + 1, "day")
                        .locale("ko")
                      const reservationCount = reservationCounts?.find((item) => {
                        return day.isSame(item.day, "day")
                      })
                      if (reservationCount && !reservationCount.isClosed) {
                        const reservationSlots = reservationCount.slots.filter((slot) => {
                          const slotHour = parseInt(slot.datetime.split("T")[1].split(":")[0], 10)

                          return slotHour === time
                        })
                        if (reservationSlots.length > 0) {
                          const mainZeroMinuteSlot = reservationSlots.find(
                            (slot) =>
                              slot.building === "BUILDING_1" &&
                              dayjs(slot.datetime).locale("ko").get("minute") === 0,
                          )
                          const mainThirtyMinuteSlot = reservationSlots.find(
                            (slot) =>
                              slot.building === "BUILDING_1" &&
                              dayjs(slot.datetime).locale("ko").get("minute") === 30,
                          )
                          // const newZeroMinuteSlot = reservationSlots.find(
                          //   (slot) =>
                          //     slot.building === "BUILDING_2" &&
                          //     dayjs(slot.datetime).locale("ko").get("minute") === 0,
                          // )
                          // const newThirtyMinuteSlot = reservationSlots.find(
                          //   (slot) =>
                          //     slot.building === "BUILDING_2" &&
                          //     dayjs(slot.datetime).locale("ko").get("minute") === 30,
                          // )
                          // const buildingThreeZeroMinuteSlot = reservationSlots.find(
                          //   (slot) =>
                          //     slot.building === "BUILDING_3" &&
                          //     dayjs(slot.datetime).locale("ko").get("minute") === 0,
                          // )
                          // const buildingThreeThirtyMinuteSlot = reservationSlots.find(
                          //   (slot) =>
                          //     slot.building === "BUILDING_3" &&
                          //     dayjs(slot.datetime).locale("ko").get("minute") === 30,
                          // )
                          return (
                            <Item key={i}>
                              <Slot>
                                <span
                                  onClick={() =>
                                    handleSlotClick(day, time, mainZeroMinuteSlot, false)
                                  }>
                                  {mainZeroMinuteSlot ? (
                                    <>
                                      <span
                                        style={{
                                          color:
                                            mainZeroMinuteSlot.reservationCount >=
                                            mainZeroMinuteSlot.maxSlot
                                              ? "red"
                                              : "inherit",
                                        }}>
                                        {mainZeroMinuteSlot.reservationCount}
                                      </span>
                                      /{mainZeroMinuteSlot.waitingReservationCount}/
                                      {mainZeroMinuteSlot.maxSlot}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </span>
                                {/* &nbsp;
                                <span
                                  style={{ backgroundColor: "#FDAB78" }} // same as tw="bg-orange-300"
                                  onClick={() =>
                                    handleSlotClick(day, time, newZeroMinuteSlot, false)
                                  }>
                                  {newZeroMinuteSlot && (
                                    <>
                                      <span
                                        style={{
                                          color:
                                            newZeroMinuteSlot.reservationCount >=
                                            newZeroMinuteSlot.maxSlot
                                              ? "red"
                                              : "inherit",
                                        }}>
                                        {newZeroMinuteSlot.reservationCount}
                                      </span>
                                      /{newZeroMinuteSlot.waitingReservationCount}/
                                      {newZeroMinuteSlot.maxSlot}
                                    </>
                                  )}
                                </span>
                                &nbsp;
                                <span
                                  style={{ backgroundColor: "#86EFAC" }} // equivalent to tw="bg-green-300"
                                  onClick={() =>
                                    handleSlotClick(day, time, buildingThreeZeroMinuteSlot, false)
                                  }>
                                  {buildingThreeZeroMinuteSlot && (
                                    <>
                                      <span
                                        style={{
                                          color:
                                            buildingThreeZeroMinuteSlot.reservationCount >=
                                            buildingThreeZeroMinuteSlot.maxSlot
                                              ? "red"
                                              : "inherit",
                                        }}>
                                        {buildingThreeZeroMinuteSlot.reservationCount}
                                      </span>
                                      /{buildingThreeZeroMinuteSlot.waitingReservationCount}/
                                      {buildingThreeZeroMinuteSlot.maxSlot}
                                    </>
                                  )}
                                </span> */}
                              </Slot>
                              <Slot>
                                <span
                                  onClick={() =>
                                    handleSlotClick(day, time, mainThirtyMinuteSlot, true)
                                  }>
                                  {mainThirtyMinuteSlot && (
                                    <>
                                      <span
                                        style={{
                                          color:
                                            mainThirtyMinuteSlot.reservationCount >=
                                            mainThirtyMinuteSlot.maxSlot
                                              ? "red"
                                              : "inherit",
                                        }}>
                                        {mainThirtyMinuteSlot.reservationCount}
                                      </span>
                                      /{mainThirtyMinuteSlot.waitingReservationCount}/
                                      {mainThirtyMinuteSlot.maxSlot}
                                    </>
                                  )}
                                </span>
                                {/* &nbsp;
                                <span
                                  style={{ backgroundColor: "#FCD34D" }} // equivalent to tw="bg-yellow-300"
                                  onClick={() =>
                                    handleSlotClick(day, time, newThirtyMinuteSlot, true)
                                  }>
                                  {newThirtyMinuteSlot && (
                                    <>
                                      <span
                                        style={{
                                          color:
                                            newThirtyMinuteSlot.reservationCount >=
                                            newThirtyMinuteSlot.maxSlot
                                              ? "red"
                                              : "inherit",
                                        }}>
                                        {newThirtyMinuteSlot.reservationCount}
                                      </span>
                                      /{newThirtyMinuteSlot.waitingReservationCount}/
                                      {newThirtyMinuteSlot.maxSlot}
                                    </>
                                  )}
                                </span>
                                &nbsp;
                                <span
                                  style={{ backgroundColor: "#FCD34D" }} // equivalent to tw="bg-yellow-300"
                                  onClick={() =>
                                    handleSlotClick(day, time, buildingThreeThirtyMinuteSlot, true)
                                  }>
                                  {buildingThreeThirtyMinuteSlot && (
                                    <>
                                      <span
                                        style={{
                                          color:
                                            buildingThreeThirtyMinuteSlot.reservationCount >=
                                            buildingThreeThirtyMinuteSlot.maxSlot
                                              ? "red"
                                              : "inherit",
                                        }}>
                                        {buildingThreeThirtyMinuteSlot.reservationCount}
                                      </span>
                                      /{buildingThreeThirtyMinuteSlot.waitingReservationCount}/
                                      {buildingThreeThirtyMinuteSlot.maxSlot}
                                    </>
                                  )}
                                </span> */}
                              </Slot>
                            </Item>
                          )
                        }
                      }
                      return <Item key={i}></Item>
                    })}
                  </Row>
                )
              })}
            </div>
          </div>
        </Paper>
      </Box>
    </Box>
  )
}

export default CalendarView
