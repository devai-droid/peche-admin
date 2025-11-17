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
  useIntegratedCrmCategoryControllerBulkCreate,
  useIntegratedCrmCategoryControllerBulkUpdate,
  useIntegratedCrmCategoryControllerFindMany,
  useIntegratedCrmCategoryControllerRemove,
} from "@/lib/orval/integrated-crm-categories/integrated-crm-categories"
import {
  CreateIntegratedCrmCategoryDto,
  CreateIntegratedCrmCategoryDtoFirstPriorityBuilding,
  CreateIntegratedCrmCategoryDtoSecondPriorityBuilding,
  IntegratedCrmCategory,
  UpdateIntegratedCrmCategoryDto,
} from "@/lib/orval/model"

const inputCss = tw`min-w-[12rem] w-[calc(100% - 6rem)] max-w-xs`
const orderInputCss = tw`ml-2 w-16 [& input]:text-center`

const CrmCategory = () => {
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

  const { data: integratedData, refetch: refetchIntegrated } =
    useIntegratedCrmCategoryControllerFindMany()
  const [integratedCrmCategories, setIntegratedCrmCategories] = useState<IntegratedCrmCategory[]>(
    [],
  )
  const [localIntegratedCrmCategories, setLocalIntegratedCrmCategories] = useState<
    CreateIntegratedCrmCategoryDto[]
  >([])
  const [removedIntegratedCrmCategories, setRemovedIntegratedCrmCategories] = useState<
    IntegratedCrmCategory[]
  >([])

  const [crmCategorySlots, setCrmCategorySlots] = useState<{ [id: string]: number }>({})

  useEffect(() => {
    queryClient.invalidateQueries(["integratedCrmCategoryControllerFindMany"])
    refetchIntegrated()
  }, [queryClient, refetchIntegrated])

  useEffect(() => {
    if (integratedData?.length) {
      setIntegratedCrmCategories(integratedData)
    }
  }, [integratedData])

  const { mutateAsync: bulkCreate } = useIntegratedCrmCategoryControllerBulkCreate()
  const { mutateAsync: bulkUpdate } = useIntegratedCrmCategoryControllerBulkUpdate()
  const { mutateAsync: removeIntegratedCategory } = useIntegratedCrmCategoryControllerRemove()
  const { mutateAsync: updateCategory } = useCrmCategoryControllerUpdateCrmCategory()
  const onChangeLocalCategory = (
    category: CreateIntegratedCrmCategoryDto,
    key: keyof CreateIntegratedCrmCategoryDto,
    value: unknown,
  ) => {
    setLocalIntegratedCrmCategories((prev) => {
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

  const onChangeIntegratedCategory = (
    category: IntegratedCrmCategory,
    key: keyof UpdateIntegratedCrmCategoryDto,
    value: unknown,
  ) => {
    setIntegratedCrmCategories((prev) => {
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
    if (localIntegratedCrmCategories.length) {
      jobs.push(
        bulkCreate({
          data: localIntegratedCrmCategories.map((item) => ({
            ...item,
          })),
        }),
      )
    }
    if (removedIntegratedCrmCategories.length) {
      removedIntegratedCrmCategories.forEach((item) => {
        jobs.push(removeIntegratedCategory({ id: item.id }))
      })
    }
    jobs.push(
      bulkUpdate({
        data: integratedCrmCategories.map((crm) => ({
          ...crm,
        })) as UpdateIntegratedCrmCategoryDto[],
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
      <Typography variant="h2">대분류 우선순위 관리 (CRM 대분류 기준)</Typography>
      <Paper tw="mt-5">
        <TableContainer>
          <Table
            sx={{
              minWidth: 1300,
            }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <InfoText
                    label="통합 CRM대분류"
                    text="'통합CRM대분류'를 기준으로 예약 관이 배정됩니다."
                  />
                </TableCell>
                <TableCell>
                  <InfoText
                    label={<Chip label="대분류 - 1관" />}
                    text="'통합CRM대분류'에 해당하는 부서를 선택해주세요. (드랍다운에 등장하는 부서들은 스마트닥터CRM에서 관리) 드랍다운 옆 숫자는 30분 슬롯당 인원수 입니다."
                  />
                </TableCell>
                <TableCell>
                  <InfoText
                    label="복수예약시 우선순위"
                    text="여러개의 상품을 예약할 경우, 더 높은 우선순위의 통합CRM대분류 부터 예약 슬롯을 조회합니다."
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...integratedCrmCategories, ...localIntegratedCrmCategories].map((category) => {
                const integrated = category as IntegratedCrmCategory
                const localIntegrated = category as CreateIntegratedCrmCategoryDto
                const building1Code =
                  localIntegrated.building1CrmCategoryCode || integrated.building1CrmCategory?.code

                const onChange = (key: keyof CreateIntegratedCrmCategoryDto, value: unknown) => {
                  if (integrated.id) {
                    onChangeIntegratedCategory(integrated, key, value)
                  } else {
                    onChangeLocalCategory(localIntegrated, key, value)
                  }
                }

                return (
                  <TableRow tabIndex={-1} key={integrated?.id || category.name}>
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
                        value={building1Code || ""}
                        onChange={(e) => {
                          onChange("building1CrmCategoryCode", e.target.value)
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
                    <TableCell tw="min-w-[8rem] text-center">
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        css={orderInputCss}
                        value={category.order || 0}
                        onChange={(e) => {
                          onChange("order", Number(e.target.value))
                        }}
                      />
                    </TableCell>

                    <TableCell>
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

                          if (integrated.id) {
                            setIntegratedCrmCategories(removeItem)
                            setRemovedIntegratedCrmCategories((prev) => [...prev, integrated])
                          } else {
                            setLocalIntegratedCrmCategories(removeItem)
                          }
                        }}>
                        삭제
                      </Button>
                    </TableCell>
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
              setLocalIntegratedCrmCategories((prev) => [
                ...prev,
                {
                  name: `새 항목 ${count}`,
                  firstPriorityBuilding:
                    CreateIntegratedCrmCategoryDtoFirstPriorityBuilding.BUILDING_1,
                  secondPriorityBuilding:
                    CreateIntegratedCrmCategoryDtoSecondPriorityBuilding.BUILDING_2,
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

export default CrmCategory
