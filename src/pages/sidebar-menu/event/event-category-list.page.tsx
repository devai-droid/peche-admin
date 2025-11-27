import {
  eventCategoryControllerRemove,
  useEventCategoryControllerCreate,
  useEventCategoryControllerFindManyWithPaginationQuery,
  useEventCategoryControllerUpdate,
} from "@/lib/orval/event-categories/event-categories"
import { EventCategory } from "@/lib/orval/model"
import { ExtendedEventCategory, ExtendedEventCategoryList } from "@/lib/types/event.type"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material"
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useQueryClient } from "@tanstack/react-query"
import dayjs, { Dayjs } from "dayjs"
import { isNumber } from "lodash"
import React from "react"
import EventCategoryImageDrawer from "./components/event-category-list/event-category-image-drawer.component"

const EventCategoryListPage = () => {
  const queryClient = useQueryClient()
  const { mutate: createEventCategory, isLoading: isCreatingEventCategory } =
    useEventCategoryControllerCreate()

  const {
    data: eventCategories,
    refetch,
    queryKey,
  } = useEventCategoryControllerFindManyWithPaginationQuery<ExtendedEventCategoryList>({
    page: 1,
    limit: 1000,
  })

  const { mutate: updateEventCategory } = useEventCategoryControllerUpdate()
  const onChange = (
    item: ExtendedEventCategory,
    keyValue: { key: keyof ExtendedEventCategory; value: unknown }[],
  ) => {
    queryClient.setQueryData<ExtendedEventCategoryList | undefined>(queryKey, (old) => {
      if (!old || !old.items) {
        return old
      }
      const changeObj = keyValue.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.key]: cur.value,
        }
      }, {})
      return {
        ...old,
        items: old.items.map((oldItem) => {
          if (oldItem.id === item.id) {
            const newData = {
              ...oldItem,
              ...changeObj,
            }
            updateEventCategory({
              id: item.id,
              data: changeObj,
            })
            return newData
          }
          return oldItem
        }),
      }
    })
  }

  const [selectedCategory, setSelectedCategory] = React.useState<ExtendedEventCategory | null>(null)
  const [openDrawer, setOpenDrawer] = React.useState(false)

  const names = [
    {
      key: "name",
      label: "대분류명",
    },
    // {
    //   key: "description",
    //   label: "설명",
    // },
    {
      key: "nameEN",
      label: "대분류명(영어)",
    },
    // {
    //   key: "descriptionEN",
    //   label: "설명(영어)",
    // },
    {
      key: "nameZH",
      label: "대분류명(중국어 간체)",
    },
    // {
    //   key: "descriptionZH",
    //   label: "설명(중국어 간체)",
    // },
    {
      key: "nameZHTW",
      label: "대분류명(중국어 번체)",
    },
    // {
    //   key: "descriptionZHTW",
    //   label: "설명(중국어 번체)",
    // },
    {
      key: "nameJA",
      label: "대분류명(일본어)",
    },
    // {
    //   key: "descriptionJA",
    //   label: "설명(일본어)",
    // },
    {
      key: "nameTH",
      label: "대분류명(태국어)",
    },
    // {
    //   key: "descriptionTH",
    //   label: "설명(태국어)",
    // },
  ] as const

  const handleDelete = (categoryId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm("해당 이벤트 대분류를 정말 삭제하시겠습니까?")) {
      eventCategoryControllerRemove(categoryId)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <Box tw="pb-8">
        <Typography variant="h2">이벤트 대분류 관리</Typography>
        <Paper tw="mt-8 rounded-none">
          <TableContainer>
            <Table
              sx={{
                minWidth: 650,
                "& .MuiTableCell-root": {
                  border: "1px solid #d0d0d0",
                },
              }}>
              <TableHead tw="bg-[#eee]">
                <TableRow tw="[&>*]:!text-center">
                  <TableCell>사용</TableCell>
                  {names.map((name) => (
                    <TableCell key={name.label}>{name.label}</TableCell>
                  ))}
                  <TableCell>이미지</TableCell>
                  <TableCell>최소금액</TableCell>
                  <TableCell>할인율(%)</TableCell>
                  {/* <TableCell>날짜설정</TableCell> */}
                  <TableCell>요일설정</TableCell>
                  {/* <TableCell>시간설정</TableCell> */}
                  <TableCell>우선순위</TableCell>
                  <TableCell>삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventCategories?.items?.map((category) => {
                  return (
                    <TableRow tabIndex={-1} key={category.id}>
                      <TableCell>
                        <Checkbox
                          value={category.status === "ACTIVE"}
                          checked={category.status === "ACTIVE"}
                          onChange={(e) => {
                            onChange(category, [
                              {
                                key: "status",
                                value: e.currentTarget.checked ? "ACTIVE" : "INACTIVE",
                              },
                            ])
                          }}
                        />
                      </TableCell>
                      {names.map((name) => (
                        <TableCell
                          tw="p-0"
                          key={name.key}
                          onClick={(e) => {
                            const child = e.currentTarget.children[0] as HTMLInputElement
                            child.focus()
                          }}>
                          <TextareaAutosize
                            tw="w-full resize-none p-1"
                            defaultValue={category[name.key] || ""}
                            name={name.key}
                            onBlur={(e) =>
                              onChange(category, [
                                {
                                  key: e.currentTarget.name as keyof EventCategory,
                                  value: e.currentTarget.value,
                                },
                              ])
                            }
                          />
                        </TableCell>
                      ))}
                      <TableCell
                        tw="text-center cursor-pointer"
                        onClick={() => {
                          setSelectedCategory(category)
                          setOpenDrawer(true)
                        }}>
                        {category.image?.url ? (
                          <img
                            src={category.image.url}
                            alt="thumb"
                            width={60}
                            height={60}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div tw="text-sm">이미지 없음</div>
                        )}
                      </TableCell>
                      {/* ⭐ 최소금액 */}
                      <TableCell tw="text-center">
                        <input
                          type="number"
                          tw="w-full text-center"
                          value={category.minPrice ?? ""}
                          onChange={(e) => {
                            onChange(category, [
                              {
                                key: "minPrice",
                                value: e.target.value === "" ? null : parseInt(e.target.value, 10),
                              },
                            ])
                          }}
                        />
                      </TableCell>

                      {/* ⭐ 할인율 */}
                      <TableCell tw="text-center">
                        <input
                          type="number"
                          tw="w-full text-center"
                          value={category.discountPercent ?? ""}
                          onChange={(e) => {
                            onChange(category, [
                              {
                                key: "discountPercent",
                                value: e.target.value === "" ? null : parseInt(e.target.value, 10),
                              },
                            ])
                          }}
                        />
                      </TableCell>

                      {/* <TableCell tw="w-40 text-center">
                        <DatePicker
                          value={category.startDate ? dayjs(category.startDate) : null}
                          onChange={(value: Dayjs | null) => {
                            if (value) {
                              onChange(category, [
                                {
                                  key: "startDate",
                                  value: value.format("YYYY-MM-DD"),
                                },
                              ])
                            }
                          }}
                        />
                        ~{" "}
                        <DatePicker
                          value={category.endDate ? dayjs(category.endDate) : null}
                          onChange={(value: Dayjs | null) => {
                            if (value) {
                              onChange(category, [
                                {
                                  key: "endDate",
                                  value: value.format("YYYY-MM-DD"),
                                },
                              ])
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            onChange(category, [
                              {
                                key: "startDate",
                                value: null,
                              },
                              {
                                key: "endDate",
                                value: null,
                              },
                            ])
                          }}>
                          초기화
                        </Button>
                      </TableCell> */}
                      <TableCell tw="w-36">
                        {["월", "화", "수", "목", "금", "토", "일"].map((day, index) => {
                          const value = (index + 1) % 7
                          return (
                            <FormControlLabel
                              key={day}
                              control={
                                <Checkbox
                                  checked={category.dayOfWeek?.includes(value)}
                                  onChange={(e) => {
                                    onChange(category, [
                                      {
                                        key: "dayOfWeek",
                                        value: e.currentTarget.checked
                                          ? [...category.dayOfWeek, value]
                                          : category.dayOfWeek.filter((d) => d !== value),
                                      },
                                    ])
                                  }}
                                />
                              }
                              label={day}
                            />
                          )
                        })}
                      </TableCell>
                      {/* <TableCell tw="w-36 text-center">
                        <TimePicker
                          value={
                            isNumber(category.startHour) && isNumber(category.startMinute)
                              ? dayjs().hour(category.startHour).minute(category.startMinute)
                              : null
                          }
                          onChange={(value: Dayjs | null) => {
                            if (value) {
                              onChange(category, [
                                {
                                  key: "startHour",
                                  value: value.hour(),
                                },
                                {
                                  key: "startMinute",
                                  value: value.minute(),
                                },
                              ])
                            }
                          }}
                          minutesStep={30}
                        />
                        ~
                        <TimePicker
                          value={
                            isNumber(category.endHour) && isNumber(category.endMinute)
                              ? dayjs().hour(category.endHour).minute(category.endMinute)
                              : null
                          }
                          onChange={(value: Dayjs | null) => {
                            if (value) {
                              onChange(category, [
                                {
                                  key: "endHour",
                                  value: value.hour(),
                                },
                                {
                                  key: "endMinute",
                                  value: value.minute(),
                                },
                              ])
                            }
                          }}
                          minutesStep={30}
                        />
                        <Button
                          onClick={() => {
                            onChange(category, [
                              {
                                key: "startHour",
                                value: null,
                              },
                              {
                                key: "endHour",
                                value: null,
                              },
                            ])
                          }}>
                          초기화
                        </Button>
                      </TableCell> */}
                      <TableCell tw="text-center">
                        <input
                          type="number"
                          tw="w-full text-center"
                          value={category.order || ""}
                          onChange={(e) => {
                            onChange(category, [
                              {
                                key: "order",
                                value: parseInt(e.target.value, 10),
                              },
                            ])
                          }}
                        />
                      </TableCell>
                      <TableCell tw="text-center">
                        {/* Delete button */}
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={category.status === "ACTIVE"}
                          onClick={() => handleDelete(category.id)}>
                          삭제
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Box tw="flex justify-between my-4">
          <Button
            variant="contained"
            onClick={() => createEventCategory({ data: {} }, { onSuccess: () => refetch() })}>
            행 추가
          </Button>
        </Box>
      </Box>
      <EventCategoryImageDrawer
        open={openDrawer}
        category={selectedCategory}
        onClose={(saved: any) => {
          if (saved) refetch()
          setOpenDrawer(false)
          setSelectedCategory(null)
        }}
      />
    </LocalizationProvider>
  )
}

export default EventCategoryListPage
