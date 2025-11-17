/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
import { ArrowForward, Search } from "@mui/icons-material"

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import React, { useEffect } from "react"
import {
  reservationControllerFindMany,
  reservationControllerGetAvailableReservationByDay,
  useReservationControllerFindMany,
  useReservationControllerUpdate,
} from "@/lib/orval/reservations/reservations"
import { AvailableReservationResultDto, Reservation } from "@/lib/orval/model"
import {
  useSystemConstantsControllerCreateOrUpdate,
  useSystemConstantsControllerFindOne,
} from "@/lib/orval/system-constants/system-constants"
import * as XLSX from "xlsx"
import FileSaver from "file-saver"
import { Calendar } from "@/design-system/components"

type FilterType = { key: string; value: string }

interface ActionProps {
  confirm: (id?: string) => void
  cancel: (id?: string) => void
}

interface ReservationFilterProps {
  statusIn: string[]
  setStatusIn: (status: string[]) => void
  setCreatedAtBetween: (createdAtBetween: string[]) => void
  setDatetimeBetween: (datetimeBetween: string[]) => void
  setUserName: (userName?: string) => void
  setUserPhoneNumber: (userPhoneNumber?: string) => void
}

const Filter = ({
  statusIn,
  setStatusIn,
  setCreatedAtBetween,
  setDatetimeBetween,
  setUserName,
  setUserPhoneNumber,
  selectedDay,
  selectedTime,
}: ReservationFilterProps & { selectedDay: Date | null; selectedTime: number | null }) => {
  const [waiting, setWaiting] = React.useState(true)
  const [done, setDone] = React.useState(true)
  const [canceled, setCanceled] = React.useState(true)
  const [range, setRange] = React.useState("all")
  const [createdAt, setCreatedAt] = React.useState("1")
  const [startDatetime, setStartDatetime] = React.useState<string | null>()
  const [endDatetime, setEndDatetime] = React.useState<string | null>()
  const [nameOrPhoneNumber, setNameOrPhoneNumber] = React.useState("1")
  const [userText, setUserText] = React.useState<string | undefined>()

  // 캘린더 뷰에서 슬롯 클릭시 날짜와 시간을 받아옴
  React.useEffect(() => {
    if (selectedDay !== null && selectedTime !== null) {
      const startTime = dayjs(selectedTime)
      const endTime = startTime.add(30, "minute")
      const formattedStartTime = startTime.format("YYYY-MM-DD hh:mm a")
      const formattedEndTime = endTime.format("YYYY-MM-DD hh:mm a")
      setStartDatetime(formattedStartTime)
      setEndDatetime(formattedEndTime)
      setDatetimeBetween([
        dayjs(formattedStartTime).format("YYYY-MM-DD hh:mm"),
        dayjs(formattedEndTime).format("YYYY-MM-DD hh:mm"),
      ])
    }
  }, [selectedDay, selectedTime])

  const toggleStatus = (status: string, value: boolean) => {
    if (status === "all") {
      setWaiting(value)
      setDone(value)
      setCanceled(value)
      if (value) {
        setStatusIn(["WAITING", "DONE", "CANCELED"])
      } else {
        setStatusIn([])
      }
    } else if (status === "WAITING") {
      setWaiting(value)
      if (value) {
        setStatusIn(statusIn.concat("WAITING"))
      } else {
        setStatusIn(statusIn.filter((s) => s !== "WAITING"))
      }
    } else if (status === "DONE") {
      setDone(value)
      if (value) {
        setStatusIn(statusIn.concat("DONE"))
      } else {
        setStatusIn(statusIn.filter((s) => s !== "DONE"))
      }
    } else if (status === "CANCELED") {
      setCanceled(value)
      if (value) {
        setStatusIn(statusIn.concat("CANCELED"))
      } else {
        setStatusIn(statusIn.filter((s) => s !== "CANCELED"))
      }
    }
  }

  const onChangeRange = (value: string) => {
    if (value) {
      setRange(value)
    }
    const today = dayjs()
    if (value === "all") {
      setStartDatetime(undefined)
      setEndDatetime(undefined)
    }
    if (value === "today") {
      setStartDatetime(today.startOf("day").format())
      setEndDatetime(today.endOf("day").format())
    }
    if (value === "week") {
      setStartDatetime(today.startOf("day").format())
      setEndDatetime(today.endOf("day").add(1, "week").format())
    }
    if (value === "month") {
      setStartDatetime(today.startOf("day").format())
      setEndDatetime(today.endOf("day").add(1, "month").format())
    }
    if (value === "3month") {
      setStartDatetime(today.startOf("day").format())
      setEndDatetime(today.endOf("day").add(3, "month").format())
    }
  }

  const onChangeDatetime = (key: string, datetime: Dayjs) => {
    if (key === "start") {
      setStartDatetime(datetime.format())
    }
    if (key === "end") {
      setEndDatetime(datetime.format())
    }
  }

  const search = () => {
    if (startDatetime && endDatetime && startDatetime !== "" && endDatetime !== "") {
      if (createdAt === "1") {
        setDatetimeBetween([
          dayjs(startDatetime).format("YYYY-MM-DD HH:mm"),
          dayjs(endDatetime).format("YYYY-MM-DD HH:mm"),
        ])
        setCreatedAtBetween([])
      }
      if (createdAt === "2") {
        setCreatedAtBetween([
          dayjs(startDatetime).format("YYYY-MM-DD HH:mm"),
          dayjs(endDatetime).format("YYYY-MM-DD HH:mm"),
        ])
        setDatetimeBetween([])
      }
    } else {
      setDatetimeBetween([])
      setCreatedAtBetween([])
    }
    if (nameOrPhoneNumber === "1") {
      setUserName(userText)
      setUserPhoneNumber(undefined)
    }
    if (nameOrPhoneNumber === "2") {
      setUserPhoneNumber(userText)
      setUserName(undefined)
    }
  }

  const init = () => {
    setWaiting(true)
    setDone(true)
    setCanceled(true)
    setRange("all")
    setCreatedAt("1")
    setStartDatetime(undefined)
    setEndDatetime(undefined)
    setNameOrPhoneNumber("1")
    setUserText("")
  }

  return (
    <Paper tw="p-4 max-w-4xl">
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={waiting && done && canceled}
              onChange={(e) => {
                toggleStatus("all", e.currentTarget.checked)
              }}
            />
          }
          label="전체"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={waiting}
              onChange={(e) => {
                toggleStatus("WAITING", e.currentTarget.checked)
              }}
            />
          }
          label="예약확정 대기"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={done}
              onChange={(e) => {
                toggleStatus("DONE", e.currentTarget.checked)
              }}
              color="error"
            />
          }
          label="예약확정"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={canceled}
              onChange={(e) => {
                toggleStatus("CANCELED", e.currentTarget.checked)
              }}
            />
          }
          label="예약취소"
        />
      </Box>

      <Box tw="mt-4">
        <Typography variant="body2" color="text.secondary" tw="mb-2 font-bold">
          기간
        </Typography>

        <Box tw="flex gap-3 items-start">
          <Select
            defaultValue="1"
            value={createdAt}
            onChange={(e) => {
              if (e.target.value) {
                setCreatedAt(e.target.value)
              }
            }}
            tw="w-28">
            <MenuItem value="1">예약일시</MenuItem>
            <MenuItem value="2">예약 접수일</MenuItem>
          </Select>

          <ToggleButtonGroup
            exclusive
            value={range}
            onChange={(event, value) => {
              onChangeRange(value)
            }}>
            <ToggleButton tw="min-w-[4rem]" value="all">
              전체
            </ToggleButton>
            <ToggleButton tw="min-w-[4rem]" value="today">
              오늘
            </ToggleButton>
            <ToggleButton tw="min-w-[4rem]" value="week">
              1주일
            </ToggleButton>
            <ToggleButton tw="min-w-[4rem]" value="month">
              1개월
            </ToggleButton>
            <ToggleButton tw="min-w-[4rem]" value="3month">
              3개월
            </ToggleButton>
          </ToggleButtonGroup>

          <Box>
            <Box tw="flex items-center gap-2">
              <DatePicker
                value={startDatetime ? dayjs(startDatetime) : null}
                onChange={(value: Dayjs | null) => {
                  if (value) {
                    onChangeDatetime("start", value)
                  }
                }}
              />
              ~
              <DatePicker
                value={endDatetime ? dayjs(endDatetime) : null}
                onChange={(value: Dayjs | null) => {
                  if (value) {
                    onChangeDatetime("end", value)
                  }
                }}
              />
            </Box>
            <Box tw="flex items-center gap-2 mt-2">
              <TimePicker
                value={startDatetime ? dayjs(startDatetime) : null}
                onChange={(value: Dayjs | null) => {
                  if (value) {
                    onChangeDatetime("start", value)
                  }
                }}
              />
              ~
              <TimePicker
                value={endDatetime ? dayjs(endDatetime) : null}
                onChange={(value: Dayjs | null) => {
                  if (value) {
                    onChangeDatetime("end", value)
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box tw="flex items-center gap-3 mt-8">
          <Select
            defaultValue="1"
            tw="w-28"
            value={nameOrPhoneNumber}
            onChange={(e) => {
              if (e.target.value) {
                setNameOrPhoneNumber(e.target.value)
              }
            }}>
            <MenuItem value="1">예약자명</MenuItem>
            <MenuItem value="2">전화번호</MenuItem>
          </Select>

          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            fullWidth
            variant="outlined"
            placeholder="이름 또는 휴대전화번호 입력."
            value={userText}
            onChange={(e) => {
              setUserText(e.target.value)
            }}
          />
          <Button tw="shrink-0" size="large" variant="contained" color="primary" onClick={search}>
            검색하기
          </Button>
          <Button tw="shrink-0" size="large" variant="contained" color="inherit" onClick={init}>
            초기화
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

interface ReservationTableProps extends ActionProps {
  onClick: (reservation: Reservation) => void
  reservations?: Reservation[]
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  totalItems: number
  totalPages: number
}

const ReservationTable = ({
  onClick,
  cancel,
  confirm,
  reservations,
  page,
  setPage,
  limit,
  setLimit,
  totalItems,
  totalPages,
}: ReservationTableProps) => {
  return (
    <Paper tw="my-4" style={{ width: "fit-content" }}>
      <TableContainer>
        <Table
          sx={{
            minWidth: 1400,
          }}>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>예약 접수일</TableCell>
              <TableCell>예약 ID</TableCell>
              <TableCell>예약 일시</TableCell>
              <TableCell>예약자</TableCell>
              <TableCell>예약 티켓</TableCell>
              <TableCell>예약 상태</TableCell>
              <TableCell>path_visit</TableCell>
              <TableCell>detail_visit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations?.map((reservation, index) => {
              const no = (totalItems ?? 0) - (page - 1) * limit - index
              let reservationName = ""
              if (reservation.products.length > 0) {
                reservationName = reservation.products[0].product.name
              } else if (reservation.events.length > 0) {
                reservationName = reservation.events[0].event.name
              }
              const reservationCount = reservation.products.length + reservation.events.length - 1
              return (
                <TableRow tabIndex={-1} key={index}>
                  <TableCell>{no}</TableCell>
                  <TableCell>
                    {dayjs(reservation.createdAt.replaceAll("Z", "")).format("YYYY. MM. DD")}
                  </TableCell>
                  <TableCell>{reservation.rid}</TableCell>
                  <TableCell>
                    {dayjs(reservation.datetime.replaceAll("Z", "")).format("YYYY. MM. DD")}
                    <p>{`${dayjs(reservation.datetime.replaceAll("Z", "")).format("hh:mm A")}`}</p>
                    {reservation.building === "BUILDING_1" && (
                      <Chip color="primary" label="1관" variant="outlined" />
                    )}
                    {reservation.building === "BUILDING_2" && (
                      <Chip color="primary" label="2관" variant="outlined" />
                    )}
                    {reservation.building === "BUILDING_3" && (
                      <Chip color="primary" label="3관" variant="outlined" />
                    )}
                    {reservation.status === "DONE" && <p tw="text-red-500">*실시간 정보 아님*</p>}
                  </TableCell>
                  <TableCell>
                    {reservation.user.name}
                    <p>{reservation.user.phoneNumber}</p>
                    <p>{reservation.user.email}</p>
                  </TableCell>
                  <TableCell>
                    {reservationName}
                    {reservationCount > 0 && ` 외 ${reservationCount}개`}
                  </TableCell>
                  <TableCell>
                    <div tw="flex items-center gap-2">
                      {reservation.status === "DONE" && <Chip color="primary" label="예약확정" />}
                      {reservation.status === "WAITING" && (
                        <Chip color="primary" label="예약확정 대기" />
                      )}
                      {reservation.status === "CANCELED" && <Chip label="예약취소" />}
                      {reservation.status === "WAITING" && (
                        <Button
                          onClick={() => {
                            confirm(reservation.id)
                          }}
                          variant="outlined">
                          예약 확정하기
                        </Button>
                      )}
                      {reservation.status !== "CANCELED" && (
                        <Button
                          onClick={() => {
                            cancel(reservation.id)
                          }}
                          color="error"
                          variant="outlined">
                          예약 취소하기
                        </Button>
                      )}
                      {/* {reservation.status !== "CANCELED" && (
                        <Button
                          onClick={() => {
                            onClick(reservation)
                          }}
                          color="inherit"
                          variant="outlined">
                          예약 변경하기
                        </Button>
                      )} */}

                      <div tw="flex-1" />

                      <Button
                        tw="p-2 min-w-0"
                        variant="outlined"
                        onClick={() => {
                          onClick(reservation)
                        }}>
                        <ArrowForward />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{reservation.pathVisit}</TableCell>
                  <TableCell>{reservation.detailVisit}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box tw="flex justify-between p-2 items-center">
        <Select
          value={limit}
          onChange={(e) => {
            if (e.target.value) {
              setPage(1)
              setLimit(Number(e.target.value))
            }
          }}
          tw="w-16">
          <MenuItem value="20">20</MenuItem>
          <MenuItem value="50">50</MenuItem>
          <MenuItem value="100">100</MenuItem>
        </Select>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
          shape="rounded"
        />
      </Box>
    </Paper>
  )
}

interface ReservationDrawerProps extends ActionProps {
  change: (id?: string, adminMemo?: string, datetime?: string) => void
  open?: boolean
  onClose?: () => void
  reservation?: Reservation | null
}

const ReservationDrawer = ({
  open,
  onClose,
  confirm,
  cancel,
  change,
  reservation,
}: ReservationDrawerProps) => {
  const [todaySlots, setTodaySlots] = React.useState<AvailableReservationResultDto[]>([])
  const [adminMemo, setAdminMemo] = React.useState(reservation?.adminMemo)
  const [isEdit, setIsEdit] = React.useState(false)
  const [today, setToday] = React.useState(dayjs())
  const [selectedDatetime, setSelectedDatetime] = React.useState<string>("")
  useEffect(() => {
    if (
      (reservation?.events?.length && reservation?.events?.length > 0) ||
      (reservation?.products?.length && reservation?.products?.length > 0)
    ) {
      getAvailableReservations(today.year(), today.month() + 1, today.date()).then((data) => {
        setTodaySlots(data)
      })
    }
  }, [today])
  useEffect(() => {
    setIsEdit(false)
  }, [reservation])

  const [isLoading, setIsLoading] = React.useState(false)

  const getAvailableReservations = async (y: number, m: number, d: number) => {
    try {
      setIsLoading(true)
      const productIds = reservation?.products?.map((product) => product.product.id)
      const eventIds = reservation?.events?.map((event) => event.event.id)
      return await reservationControllerGetAvailableReservationByDay({
        year: y,
        month: m,
        day: d,
        productIds,
        eventIds,
      })
    } finally {
      setIsLoading(false)
    }
  }

  let title = ""
  if (reservation?.status === "DONE") {
    title = "예약 확정"
  } else if (reservation?.status === "WAITING") {
    title = "예약 확정 대기"
  } else if (reservation?.status === "CANCELED") {
    title = "예약 취소"
  }
  const productCount = reservation?.products ? reservation?.products.length : 0
  const eventCount = reservation?.events ? reservation?.events.length : 0
  const reservationCount = productCount + eventCount - 1
  let name
  if (productCount > 0) {
    name = reservation?.products.map((product) => product.product.name).join(", ")
  }

  if (eventCount > 0) {
    const eventNames = reservation?.events.map((event) => event.event.name).join(", ")

    if (name) {
      name = `${name}, ${eventNames}`
    } else {
      name = eventNames
    }
  }

  const renderTimeSlots = () => {
    if (isLoading) {
      return <div tw="text-center w-full">예약 가능한 시간을 불러오는 중입니다.</div>
    }

    if (todaySlots?.length) {
      return (
        <ToggleButtonGroup
          value={selectedDatetime}
          exclusive
          onChange={(e, v) => {
            if (v) {
              setSelectedDatetime(v)
            }
          }}>
          {todaySlots.map((slot, index) => (
            <ToggleButton tw="px-4 py-1" key={slot.datetime} value={slot.datetime}>
              {dayjs(slot.datetime.replaceAll("Z", "")).format("HH:mm")}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )
    }
    return <div tw="text-center w-full">예약 가능한 시간이 없습니다.</div>
  }

  const info = [
    {
      label: "예약 접수일",
      value: dayjs(reservation?.createdAt.replaceAll("Z", "")).format("YYYY-MM-DD"),
    },
    {
      label: "예약 ID",
      value: reservation?.rid,
    },
    {
      label: "예약 일시",
      value: `${dayjs(reservation?.datetime.replaceAll("Z", "")).format("YYYY. MM. DD")} ${dayjs(
        reservation?.datetime.replaceAll("Z", ""),
      ).format("hh:mm A")}`,
    },
    {
      label: "예약자 정보",
      value: `${reservation?.user.name} ${reservation?.user.phoneNumber || ""} ${
        reservation?.user.email || ""
      }`,
    },
    {
      label: "예약한 상품",
      value: name,
    },
    {
      label: "고객 메모",
      value: reservation?.userMemo && reservation?.userMemo !== "" ? reservation?.userMemo : "없음",
    },
    {
      label: "pathVisit",
      value:
        !reservation?.pathVisit || reservation.pathVisit === "null"
          ? "없음"
          : reservation.pathVisit,
    },
    {
      label: "detailVisit",
      value:
        !reservation?.detailVisit || reservation.detailVisit === "null"
          ? "없음"
          : reservation.detailVisit,
    },
  ]

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box tw="p-6 min-w-[50vw] min-h-screen flex flex-col">
        <Typography variant="h2">{title}</Typography>
        <Box>
          {info.map(({ label, value }) => {
            return (
              <Box key={label} tw="flex gap-2 mt-4">
                <Typography variant="body2" color="text.secondary" tw="w-32">
                  {label}
                </Typography>
                <Typography tw="whitespace-pre-wrap" variant="body2">
                  {value}
                </Typography>
              </Box>
            )
          })}

          <Box tw="mt-4">
            {isEdit && (
              <>
                <Typography variant="body2" color="text.secondary" tw="w-32">
                  예약 변경
                </Typography>
                <Calendar
                  value={today}
                  onChange={(value) => {
                    if (value) {
                      setToday(value)
                      setSelectedDatetime("")
                    }
                  }}
                  footer={
                    <div tw="">
                      <div tw="flex gap-4 overflow-auto p-4">{renderTimeSlots()}</div>
                    </div>
                  }
                />
              </>
            )}
            <Typography variant="body2" color="text.secondary" tw="w-32">
              병원 메모
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="메모를 입력하세요."
              defaultValue={reservation?.adminMemo}
              onChange={(e) => {
                setAdminMemo(e.target.value)
              }}
              disabled={reservation?.status !== "DONE" && !isEdit}
            />
          </Box>
        </Box>
        <div tw="flex-1" />
        <Box tw="flex justify-end gap-2">
          <Button tw="mr-4" color="inherit" variant="contained" onClick={onClose}>
            닫기
          </Button>
          {/* {reservation?.status === "DONE" && !isEdit && (
            <Button
              onClick={() => {
                setIsEdit(true)
              }}
              variant="contained"
              color="warning">
              예약 변경하기
            </Button>
          )} */}
          {/* {reservation?.status === "DONE" && isEdit && (
            <Button
              onClick={() => {
                change(
                  reservation?.id,
                  adminMemo,
                  selectedDatetime.replaceAll("T", " ").replaceAll("Z", ""),
                )
              }}
              variant="contained"
              color="primary">
              예약 변경하기
            </Button>
          )} */}
          {reservation?.status === "WAITING" && (
            <Button
              onClick={() => {
                confirm(reservation?.id)
              }}
              variant="contained"
              color="primary">
              예약 확정하기
            </Button>
          )}
          {reservation?.status !== "CANCELED" && (
            <Button
              onClick={() => {
                cancel(reservation?.id)
              }}
              variant="contained"
              color="error">
              예약 취소하기
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}

interface ExportModalProps {
  open?: boolean
  onClose?: () => void
}

const ExportModal = ({ open = false, onClose }: ExportModalProps) => {
  const [createdAtOrDatetime, setCreatedAtOrDatetime] = React.useState<string>("datetime")
  const [startDatetime, setStartDatetime] = React.useState<string | null>()
  const [endDatetime, setEndDatetime] = React.useState<string | null>()

  const onChangeDatetime = (key: string, datetime: Dayjs) => {
    if (key === "start") {
      setStartDatetime(datetime.startOf("day").format())
    }
    if (key === "end") {
      setEndDatetime(datetime.endOf("day").format())
    }
  }

  const useOnClick = async () => {
    const createdAtBetween: string[] =
      createdAtOrDatetime === "createdAt" && startDatetime && endDatetime
        ? [
            dayjs(startDatetime).format("YYYY-MM-DD HH:mm"),
            dayjs(endDatetime).format("YYYY-MM-DD HH:mm"),
          ]
        : []
    const datetimeBetween: string[] =
      createdAtOrDatetime === "datetime" && startDatetime && endDatetime
        ? [
            dayjs(startDatetime).format("YYYY-MM-DD HH:mm"),
            dayjs(endDatetime).format("YYYY-MM-DD HH:mm"),
          ]
        : []
    const reservations = await reservationControllerFindMany({
      limit: 1000,
      createdAtBetween,
      datetimeBetween,
    })
    const header = [
      "id",
      "예약 접수일",
      "예약 일시",
      "예약자",
      "예약 상품/이벤트",
      "예약 장소",
      "예약 상태",
      "고객 메모",
      "병원 메모",
      "path_visit",
      "detail_visit",
    ]
    const data = reservations?.items.map((reservation) => {
      const productCount = reservation.products ? reservation.products.length : 0
      const eventCount = reservation.events ? reservation.events.length : 0
      const reservationCount = productCount + eventCount - 1
      let name
      if (productCount > 0) {
        name = reservation.products[0].product.name
      }
      if (eventCount > 0) {
        name = reservation.events[0].event.name
      }
      if (reservationCount > 0) {
        name = `${name} 외 ${reservationCount}개`
      }
      let building = ""
      if (reservation.building === "BUILDING_1") {
        building = "1관"
      }
      if (reservation.building === "BUILDING_2") {
        building = "2관"
      }
      if (reservation.building === "BUILDING_3") {
        building = "3관"
      }
      let status = ""
      if (reservation.status === "DONE") {
        status = "예약확정"
      }
      if (reservation.status === "WAITING") {
        status = "예약확정 대기"
      }
      if (reservation.status === "CANCELED") {
        status = "예약취소"
      }
      return [
        reservation.rid,
        dayjs(reservation.createdAt.replaceAll("Z", "")).format("YYYY-MM-DD"),
        dayjs(reservation.datetime.replaceAll("Z", "")).format("YYYY-MM-DD hh:mm a"),
        `${reservation.user.name} ${reservation.user.phoneNumber} ${reservation.user.email}`,
        name,
        building,
        status,
        reservation.userMemo && reservation.userMemo !== "" ? reservation.userMemo : "없음",
        reservation.adminMemo && reservation.adminMemo !== "" ? reservation.adminMemo : "없음",
        reservation.pathVisit,
        reservation.detailVisit,
      ]
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([header])
    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A2" })

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "buffer" })
    const blob = new Blob([wbout], { type: "application/vnd.ms-excel" })
    FileSaver.saveAs(blob, `예약목록_${dayjs().format("YYYY-MM-DD")}.xlsx`)
    if (onClose) {
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Paper tw="absolute-center p-8 min-w-[40rem]">
        <Typography variant="h2" textAlign="center">
          예약 목록 Export
        </Typography>

        <Typography tw="my-4">Export 할 데이터 range 를 설정해주세요</Typography>

        <Box tw="flex gap-4 justify-between">
          <FormControl tw="w-28" fullWidth>
            <InputLabel id="date-select-label">날짜기준</InputLabel>
            <Select
              labelId="date-select-label"
              id="date-select"
              value={createdAtOrDatetime}
              label="날짜기준"
              onChange={(event) => {
                setCreatedAtOrDatetime(event.target.value)
              }}>
              <MenuItem value="datetime">예약일시</MenuItem>
              <MenuItem value="createdAt">예약 접수일</MenuItem>
            </Select>
          </FormControl>

          <Box tw="flex gap-2 items-center">
            <DatePicker
              value={startDatetime ? dayjs(startDatetime) : null}
              onChange={(value: Dayjs | null) => {
                if (value) {
                  onChangeDatetime("start", value)
                }
              }}
            />
            ~
            <DatePicker
              value={endDatetime ? dayjs(endDatetime) : null}
              onChange={(value: Dayjs | null) => {
                if (value) {
                  onChangeDatetime("end", value)
                }
              }}
            />
          </Box>
        </Box>

        <Box tw="text-center">
          <Button
            tw="mt-8"
            variant="contained"
            color="primary"
            disabled={!(startDatetime && endDatetime)}
            onClick={useOnClick}>
            Export
          </Button>
        </Box>
      </Paper>
    </Modal>
  )
}

const ReservationView = ({
  selectedDay,
  selectedTime,
}: {
  selectedDay: any | null
  selectedTime: any | null
}) => {
  const [detailReservation, setDetailReservation] = React.useState<Reservation | null>(null)
  const [openExport, setOpenExport] = React.useState(false)
  const [statusIn, setStatusIn] = React.useState<string[]>(["WAITING", "DONE", "CANCELED"])
  const [createdAtBetween, setCreatedAtBetween] = React.useState<string[]>([])
  const [datetimeBetween, setDatetimeBetween] = React.useState<string[]>([])
  const [userName, setUserName] = React.useState<string | undefined>()
  const [userPhoneNumber, setUserPhoneNumber] = React.useState<string | undefined>()
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(20)
  const { data: reservations, refetch } = useReservationControllerFindMany({
    page,
    limit,
    statusIn,
    createdAtBetween,
    datetimeBetween,
    userName,
    userPhoneNumber,
  })
  const { data: autoReservationConfirm, refetch: refetchAutoReservationConfirm } =
    useSystemConstantsControllerFindOne("AUTO_RESERVATION_CONFIRM")
  const { mutateAsync: updateReservation } = useReservationControllerUpdate()
  const { mutateAsync: updateSystemConstants } = useSystemConstantsControllerCreateOrUpdate()

  const cancel = async (id?: string) => {
    if (id && window.confirm("예약을 취소하시겠습니까?")) {
      await updateReservation({ id, data: { status: "CANCELED" } })
      setDetailReservation(null)
      await refetch()
      alert("예약이 취소되었습니다.")
    }
  }

  const confirm = async (id?: string) => {
    if (id && window.confirm("예약을 확정하시겠습니까?")) {
      await updateReservation({ id, data: { status: "DONE" } })
      setDetailReservation(null)
      await refetch()
      alert("예약이 확정되었습니다.")
    }
  }

  const change = async (id?: string, adminMemo?: string, datetime?: string) => {
    if (id && window.confirm("예약을 변경하시겠습니까?")) {
      await updateReservation({ id, data: { adminMemo, datetime } })
      setDetailReservation(null)
      await refetch()
      alert("예약이 변경되었습니다.")
    }
  }

  const changeAutoReservationConfirm = async (value: boolean) => {
    await updateSystemConstants({ data: { key: "AUTO_RESERVATION_CONFIRM", value } })
    await refetchAutoReservationConfirm()
    alert("자동 예약 확정이 변경되었습니다.")
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <Box tw="my-4">
        <Filter
          statusIn={statusIn}
          setStatusIn={setStatusIn}
          setCreatedAtBetween={setCreatedAtBetween}
          setDatetimeBetween={setDatetimeBetween}
          setUserName={setUserName}
          setUserPhoneNumber={setUserPhoneNumber}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
        />
        <p tw="mt-4 text-red-500 text-lg">
          *확정된 예약의 정확한 예약시간은 CRM에서 확인바랍니다! 확정된 예약의 시간을 CRM에서
          변경했을 경우 아래 목록에는 반영되지 않습니다.
        </p>
        <ReservationTable
          onClick={setDetailReservation}
          cancel={cancel}
          confirm={confirm}
          reservations={reservations?.items}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalItems={reservations?.meta?.totalItems ?? 0}
          totalPages={reservations?.meta?.totalPages ?? 0}
        />
        <Box tw="flex justify-between items-end">
          <FormControlLabel
            control={
              <Switch
                checked={autoReservationConfirm?.value}
                onChange={(e) => {
                  changeAutoReservationConfirm(e.currentTarget.checked)
                }}
              />
            }
            label="자동 예약 확정"
          />

          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setOpenExport(true)
            }}>
            예약 목록 export
          </Button>
        </Box>
        <ReservationDrawer
          open={!!detailReservation}
          onClose={() => {
            setDetailReservation(null)
          }}
          cancel={cancel}
          confirm={confirm}
          change={change}
          reservation={detailReservation}
        />
        <ExportModal
          open={openExport}
          onClose={() => {
            setOpenExport(false)
          }}
        />
      </Box>
    </LocalizationProvider>
  )
}

export default ReservationView
