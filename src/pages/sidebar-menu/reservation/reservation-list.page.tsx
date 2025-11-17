import { Drawer, ToggleButton, ToggleButtonGroup } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import CalendarView from "./components/reservation-list/calendar-view.component"
import ReservationView from "./components/reservation-list/reservation-view.component"

type Building = "main" | "new"
type View = "reservation" | "calendar"

interface ReservationDrawerProps {
  closeDrawer: () => void
  open: boolean
}

const ReservationDrawer = ({ closeDrawer, open }: ReservationDrawerProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={closeDrawer}>
      <Box tw="p-4 w-80"></Box>
    </Drawer>
  )
}

const ReservationList = () => {
  const [editClosedDay, setEditClosedDay] = useState(false)
  const [view, setView] = useState<View>("calendar")
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const toggleEditClosedDay = () => {
    setEditClosedDay(!editClosedDay)
  }

  return (
    <Box>
      <Box tw="flex">
        <Typography variant="h2" tw="mr-8">
          예약 현황
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, v) => {
            if (v) {
              setView(v)
            }
          }}>
          <ToggleButton tw="px-4 py-1" value="calendar">
            캘린더
          </ToggleButton>
          <ToggleButton tw="px-4 py-1" value="reservation">
            예약목록
          </ToggleButton>
        </ToggleButtonGroup>

        <ReservationDrawer closeDrawer={() => setEditClosedDay(false)} open={editClosedDay} />
      </Box>
      {/* 여기서 prop 이용해서 캘린더에서 클릭한 날짜와 시간을 받아올 수 있게 하면 될 것 같다. */}
      {/* {view === "calendar" && <CalendarView />}
      {view === "reservation" && <ReservationView />} */}
      {view === "calendar" && (
        <CalendarView
          onSlotClick={(day, time) => {
            setSelectedDay(day)
            setSelectedTime(time)
            setView("reservation")
          }}
        />
      )}
      {view === "reservation" && (
        <ReservationView selectedDay={selectedDay} selectedTime={selectedTime} />
      )}
    </Box>
  )
}

export default ReservationList
