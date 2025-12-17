import { Drawer, ToggleButton, ToggleButtonGroup } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import ReservationView from "./components/reservation-list/reservation-view.component"

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
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  return (
    <Box>
      <Box tw="flex">
        <Typography variant="h2" tw="mr-8">
          예약 현황
        </Typography>

        <ReservationDrawer closeDrawer={() => setEditClosedDay(false)} open={editClosedDay} />
      </Box>

      {/* CalendarView 없이 예약 목록만 표시 */}
      <ReservationView selectedDay={selectedDay} selectedTime={selectedTime} />
    </Box>
  )
}

export default ReservationList
