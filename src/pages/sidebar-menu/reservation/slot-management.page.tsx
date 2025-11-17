/* eslint-disable no-alert */
import { Button, Drawer, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import NewClosedDay from "./components/slot-management/new-closed-day.component"
import ClosedDay from "./components/slot-management/closed-day.component"
import { useState } from "react"
import tw from "twin.macro"
import { useCloseDayControllerFindMany } from "@/lib/orval/close-days/close-days"
import {
  useSpecificDateControllerFindMany,
  useSpecificDateControllerUpdate,
} from "@/lib/orval/specific-date/specific-date"
import {
  CreateReservationSlotDto,
  CreateSpecificDateSlotDto,
  SpecificDate,
} from "@/lib/orval/model"
import dayjs from "dayjs"
import {
  useReservationSlotControllerCreateOrUpdate,
  useReservationSlotControllerFindMany,
} from "@/lib/orval/reservation-slots/reservation-slots"

type Building = "BUILDING_1" | "BUILDING_2" | "BUILDING_3"

const row = tw`grid gap-2 grid-cols-8`
const item = tw`border border-black py-1 text-center`
const headerItems = tw`[&>*]:bg-[#ddd]`
const bodyItems = tw`[&>*]:bg-white`

interface TableProps {
  building: Building
  changedSlots: CreateReservationSlotDto[]
  setChangedSlots: (slots: CreateReservationSlotDto[]) => void
}

const Table = ({ building, changedSlots, setChangedSlots }: TableProps) => {
  const defaultTimes = [
    "10:00 ~ 10:30",
    "10:30 ~ 11:00",
    "11:00 ~ 11:30",
    "11:30 ~ 12:00",
    "12:00 ~ 12:30",
    "12:30 ~ 13:00",
    "13:00 ~ 13:30",
    "13:30 ~ 14:00",
    "14:00 ~ 14:30",
    "14:30 ~ 15:00",
    "15:00 ~ 15:30",
    "15:30 ~ 16:00",
    "16:00 ~ 16:30",
    "16:30 ~ 17:00",
    "17:00 ~ 17:30",
    "17:30 ~ 18:00",
    "18:00 ~ 18:30",
    "18:30 ~ 19:00",
    "19:00 ~ 19:30",
    "19:30 ~ 20:00",
    "20:00 ~ 20:30",
    "20:30 ~ 21:00",
  ]
  const dayOfWeeks = [
    { key: "MON", value: "월" },
    { key: "TUE", value: "화" },
    { key: "WED", value: "수" },
    { key: "THU", value: "목" },
    { key: "FRI", value: "금" },
    { key: "SAT", value: "토" },
  ]
  const { data: reservationSlots } = useReservationSlotControllerFindMany({
    building,
    limit: 1000,
  })

  const onChangeSlot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dayOfWeek = e.target.id.split(":")[0]
    const hour = Number(e.target.id.split(":")[1])
    const minutes = Number(e.target.id.split(":")[2])
    const maxSlot = Number(e.target.value)
    if (maxSlot !== undefined && maxSlot !== null) {
      const changedSlot = changedSlots.find(
        (s) => s.hour === hour && s.minutes === minutes && s.dayOfWeek === dayOfWeek,
      )
      if (changedSlot) {
        const editedSlot = { ...changedSlot, maxSlot }
        const idx = changedSlots.indexOf(changedSlot)
        setChangedSlots([...changedSlots.slice(0, idx), editedSlot, ...changedSlots.slice(idx + 1)])
      } else {
        setChangedSlots([...changedSlots, { building, dayOfWeek, hour, minutes, maxSlot }])
      }
    }
  }

  return (
    <Box tw="mt-4 text-center">
      <header tw="mb-4" css={[row, headerItems]}>
        <p tw="col-span-2" css={item}>
          시간
        </p>
        <p css={item}>월</p>
        <p css={item}>화</p>
        <p css={item}>수</p>
        <p css={item}>목</p>
        <p css={item}>금</p>
        <p css={item}>토</p>
      </header>

      <Box tw="flex flex-col gap-1">
        {reservationSlots &&
          building === "BUILDING_1" &&
          defaultTimes.map((i, index) => {
            const hour = Number(i.split("~")[0].split(":")[0])
            const minutes = Number(i.split("~")[0].split(":")[1])
            return (
              <>
                <Box key={i} css={[row, bodyItems]}>
                  <p css={item} tw="col-span-2">
                    {i}
                  </p>
                  {dayOfWeeks.map((v, idx) => {
                    const slot = reservationSlots?.items.find(
                      (s) => s.hour === hour && s.minutes === minutes && s.dayOfWeek === v.key,
                    )
                    return (
                      <input
                        id={`${v.key}:${hour}:${minutes}`}
                        css={[item, slot?.maxSlot === 40 && tw`bg-yellow-300`]}
                        defaultValue={slot ? slot.maxSlot : 0}
                        key={idx}
                        onChange={onChangeSlot}
                      />
                    )
                  })}
                </Box>
                {index % 2 === 1 && index !== defaultTimes.length - 1 && <hr tw="my-1" />}
              </>
            )
          })}
      </Box>
    </Box>
  )
}

