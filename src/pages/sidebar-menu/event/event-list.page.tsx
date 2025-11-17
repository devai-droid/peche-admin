import { CreateEventDtoLabelItem, EventBundle, EventList } from "@/lib/orval/model"
import { useEventControllerFindMany, useEventControllerUpdate } from "@/lib/orval/events/events"
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
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
  TextField,
  Typography,
} from "@mui/material"
import { useQueryClient } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { useIntegratedCrmCategoryControllerFindMany } from "@/lib/orval/integrated-crm-categories/integrated-crm-categories"
import { toast } from "@/design-system/components"
import { ToastType } from "@/design-system/components/toast/toast.component.type"
import { ExtendedEvent } from "@/lib/types/event.type"
import EventFormDrawer from "./components/event-list/event-form-drawer.component"
import EventBackupListModal from "./components/event-list/backup-list-modal.component"
import {
  useEventBundleControllerCreate,
  useEventBundleControllerFindManyInfinite,
  useEventBundleControllerFindVisible,
  useEventBundleControllerRemove,
  useEventBundleControllerUpdate,
} from "@/lib/orval/event-bundle/event-bundle"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "@mui/icons-material"
import tw from "twin.macro"
import dayjs from "dayjs"
import { getNextPageParam } from "@/lib/api/http-client.helper"
import PostConfirmModal from "./components/event-list/post-confirm-modal.component"
import { useEventBackupBundleControllerCreate } from "@/lib/orval/event-backup-bundle/event-backup-bundle"
import { useEventCategoryControllerFindManyWithPaginationQuery } from "@/lib/orval/event-categories/event-categories"
import { useProductDetailPageControllerFindMany } from "@/lib/orval/product-detail-pages/product-detail-pages"
import EventSheetUrlModal from "./components/event-list/event-sheet-url-modal.component"

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

const EventListPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = React.useState(1)
  const queryClient = useQueryClient()
  const [selectedEventBundle, setSelectedEventBundle] = React.useState<EventBundle | null>(null)
  const [selectedDetail, setSelectedDetail] = React.useState("")
  const [selectedCrmCategory, setSelectedCrmCategory] = React.useState("")
  const [selectedEventCategory, setSelectedEventCategory] = React.useState("")
  const [selectedSortBy, setSelectedSortBy] = React.useState("")
  const [selectedSortOrder, setSelectedSortOrder] = React.useState("")

  const { data: eventCategories, isLoading: isCategoriesLoading } =
    useEventCategoryControllerFindManyWithPaginationQuery({
      page,
      limit: 100,
    })
  const {
    data: events,
    refetch,
    queryKey,
  } = useEventControllerFindMany(
    {
      page,
      limit: 100,
      bundleId: selectedEventBundle?.id,
      ...(selectedSortBy && { sortBy: [selectedSortBy] }),
      ...(selectedSortOrder && { sortOrder: [selectedSortOrder] }),
      ...(selectedDetail && { detailPageId: selectedDetail }),
      ...(selectedCrmCategory && { integratedCrmCategoryId: selectedCrmCategory }),
      ...(selectedEventCategory && { categoryId: selectedEventCategory }),
    },
    {
      query: {
        enabled: !!selectedEventBundle?.id,
      },
    },
  )

  const { mutate: deleteEventBundle } = useEventBundleControllerRemove()
  const { mutate: updateEvent } = useEventControllerUpdate()
  const { mutateAsync: updateEventBundle, isLoading: isUpdateBundleLoading } =
    useEventBundleControllerUpdate()

  const [selectedEvent, setSelectedEvent] = React.useState<ExtendedEvent | null>(null)
  const [openCreateDrawer, setOpenCreateDrawer] = React.useState(false)
  const { data: integratedCrmCategories } = useIntegratedCrmCategoryControllerFindMany()
  const { data: visibleBundle, refetch: refetchVisible } = useEventBundleControllerFindVisible()
  const {
    data: eventBundles,
    refetch: refetchBundle,
    fetchNextPage,
    hasNextPage,
  } = useEventBundleControllerFindManyInfinite(
    {
      limit: 20,
    },
    {
      query: {
        getNextPageParam,
      },
    },
  )
  const { mutate: createEventBundle } = useEventBundleControllerCreate()
  const [bundlePage, setBundlePage] = React.useState(1)
  const [postTarget, setPostTarget] = React.useState<{
    direction: "left" | "right"
    bundle?: EventBundle
  } | null>(null)

  useEffect(() => {
    if (!selectedEventBundle && eventBundles?.pages?.[0]?.items?.[0]?.id) {
      setSelectedEventBundle(eventBundles?.pages?.[0]?.items?.[0])
    }
  }, [eventBundles, selectedEventBundle])

  const { mutate: backupEvents, isLoading: isBackupLoading } =
    useEventBackupBundleControllerCreate()

  const { data: details } = useProductDetailPageControllerFindMany({
    page: 1,
    limit: 1000,
  })
  // 상세페이지 이름을 한글 기준으로 정렬 (요청받은 기능)
  const sortedDetails = details?.items
    ? [...details.items].sort((a, b) => a.name.localeCompare(b.name, "ko"))
    : []

  const [openBackupListModal, setOpenBackupListModal] = React.useState(false)
  const [openSheetUrlModal, setOpenSheetUrlModal] = React.useState(false)

  const onChange = (item: ExtendedEvent, key: keyof ExtendedEvent, value: unknown) => {
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

  const onChangeBundle = (key: keyof EventBundle, value: unknown) => {
    if (!selectedEventBundle) {
      return
    }
    setSelectedEventBundle({
      ...selectedEventBundle,
      [key]: value,
    })
  }

  const onChangePostBundleTarget = (direction: "left" | "right", bundle?: EventBundle) => {
    setPostTarget({
      direction,
      bundle,
    })
  }

  const postBundle = async () => {
    if (!postTarget) {
      return
    }
    const key = postTarget.direction === "left" ? "visibleFirst" : "visibleSecond"
    const prevSecond = visibleBundle?.find((b) => b[key])
    if (prevSecond) {
      await updateEventBundle({
        id: prevSecond.id,
        data: {
          [key]: false,
        },
      })
    }

    if (postTarget.bundle) {
      await updateEventBundle({
        id: postTarget.bundle.id,
        data: {
          ...postTarget.bundle,
          [key]: true,
        },
      })
    }

    window.location.reload()
  }

  const postedFirst = visibleBundle?.find((b) => b.visibleFirst)
  const postedSecond = visibleBundle?.find((b) => b.visibleSecond)

  const getBadgeContent = (bundle: EventBundle) => {
    if (bundle.id === postedFirst?.id) {
      return "L"
    }
    if (bundle.id === postedSecond?.id) {
      return "R"
    }
    return null
  }

  if (isCategoriesLoading) {
    return null
  }

  return (
    <LocalizationProvider adapterLocale="ko" dateAdapter={AdapterDayjs}>
      {isUpdateBundleLoading && ( // Show overlay with loading spinner
        <Box
          tw="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50"
          style={{ backdropFilter: "blur(8px)" }}>
          <CircularProgress />
        </Box>
      )}
      <Box tw="pb-8">
        <Typography variant="h2">이벤트 목록</Typography>
        <Box tw="flex items-center my-4">
          <Button
            variant="contained"
            onClick={() =>
              createEventBundle(
                {
                  data: {
                    name: "새로운 이벤트",
                  },
                },
                {
                  onSuccess: (data) => {
                    refetchBundle()
                    setBundlePage(1)
                    setSelectedEventBundle(data)
                  },
                },
              )
            }>
            + 목록 생성
          </Button>
          <Box tw="flex flex-1 justify-center items-center gap-4">
            <Box>
              <Typography tw="mr-2 inline">왼쪽:</Typography>
              <Select
                value={postedFirst?.id ?? ""}
                onChange={(e) => {
                  onChangePostBundleTarget(
                    "left",
                    eventBundles?.pages
                      ?.flatMap((p) => p.items)
                      .find((b) => b.id === e.target.value),
                  )
                }}>
                <MenuItem
                  value=""
                  onClick={() => {
                    onChangePostBundleTarget("left")
                  }}>
                  <em>None</em>
                </MenuItem>
                {postedFirst && (
                  <MenuItem value={postedFirst?.id} disabled>
                    {postedFirst?.name}
                  </MenuItem>
                )}
                {eventBundles?.pages
                  .flatMap((p) => p.items)
                  .filter((b) => b.id !== postedFirst?.id)
                  .map((bundle) => (
                    <MenuItem key={bundle.id} value={bundle.id}>
                      {bundle.name}
                    </MenuItem>
                  )) ?? []}
                <MenuItem css={!hasNextPage && tw`hidden`} value="button">
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      fetchNextPage()
                    }}>
                    더 보기
                  </Button>
                </MenuItem>
              </Select>
            </Box>
            <Box>
              <Typography tw="mr-2 inline">오른쪽:</Typography>{" "}
              <Select
                value={postedSecond?.id ?? ""}
                onChange={(e) => {
                  onChangePostBundleTarget(
                    "right",
                    eventBundles?.pages
                      ?.flatMap((p) => p.items)
                      .find((b) => b.id === e.target.value),
                  )
                }}>
                <MenuItem
                  value=""
                  onClick={() => {
                    onChangePostBundleTarget("right")
                  }}>
                  <em>None</em>
                </MenuItem>
                {postedSecond && (
                  <MenuItem value={postedSecond?.id} disabled>
                    {postedSecond?.name}
                  </MenuItem>
                )}
                {eventBundles?.pages
                  .flatMap((p) => p.items)
                  .filter((b) => b.id !== postedSecond?.id)
                  .map((bundle) => (
                    <MenuItem key={bundle.id} value={bundle.id}>
                      {bundle.name}
                    </MenuItem>
                  )) ?? []}
                <MenuItem css={!hasNextPage && tw`hidden`} value="button">
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      fetchNextPage()
                    }}>
                    더 보기
                  </Button>
                </MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>

        <Box tw="flex gap-2">
          <IconButton
            css={bundlePage === 1 && tw`opacity-0 pointer-events-none`}
            disabled={bundlePage === 1}
            onClick={() => setBundlePage((p) => p - 1)}>
            <ArrowLeft />
          </IconButton>
          {eventBundles?.pages
            ?.flatMap((p) => p.items)
            .sort((a, b) => {
              // Prioritize bundles with visibleFirst
              if (a.visibleFirst) return -1
              if (b.visibleFirst) return 1

              // If no visibleFirst, prioritize bundles with visibleSecond
              if (a.visibleSecond) return -1
              if (b.visibleSecond) return 1

              return 0 // No change in order
            })
            .slice((bundlePage - 1) * 5, bundlePage * 5)
            .map((bundle) => (
              <Badge key={bundle.id} badgeContent={getBadgeContent(bundle)} color="error">
                <Button
                  variant="contained"
                  color={bundle.id === selectedEventBundle?.id ? "success" : "secondary"}
                  onClick={() => {
                    setSelectedEventBundle(bundle)
                  }}>
                  {bundle.name}
                </Button>
              </Badge>
            ))}
          <IconButton
            disabled={(eventBundles?.pages?.flatMap((p) => p.items).length ?? 0) / 5 < bundlePage}
            css={
              (eventBundles?.pages?.flatMap((p) => p.items).length ?? 0) / 5 < bundlePage &&
              tw`opacity-0 pointer-events-none`
            }
            onClick={() => {
              setBundlePage((p) => p + 1)
              if (
                (eventBundles?.pages?.flatMap((p) => p.items).length ?? 0) / 5 ===
                bundlePage + 1
              ) {
                fetchNextPage()
              }
            }}>
            <ArrowRight />
          </IconButton>
        </Box>

        <Paper
          key={selectedEventBundle?.id ?? ""}
          tw="my-6 p-4"
          css={!selectedEventBundle && tw`hidden`}>
          <Box tw="flex gap-6">
            <Box>
              <BundleLabel variant="h4">이벤트 타이틀</BundleLabel>
              <TextField
                variant="outlined"
                value={selectedEventBundle?.name ?? ""}
                onChange={(e) => {
                  onChangeBundle("name", e.target.value)
                }}
              />
            </Box>
            <Box>
              <BundleLabel variant="h4">상태</BundleLabel>
              <Typography
                color={
                  selectedEventBundle?.visibleFirst || selectedEventBundle?.visibleSecond
                    ? "error"
                    : "success"
                }>
                {selectedEventBundle?.visibleFirst || selectedEventBundle?.visibleSecond
                  ? "게시중"
                  : "미게시"}
              </Typography>
            </Box>
          </Box>
          <Box tw="flex gap-6 my-4">
            <Box>
              <BundleLabel variant="h4">홈페이지 게시일</BundleLabel>
              <DatePicker
                value={
                  selectedEventBundle?.postStartDate
                    ? dayjs(selectedEventBundle?.postStartDate)
                    : null
                }
                onChange={(date) => onChangeBundle("postStartDate", date)}
              />
            </Box>
            <Box>
              <BundleLabel variant="h4">홈페이지 게시기간</BundleLabel>
              <Box tw="flex gap-2 items-center">
                <DatePicker
                  value={
                    selectedEventBundle?.postStartDate
                      ? dayjs(selectedEventBundle?.postStartDate)
                      : null
                  }
                  onChange={(date) => onChangeBundle("postStartDate", date)}
                />
                부터
                <DatePicker
                  value={
                    selectedEventBundle?.postEndDate
                      ? dayjs(selectedEventBundle?.postEndDate)
                      : null
                  }
                  onChange={(date) => onChangeBundle("postEndDate", date)}
                />
              </Box>
            </Box>
            <Box>
              <BundleLabel variant="h4">이벤트 기간</BundleLabel>
              <Box tw="flex gap-2 items-center">
                <DatePicker
                  value={
                    selectedEventBundle?.startDate ? dayjs(selectedEventBundle?.startDate) : null
                  }
                  onChange={(date) => onChangeBundle("startDate", date)}
                />
                부터
                <DatePicker
                  value={selectedEventBundle?.endDate ? dayjs(selectedEventBundle?.endDate) : null}
                  onChange={(date) => onChangeBundle("endDate", date)}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box tw="mb-4 mt-4" style={{ display: "flex", flexDirection: "column" }}>
          {/* First Row: Detail and CRM Category Select */}
          <Box style={{ display: "flex", width: "100%" }}>
            <Box style={{ width: "20%" }}>
              <Select
                fullWidth
                displayEmpty
                value={selectedEventCategory}
                onChange={(e) => {
                  setPage(1)
                  setSelectedEventCategory(e.target.value)
                  refetch()
                }}>
                <MenuItem value="">
                  <em>이벤트 대분류</em>
                </MenuItem>
                {eventCategories?.items?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box style={{ width: "20%" }}>
              <Select
                fullWidth
                displayEmpty
                value={selectedDetail}
                onChange={(e) => {
                  setPage(1)
                  setSelectedDetail(e.target.value)
                  refetch()
                }}>
                <MenuItem value="">
                  <em>상세페이지</em>
                </MenuItem>
                {/* {details?.items?.map((detail) => ( */}
                {sortedDetails?.map((detail) => (
                  <MenuItem key={detail.id} value={detail.id}>
                    {detail.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box style={{ width: "20%" }}>
              <Select
                fullWidth
                displayEmpty
                value={selectedCrmCategory}
                onChange={(e) => {
                  setPage(1)
                  setSelectedCrmCategory(e.target.value) // Update selected CRM Category
                  refetch()
                }}>
                <MenuItem value="">
                  <em>CRM 카테고리</em>
                </MenuItem>
                {integratedCrmCategories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          {/* Second Row: SortBy and SortOrder Select */}
          <Box
            style={{
              display: "flex",
              width: "100%",
              marginTop: "16px",
            }}>
            <Box style={{ width: "20%" }}>
              <Select
                fullWidth
                displayEmpty
                value={selectedSortBy}
                onChange={(e) => {
                  setPage(1)
                  setSelectedSortBy(e.target.value)
                  refetch()
                }}>
                <MenuItem value="">
                  <em>가격필터</em> {/* None */}
                </MenuItem>
                <MenuItem value="discountPrice">이벤트가격 {/* Discount Price */}</MenuItem>
                <MenuItem value="price">일반가격 {/* Discount Price */}</MenuItem>
              </Select>
            </Box>

            <Box style={{ width: "20%" }}>
              <Select
                fullWidth
                displayEmpty
                value={selectedSortOrder}
                onChange={(e) => {
                  setPage(1)
                  setSelectedSortOrder(e.target.value)
                  refetch()
                }}>
                <MenuItem value="">
                  <em>오름차순/내림차순</em> {/* None */}
                </MenuItem>
                <MenuItem value="ASC">오름차순 {/* ASC */}</MenuItem>
                <MenuItem value="DESC">내림차순 {/* DESC */}</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>

        <Paper
          tw="mt-8 rounded-none"
          css={!selectedEventBundle && tw`hidden`}
          style={{ width: "fit-content" }}>
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
                  <TableCell>할인가격</TableCell>
                  <TableCell>라벨</TableCell>
                  <TableCell>우선순위(인기)</TableCell>
                  <TableCell>상세페이지 노출 여부</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events?.items?.map((p) => {
                  const event = p as ExtendedEvent
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
                          {/* {details?.items.map((detail) => ( */}
                          {sortedDetails?.map((detail) => (
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
                        <TableCell
                          tw="p-1 min-w-[5rem]"
                          style={{ minWidth: "250px" }}
                          key={name.key}>
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
                      <TableCell tw="min-w-[5rem]">
                        {event.discountPrice?.toLocaleString()}원
                      </TableCell>
                      <TableCell tw="min-w-[5rem]" onClick={(e) => e.stopPropagation()}>
                        <FormGroup>
                          {Object.keys(CreateEventDtoLabelItem).map((key) => {
                            const label =
                              CreateEventDtoLabelItem[key as keyof typeof CreateEventDtoLabelItem]

                            // 임시 픽스. 추후 백엔드에서 변경 필요
                            const displayLabel = label === "POP" ? "EVENT" : label
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
                                // label={label}
                                label={displayLabel} // Use displayLabel here for showing 'EVENT'
                              />
                            )
                          })}
                        </FormGroup>
                      </TableCell>
                      <TableCell tw="min-w-[5rem]">{event.order}</TableCell>
                      <TableCell tw="min-w-[5rem]" onClick={(e) => e.stopPropagation()}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(event.detailPageShow)}
                              onChange={(e) => {
                                const { checked } = e.target
                                onChange(event, "detailPageShow", checked)
                              }}
                            />
                          }
                          label="노출"
                        />
                      </TableCell>
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
        <Box tw="flex justify-between my-4" css={!selectedEventBundle && tw`hidden`}>
          <Box tw="flex gap-3">
            <Button variant="contained" onClick={() => setOpenCreateDrawer(true)}>
              행 추가
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => setOpenBackupListModal(true)}>
              불러오기
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() =>
                backupEvents(
                  {
                    data: {
                      eventBundleId: selectedEventBundle?.id ?? "",
                    },
                  },
                  {
                    onSuccess: () => {
                      toast({
                        message: "임시저장 완료",
                        type: ToastType.Success,
                      })
                    },
                  },
                )
              }
              disabled={isBackupLoading}>
              임시저장
            </Button>
            {/* <Button variant="contained" color="inherit" onClick={() => setOpenCreateDrawer(true)}>
              미리보기
            </Button> */}
          </Box>
          <Button
            variant="contained"
            onClick={() => setOpenSheetUrlModal(true)}
            disabled={!selectedEventBundle}>
            구글시트에서 임포트
          </Button>
        </Box>

        <Box tw="flex justify-end my-4" css={!selectedEventBundle && tw`hidden`}>
          <Box tw="flex gap-3">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (selectedEventBundle) {
                  // eslint-disable-next-line no-alert
                  if (window.confirm("해당 이벤트 목록을 삭제하시겠습니까?")) {
                    deleteEventBundle(
                      {
                        id: selectedEventBundle.id,
                      },
                      {
                        onSuccess: () => {
                          refetchBundle()
                          setSelectedEventBundle(null)
                          toast({
                            message: "이벤트 목록이 성공적으로 삭제되었습니다.",
                            type: ToastType.Success,
                          })
                        },
                      },
                    )
                  }
                }
              }}>
              삭제
            </Button>
            <Button
              color="inherit"
              variant="contained"
              disabled={!selectedEventBundle?.visibleFirst && !selectedEventBundle?.visibleSecond}
              onClick={() => {
                onChangePostBundleTarget(selectedEventBundle?.visibleFirst ? "left" : "right")
              }}>
              이벤트 바로 내리기
            </Button>

            <Box tw="relative">
              <Button tw="px-6" variant="contained" disabled={isBackupLoading}>
                바로 게시하기
              </Button>
              <ButtonGroup
                color="info"
                variant="contained"
                tw="absolute inset-0"
                disabled={isUpdateBundleLoading}>
                <Button
                  tw="opacity-0 hover:opacity-100"
                  onClick={() => {
                    if (selectedEventBundle) {
                      onChangePostBundleTarget("left", selectedEventBundle)
                    }
                  }}>
                  왼쪽
                </Button>
                <Button
                  tw="opacity-0 hover:opacity-100"
                  onClick={() => {
                    if (selectedEventBundle) {
                      onChangePostBundleTarget("right", selectedEventBundle)
                    }
                  }}>
                  오른쪽
                </Button>
              </ButtonGroup>
            </Box>

            <Button
              variant="contained"
              onClick={() =>
                updateEventBundle({
                  id: selectedEventBundle?.id ?? "",
                  data: selectedEventBundle ?? {},
                }).then((res) => {
                  refetchVisible()
                })
              }>
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
          event={selectedEvent}
          bundleId={selectedEventBundle?.id}
        />

        <EventBackupListModal
          key={openBackupListModal.toString()}
          open={openBackupListModal}
          onClose={() => setOpenBackupListModal(false)}
        />
        <EventSheetUrlModal
          key={openSheetUrlModal.toString()}
          open={openSheetUrlModal}
          onClose={(shouldRefetch?: boolean) => {
            if (shouldRefetch) {
              refetch()
            }
            setOpenSheetUrlModal(false)
          }}
          bundleId={selectedEventBundle?.id}
        />
      </Box>

      <PostConfirmModal
        open={!!postTarget}
        handleClose={() => {
          setPostTarget(null)
        }}
        handleConfirm={() => {
          postBundle()
        }}
        leftName={postTarget?.direction === "left" ? postTarget?.bundle?.name : postedFirst?.name}
        rightName={
          postTarget?.direction === "right" ? postTarget?.bundle?.name : postedSecond?.name
        }
      />
    </LocalizationProvider>
  )
}

export default EventListPage
