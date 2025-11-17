/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import tw from "twin.macro"
import {
  useCrmCategoryControllerFindMany,
  useCrmCategoryControllerRefreshCrmCategories,
  useCrmCategoryControllerUpdateCrmCategory,
} from "@/lib/orval/crm-categories/crm-categories"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "@/design-system/components"
import { ToastType } from "@/design-system/components/toast/toast.component.type"
import {
  useLangCrmCategoryControllerBulkCreate,
  useLangCrmCategoryControllerBulkUpdate,
  useLangCrmCategoryControllerFindMany,
  useLangCrmCategoryControllerRemove,
} from "@/lib/orval/lang-crm-categories/lang-crm-categories"
import {
  CreateLangCrmCategoryDto,
  CreateLangCrmCategoryDtoBuildingPrioritiesItem,
  LangCrmCategory,
  UpdateLangCrmCategoryDto,
} from "@/lib/orval/model"

const inputCss = tw`min-w-[12rem] w-[calc(100% - 6rem)] max-w-xs`
const orderInputCss = tw`ml-2 w-16 [& input]:text-center`

const LanguageCrmCategory = () => {
  const queryClient = useQueryClient()
  const { data: crmCategories, queryKey } = useCrmCategoryControllerFindMany()
  const { mutate: reloadCategories, isLoading: reloadLoading } =
    useCrmCategoryControllerRefreshCrmCategories({
      mutation: {
        onSuccess: (data) => {
          queryClient.setQueryData(queryKey, data)
        },
      },
    })

  const [count, setCount] = useState(1)

  const { data: langCRMData, refetch: refetchLangCRM } = useLangCrmCategoryControllerFindMany()
  const [langCrmCategories, setLangCrmCategories] = useState<LangCrmCategory[]>([])
  const [localLangCrmCategories, setLocalLangCrmCategories] = useState<CreateLangCrmCategoryDto[]>(
    [],
  )
  const [removedLangCrmCategories, setRemovedLangCrmCategories] = useState<LangCrmCategory[]>([])
  const [crmCategorySlots, setCrmCategorySlots] = useState<{ [id: string]: number }>({})

  useEffect(() => {
    queryClient.invalidateQueries(["langCrmCategoryControllerFindMany"])
    refetchLangCRM()
  }, [queryClient, refetchLangCRM])

  useEffect(() => {
    if (langCRMData?.length) {
      setLangCrmCategories(langCRMData)
    }
  }, [langCRMData])

  const { mutateAsync: bulkCreate } = useLangCrmCategoryControllerBulkCreate()
  const { mutateAsync: bulkUpdate } = useLangCrmCategoryControllerBulkUpdate()
  const { mutateAsync: removeLangCategory } = useLangCrmCategoryControllerRemove()
  const { mutateAsync: updateCategory } = useCrmCategoryControllerUpdateCrmCategory()
  const onChangeLocalLangCRMCategory = (
    category: CreateLangCrmCategoryDto,
    key: keyof CreateLangCrmCategoryDto,
    value: unknown,
  ) => {
    setLocalLangCrmCategories((prev) => {
      const index = prev.findIndex((item) => item === category)
      if (index === -1) {
        return prev
      }

      return [
        ...prev.slice(0, index),
        {
          ...prev[index],
          [key]: value,
        },
        ...prev.slice(index + 1),
      ]
    })
  }

  const onChangeLangCategory = (
    category: LangCrmCategory,
    key: keyof UpdateLangCrmCategoryDto,
    value: unknown,
  ) => {
    setLangCrmCategories((prev) => {
      const index = prev.findIndex((item) => item === category)
      if (index === -1) {
        return prev
      }

      return [
        ...prev.slice(0, index),
        {
          ...prev[index],
          [key]: value,
        },
        ...prev.slice(index + 1),
      ]
    })
  }

  const onSave = async () => {
    const jobs = []
    if (localLangCrmCategories.length) {
      jobs.push(
        bulkCreate({
          data: localLangCrmCategories.map((item) => ({
            ...item,
          })),
        }),
      )
    }
    if (removedLangCrmCategories.length) {
      removedLangCrmCategories.forEach((item) => {
        jobs.push(removeLangCategory({ id: item.id }))
      })
    }
    jobs.push(
      bulkUpdate({
        data: langCrmCategories.map((crm) => ({
          ...crm,
        })) as UpdateLangCrmCategoryDto[],
      }),
    )

    jobs.push(
      Object.entries(crmCategorySlots).map(([code, maxSlot]) => {
        const crmCategory = crmCategories?.find((item) => item.code === code)
        if (!crmCategory) {
          return Promise.resolve()
        }

        return updateCategory({
          code,
          data: {
            maxSlot,
          },
        })
      }),
    )

    await Promise.all(jobs)

    window.location.reload()
  }

  const [showHelp, setShowHelp] = useState(false)
  const InfoText = ({ label, text }: { label: React.ReactNode; text: string }) => (
    <Tooltip title={text} arrow>
      <span style={{ cursor: "help", textDecoration: "underline dotted" }}>{label}</span>
    </Tooltip>
  )

  return (
    <Box tw="pb-8">
      <Typography variant="h2">언어별 우선순위 관리</Typography>
      <Paper tw="mt-8">
        <TableContainer>
          <Table
            sx={{
              minWidth: 1300,
            }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <InfoText
                    label="언어"
                    text="(수정하지 마세요. 수정이 필요할 경우 관리자와 먼저 상의해주세요)"
                  />
                </TableCell>
                <TableCell>
                  <InfoText
                    label="언어 code"
                    text="(수정하지 마세요. 수정이 필요할 경우 관리자와 먼저 상의해주세요)"
                  />
                </TableCell>
                <TableCell>
                  <InfoText
                    label={<Chip label="대분류 - 1관" />}
                    text="해당 언어에 해당하는 부서를 선택해주세요. (드랍다운에 등장하는 부서들은 스마트닥터CRM에서 관리) 드랍다운 옆 숫자는 30분 슬롯당 인원수 입니다."
                  />
                </TableCell>
                <TableCell>
                  <InfoText
                    label="활성화"
                    text="해당 언어의 예약 배정 로직의 활성화 여부. 비활성화 할 경우 해당 언어는 [CRM 대분류 관리] 의 배정 로직을 따라갑니다."
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...langCrmCategories, ...localLangCrmCategories].map((category) => {
                const langCategory = category as LangCrmCategory
                const localLang = category as CreateLangCrmCategoryDto
                const building1Code =
                  localLang.building1CrmCategoryId || langCategory.building1CrmCategory?.code

                const onChange = (key: keyof CreateLangCrmCategoryDto, value: unknown) => {
                  if (langCategory.id) {
                    onChangeLangCategory(langCategory, key, value)
                  } else {
                    onChangeLocalLangCRMCategory(localLang, key, value)
                  }
                }

                return (
                  <TableRow tabIndex={-1} key={langCategory?.id || category.name}>
                    <TableCell>
                      <TextField
                        size="small"
                        css={inputCss}
                        defaultValue={category.name}
                        onBlur={(e) => {
                          onChange("name", e.target.value)
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Select
                        size="small"
                        css={inputCss}
                        value={category.lang ?? ""}
                        onChange={(e) => {
                          onChange("lang", e.target.value)
                        }}
                        displayEmpty>
                        <MenuItem value="ko">한국어 - ko</MenuItem>
                        <MenuItem value="en">영어 - en</MenuItem>
                        <MenuItem value="ja">일본어 - ja</MenuItem>
                        <MenuItem value="zh">중국어 간체 - zh</MenuItem>
                        <MenuItem value="zh-TW">중국어 번체 - zh-TW</MenuItem>
                        <MenuItem value="th">태국어 - th</MenuItem>
                      </Select>
                    </TableCell>

                    <TableCell>
                      <Select
                        size="small"
                        css={inputCss}
                        value={building1Code || ""}
                        onChange={(e) => {
                          onChange("building1CrmCategoryId", e.target.value)
                        }}>
                        {crmCategories?.map((crmCategory) => (
                          <MenuItem key={crmCategory.code} value={crmCategory.code}>
                            {crmCategory.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <TextField
                        size="small"
                        type="number"
                        css={orderInputCss}
                        value={
                          crmCategorySlots[building1Code] ??
                          crmCategories?.find((item) => item.code === building1Code)?.maxSlot ??
                          0
                        }
                        onChange={(e) => {
                          const crm = crmCategories?.find((item) => item.code === building1Code)

                          if (crm) {
                            setCrmCategorySlots((prev) => ({
                              ...prev,
                              [crm.code]: Number(e.target.value),
                            }))
                          }
                        }}
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        css={inputCss}
                        value={category.status ?? ""}
                        onChange={(e) => {
                          onChange("status", e.target.value)
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected === "ACTIVE") {
                            return (
                              <div
                                style={{
                                  backgroundColor: "#C8E6C9",
                                  padding: "4px 8px",
                                  width: "fit-content",
                                  borderRadius: "4px",
                                }}>
                                활성화
                              </div>
                            )
                          }
                          if (selected === "INACTIVE") {
                            return (
                              <div
                                style={{
                                  backgroundColor: "#FFCDD2",
                                  padding: "4px 8px",
                                  width: "fit-content",
                                  borderRadius: "4px",
                                }}>
                                비활성화
                              </div>
                            )
                          }
                          return <span style={{ opacity: 0.5 }}>선택 없음</span> // Optional placeholder
                        }}>
                        <MenuItem value="ACTIVE" style={{ backgroundColor: "#C8E6C9" }}>
                          활성화
                        </MenuItem>
                        <MenuItem value="INACTIVE" style={{ backgroundColor: "#FFCDD2" }}>
                          비활성화
                        </MenuItem>
                      </Select>
                    </TableCell>

                    {/* <TableCell>
                      <Button
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={() => {
                          const removeItem = (prev: any) => {
                            const index = prev.findIndex((item: any) => item === category)
                            if (index === -1) {
                              return prev
                            }
                            return [...prev.slice(0, index), ...prev.slice(index + 1)]
                          }

                          if (langCategory.id) {
                            setLangCrmCategories(removeItem)
                            setRemovedLangCrmCategories((prev) => [...prev, langCategory])
                          } else {
                            setLocalLangCrmCategories(removeItem)
                          }
                        }}>
                        삭제
                      </Button>
                    </TableCell> */}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box tw="p-2">
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              setCount(count + 1)
              setLocalLangCrmCategories((prev) => [
                ...prev,
                {
                  name: `새 항목 ${count}`,
                },
              ])
            }}>
            행 추가
          </Button>
        </Box>
      </Paper>

      <Box tw="flex gap-4 mt-8">
        <Button
          tw="px-8"
          variant="contained"
          color="inherit"
          size="large"
          disabled={reloadLoading}
          onClick={() =>
            reloadCategories(undefined, {
              onSuccess: () =>
                toast({
                  message: "갱신되었습니다.",
                  type: ToastType.Success,
                }),
            })
          }>
          갱신
        </Button>

        <Button tw="px-8" variant="contained" size="large" onClick={onSave}>
          저장
        </Button>
      </Box>
    </Box>
  )
}

export default LanguageCrmCategory