interface EditClosedDayDrawerProps {
  closeDrawer: () => void
  open: boolean
  specificDate: SpecificDate | null
  refetchSpecificDates?: () => void
}

const EditClosedDayDrawer = ({
  closeDrawer,
  open,
  specificDate,
  refetchSpecificDates,
}: EditClosedDayDrawerProps) => {
  const defaultTimes = [
    "10:00 ~ 10:30",
    "10:30 ~ 11:00",
    "11:00 ~ 11:30",
    "11:30 ~ 12:00",
    "12:00 ~ 12:30",
    "12:30 ~ 13:00",
    "13:00 ~ 13:30",
    "13:30 ~ 14:00",
    "14:00 ~ 14:30",
    "14:30 ~ 15:00",
    "15:00 ~ 15:30",
    "15:30 ~ 16:00",
    "16:00 ~ 16:30",
    "16:30 ~ 17:00",
    "17:00 ~ 17:30",
    "17:30 ~ 18:00",
    "18:00 ~ 18:30",
    "18:30 ~ 19:00",
    "19:00 ~ 19:30",
    "19:30 ~ 20:00",
    "20:00 ~ 20:30",
    "20:30 ~ 21:00",
  ]
  const [buildingType, setBuildingType] = useState<Building>("BUILDING_1")
  const [changedSlots, setChangedSlots] = useState<CreateSpecificDateSlotDto[]>([])
  const { mutateAsync: updateSpecificDate } = useSpecificDateControllerUpdate()

  const onChangeSlot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    const hour = Number(e.target.id.split("~")[0].split(":")[0])
    const minutes = Number(e.target.id.split("~")[0].split(":")[1])
    if (value !== undefined && value !== null) {
      const changedSlot = changedSlots.find(
        (s) => s.hour === hour && s.minutes === minutes && s.building === buildingType,
      )
      if (changedSlot) {
        const idx = changedSlots.indexOf(changedSlot)
        changedSlots[idx] = { ...changedSlot, maxSlot: value }
      } else {
        setChangedSlots([
          ...changedSlots,
          { building: buildingType, hour, minutes, maxSlot: value },
        ])
      }
    }
  }
  const onClickSave = async () => {
    if (specificDate && changedSlots.length > 0) {
      await updateSpecificDate({
        id: specificDate?.id,
        data: {
          slots: changedSlots,
        },
      })
      closeDrawer()
      if (refetchSpecificDates) {
        refetchSpecificDates()
      }
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={closeDrawer}>
      <Box tw="p-4 w-80">
        <ToggleButtonGroup
          value={buildingType}
          exclusive
          onChange={(e, v) => {
            if (v) {
              setBuildingType(v)
            }
          }}
          aria-label="Platform">
          <ToggleButton tw="px-4 py-1" value="BUILDING_1">
            1관
          </ToggleButton>
        </ToggleButtonGroup>
        <Box tw="mt-4 text-center">
          <header tw="grid gap-2 grid-cols-3 mb-4" css={headerItems}>
            <p tw="col-span-2" css={item}>
              {dayjs(specificDate?.date).format("YYYY-MM-DD")}
            </p>
            <p css={item}>{dayjs(specificDate?.date).locale("ko").format("ddd")}</p>
          </header>

          <Box tw="flex flex-col gap-1">
            {buildingType === "BUILDING_1" &&
              defaultTimes.map((i, index) => {
                const hour = Number(i.split("~")[0].split(":")[0])
                const minutes = Number(i.split("~")[0].split(":")[1])
                const slot = specificDate?.slots.find(
                  (s) => s.hour === hour && s.minutes === minutes && s.building === "BUILDING_1",
                )
                return (
                  <>
                    <Box tw="grid gap-2 grid-cols-3" key={i} css={bodyItems}>
                      <p css={item} tw="col-span-2">
                        {i}
                      </p>
                      <input
                        id={i}
                        css={item}
                        defaultValue={slot ? slot.maxSlot : 0}
                        onChange={(e) => onChangeSlot(e)}
                      />
                    </Box>
                    {index % 2 === 1 && index !== defaultTimes.length - 1 && <hr tw="my-1" />}
                  </>
                )
              })}
          </Box>

          <Button tw="mt-4" variant="contained" onClick={onClickSave}>
            저장
          </Button>
          <Button tw="mt-4 ml-4" variant="contained" color="error" onClick={closeDrawer}>
            취소
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

const SlotManagement = () => {
  const [buildingType, setBuildingType] = useState<Building>("BUILDING_1")
  const [editSpecificDate, setEditSpecificDate] = useState<SpecificDate | null>(null)
  const [changedSlots, setChangedSlots] = useState<CreateReservationSlotDto[]>([])
  const { mutateAsync: createReservationSlot } = useReservationSlotControllerCreateOrUpdate()

  const { data: closedDays, refetch: refetchCloseDays } = useCloseDayControllerFindMany({
    limit: 1000,
  })
  const { data: specificDates, refetch: refetchSpecificDates } = useSpecificDateControllerFindMany({
    limit: 1000,
  })

  const onClickSave = async () => {
    if (changedSlots.length > 0) {
      try {
        await createReservationSlot({
          data: { dto: changedSlots },
        })
        setChangedSlots([])
        alert("저장되었습니다")
      } catch (error) {
        alert("일시적인 오류. 다시 시도해주세요")
        console.error(error)
      }
    }
  }

  return (
    <Box tw="w-full">
      <Typography variant="h2">슬롯 인원 관리 / 휴무일 관리</Typography>

      <div tw="max-w-3xl py-4">
        <Paper sx={{ border: "1px solid #999", overflow: "hidden" }}>
          <Box sx={{ background: "#999", p: 1 }}>
            <Typography variant="h4">휴무일 등록</Typography>
          </Box>
          <Box sx={{ p: 1 }}>
            <NewClosedDay
              refetchCloseDays={refetchCloseDays}
              refetchSpecificDates={refetchSpecificDates}
            />
            <Box tw="flex justify-between">
              <Box>
                휴무일 목록
                <Button size="small">전체 선택</Button>
              </Box>

              <Button size="small" color="error">
                선택 삭제
              </Button>
            </Box>

            <Box tw="flex flex-col gap-2">
              {closedDays?.items.map((i) => (
                <ClosedDay key={i.id} closeDay={i} refetchCloseDays={refetchCloseDays} />
              ))}
              {specificDates?.items.map((i) => (
                <ClosedDay
                  key={i.id}
                  specificDate={i}
                  editHandler={setEditSpecificDate}
                  refetchSpecificDates={refetchSpecificDates}
                />
              ))}
            </Box>
          </Box>
        </Paper>

        <Box tw="mt-4">
          <ToggleButtonGroup
            value={buildingType}
            exclusive
            onChange={(e, v) => {
              if (v) {
                setBuildingType(v)
              }
            }}
            aria-label="Platform">
            <ToggleButton tw="px-4 py-1" value="BUILDING_1">
              1관
            </ToggleButton>
          </ToggleButtonGroup>

          <Table
            building={buildingType}
            changedSlots={changedSlots}
            setChangedSlots={setChangedSlots}
          />

          <Button tw="mt-4" variant="contained" color="secondary" onClick={onClickSave}>
            저장
          </Button>
        </Box>
      </div>

      <EditClosedDayDrawer
        closeDrawer={() => setEditSpecificDate(null)}
        open={editSpecificDate !== null}
        specificDate={editSpecificDate}
        refetchSpecificDates={refetchSpecificDates}
      />
    </Box>
  )
}

export default SlotManagement
