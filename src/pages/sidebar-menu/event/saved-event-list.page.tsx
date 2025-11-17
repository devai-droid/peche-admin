import { CreateEventDtoLabelItem, EventBundle, EventList } from "@/lib/orval/model"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useQueryClient } from "@tanstack/react-query"
import React from "react"
import { useIntegratedCrmCategoryControllerFindMany } from "@/lib/orval/integrated-crm-categories/integrated-crm-categories"
import { ExtendedEvent, ExtendedEventBackup } from "@/lib/types/event.type"
import EventFormDrawer from "./components/event-list/event-form-drawer.component"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useNavigate, useParams } from "react-router-dom"
import tw from "twin.macro"
import { useEventCategoryControllerFindManyWithPaginationQuery } from "@/lib/orval/event-categories/event-categories"
import {
  useEventBackupControllerFindMany,
  useEventBackupControllerUpdate,
} from "@/lib/orval/event-backup/event-backup"
import LoadEventBundleModal from "./components/event-list/load-bundle-modal.component"
import { useProductDetailPageControllerFindMany } from "@/lib/orval/product-detail-pages/product-detail-pages"

const BundleLabel = tw(Typography)`mb-2`

const names = [
  {
    key: "name",
    label: "이벤트명\n(한국어)",
    visibleKey: "visible",
  },
  {
    key: "description",
    label: "이벤트 설명\n(한국어)",
    visibleKey: null,
  },
  {
    key: "nameEN",
    label: "이벤트명\n(영어)",
    visibleKey: "visibleEN",
  },
  {
    key: "descriptionEN",
    label: "이벤트 설명\n(영어)",
    visibleKey: null,
  },
  {
    key: "nameZH",
    label: "이벤트명\n(중국어 간체)",
    visibleKey: "visibleZH",
  },
  {
    key: "descriptionZH",
    label: "이벤트 설명\n(중국어 간체)",
    visibleKey: null,
  },
  {
    key: "nameZHTW",
    label: "이벤트명\n(중국어 번체)",
    visibleKey: "visibleZHTW",
  },
  {
    key: "descriptionZHTW",
    label: "이벤트 설명\n(중국어 번체)",
    visibleKey: null,
  },
  {
    key: "nameJA",
    label: "이벤트명\n(일본어)",
    visibleKey: "visibleJA",
  },
  {
    key: "descriptionJA",
    label: "이벤트 설명\n(일본어)",
    visibleKey: null,
  },
  {
    key: "nameTH",
    label: "이벤트명\n(태국어)",
    visibleKey: "visibleTH",
  },
  {
    key: "descriptionTH",
    label: "이벤트 설명\n(태국어)",
    visibleKey: null,
  },
] as const

const SavedEventListPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [page, setPage] = React.useState(1)
  const queryClient = useQueryClient()
  const [selectedEventBundle, setSelectedEventBundle] = React.useState<EventBundle | null>(null)

  const { data: eventCategories, isLoading: isCategoriesLoading } =
    useEventCategoryControllerFindManyWithPaginationQuery()
  const {
    data: events,
    refetch,
    queryKey,
  } = useEventBackupControllerFindMany(
    {
      page: 1,
      limit: 1000,
      backupBundleId: id,
    },
    {
      query: {
        enabled: !!id,
      },
    },
  )
  const { mutate: updateEvent } = useEventBackupControllerUpdate()

  const [selectedEvent, setSelectedEvent] = React.useState<ExtendedEventBackup | null>(null)
  const [openCreateDrawer, setOpenCreateDrawer] = React.useState(false)
  const { data: integratedCrmCategories } = useIntegratedCrmCategoryControllerFindMany()

  const [openLoadModal, setOpenLoadModal] = React.useState(false)

  const { data: details } = useProductDetailPageControllerFindMany({
    page: 1,
    limit: 1000,
  })

  const onChange = (item: ExtendedEventBackup, key: keyof ExtendedEventBackup, value: unknown) => {
    queryClient.setQueryData<EventList>(queryKey, (old) => {
      if (!old) {
        return old
      }
      return {
        ...old,
        items: old.items.map((oldItem) => {
          if (oldItem.id === item.id) {
            const newData = {
              ...oldItem,
              [key]: value,
            }
            updateEvent({
              id: item.id,
              data: { [key]: value, price: item.price },
            })
            return newData
          }
          return oldItem
        }),
      }
    })
  }

  if (isCategoriesLoading) {
    return null
  }

  return (
    <LocalizationProvider adapterLocale="ko" dateAdapter={AdapterDayjs}>
      <Box tw="pb-8">
        <Typography variant="h2">이벤트 목록</Typography>

        <Paper tw="mt-8 rounded-none">
          <TableContainer>
            <Table
              sx={{
                "& .MuiTableCell-root": {
                  border: "1px solid #d0d0d0",
                },
              }}>
              <TableHead tw="bg-[#eee]">
                <TableRow tw="[&>*]:!text-center">
                  <TableCell>이벤트 대분류</TableCell>
                  <TableCell>상세페이지</TableCell>
                  <TableCell>통합 CRM 대분류</TableCell>
                  {names.map((name) => (
                    <TableCell tw="whitespace-pre-wrap" key={name.label}>
                      {name.label}
                    </TableCell>
                  ))}
                  <TableCell>일반가격</TableCell>
                  <TableCell>라벨</TableCell>
                  <TableCell>우선순위(인기)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events?.items?.map((p) => {
                  const event = p as ExtendedEventBackup
                  return (
                    <TableRow
                      tw="[&>*]:min-w-[5rem]"
                      tabIndex={-1}
                      key={event.id}
                      hover
                      role="button"
                      onClick={() => setSelectedEvent(event)}>
                      <TableCell>
                        <Select
                          fullWidth
                          onClick={(e) => e.stopPropagation()}
                          value={event.category?.id ?? event.category ?? ""}
                          onChange={(e) => onChange(event, "category", e.target.value)}>
                          {eventCategories?.items?.map((pc) => (
                            <MenuItem key={pc.id} value={pc.id}>
                              {pc.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          labelId="event-detail-select-label"
                          id="event-detail-select"
                          value={event.detailPageId ?? event.detailPage?.id ?? ""}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onChange(event, "detailPageId", e.target.value)}>
                          {details?.items.map((detail) => (
                            <MenuItem key={detail.id} value={detail.id}>
                              {detail.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          labelId="crm-category-select-label"
                          id="crm-category-select"
                          value={
                            event.integratedCrmCategoryId ?? event.integratedCrmCategory?.id ?? ""
                          }
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            onChange(event, "integratedCrmCategoryId", e.target.value)
                          }>
                          {integratedCrmCategories?.map((crm) => (
                            <MenuItem key={crm.id} value={crm.id}>
                              {crm.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      {names.map((name) => (
                        <TableCell tw="p-1 min-w-[5rem]" key={name.key}>
                          <Typography>{event[name.key]}</Typography>
                          {name.visibleKey && event[name.key] && (
                            <Box tw="text-center" onClick={(e) => e.stopPropagation()}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    value={event[name.key]}
                                    onChange={(e) =>
                                      onChange(event, name.visibleKey, e.target.checked)
                                    }
                                    checked={Boolean(event[name.visibleKey])}
                                  />
                                }
                                label="노출 여부"
                              />
                            </Box>
                          )}
                        </TableCell>
                      ))}
                      <TableCell tw="min-w-[5rem]">{event.price.toLocaleString()}원</TableCell>
                      <TableCell tw="min-w-[5rem]" onClick={(e) => e.stopPropagation()}>
                        <FormGroup>
                          {Object.keys(CreateEventDtoLabelItem).map((key) => {
                            const label =
                              CreateEventDtoLabelItem[key as keyof typeof CreateEventDtoLabelItem]
                            return (
                              <FormControlLabel
                                key={key}
                                control={
                                  <Checkbox
                                    value={event.label?.includes(label)}
                                    onChange={(e) => {
                                      const { checked } = e.target
                                      if (checked) {
                                        onChange(event, "label", [...(event.label ?? []), label])
                                      } else {
                                        onChange(
                                          event,
                                          "label",
                                          (event.label ?? []).filter((l) => l !== label),
                                        )
                                      }
                                    }}
                                    checked={event.label?.includes(label) ?? false}
                                  />
                                }
                                label={label}
                              />
                            )
                          })}
                        </FormGroup>
                      </TableCell>
                      <TableCell tw="min-w-[5rem]">{event.order}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box tw="border-x border-[#ddd] py-4 flex justify-center">
            <Pagination
              count={events?.meta?.totalPages ?? 0}
              page={page}
              onChange={(_, p) => setPage(p)}
            />
          </Box>
        </Paper>
        <Box tw="flex justify-between my-4">
          <Box tw="flex gap-3">
            <Button variant="contained" onClick={() => setOpenCreateDrawer(true)}>
              행 추가
            </Button>
            {/* <Button variant="contained" color="inherit" onClick={() => setOpenCreateDrawer(true)}>
              미리보기
            </Button> */}
          </Box>
        </Box>

        <Box tw="flex justify-end my-4">
          <Box tw="flex gap-3">
            <Button variant="contained" onClick={() => setOpenLoadModal(true)}>
              저장
            </Button>
          </Box>
        </Box>

        <EventFormDrawer
          open={!!selectedEvent || openCreateDrawer}
          key={(!!selectedEvent || openCreateDrawer).toString()}
          onClose={(shouldRefetch?: boolean) => {
            if (shouldRefetch) {
              refetch()
            }
            setSelectedEvent(null)
            setOpenCreateDrawer(false)
          }}
          event={selectedEvent as unknown as ExtendedEvent}
          backupBundleId={id}
        />

        <LoadEventBundleModal
          open={openLoadModal}
          onClose={() => {
            setOpenLoadModal(false)
          }}
        />
      </Box>
    </LocalizationProvider>
  )
}

export default SavedEventListPage
