import {
  ProductDetailPage,
  ProductDetailPageList,
  UpdateProductDetailPageDto,
} from "@/lib/orval/model"
import {
  Box,
  Button,
  MenuItem,
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
import {
  useProductDetailPageControllerFindMany,
  useProductDetailPageControllerUpdate,
  useProductDetailPageControllerRemove,
} from "@/lib/orval/product-detail-pages/product-detail-pages"
import ProductDetailFormDrawer from "./components/product-detail-list/product-detail-form-drawer.component"
import { useProductCategoryControllerFindMany } from "@/lib/orval/product-categories/product-categories"

const names = [
  {
    key: "name",
    label: "상세페이지",
  },
  {
    key: "description",
    label: "설명",
  },
  {
    key: "nameEN",
    label: "상세페이지\n(영어)",
  },
  {
    key: "descriptionEN",
    label: "설명\n(영어)",
  },
  {
    key: "nameZH",
    label: "상세페이지\n(중국어 간체)",
  },
  {
    key: "descriptionZH",
    label: "설명\n(중국어 간체)",
  },
  {
    key: "nameZHTW",
    label: "상세페이지\n(중국어 번체)",
  },
  {
    key: "descriptionZHTW",
    label: "설명\n(중국어 번체)",
  },
  {
    key: "nameJA",
    label: "상세페이지\n(일본어)",
  },
  {
    key: "descriptionJA",
    label: "설명\n(일본어)",
  },
  {
    key: "nameTH",
    label: "상세페이지\n(태국어)",
  },
  {
    key: "descriptionTH",
    label: "설명\n(태국어)",
  },
] as const

const ProductDetailListPage = () => {
  const queryClient = useQueryClient()
  const { data: productCategories, isLoading: isCategoriesLoading } =
    useProductCategoryControllerFindMany({
      page: 1,
      limit: 1000,
    })
  const {
    data: productDetails,
    refetch,
    queryKey,
  } = useProductDetailPageControllerFindMany({
    page: 1,
    limit: 1000,
  })
  const { mutate: updateDetail } = useProductDetailPageControllerUpdate()
  const { mutate: deleteDetail } = useProductDetailPageControllerRemove()

  const [selectedDetail, setSelectedDetail] = React.useState<ProductDetailPage | null>(null)
  const [openCreateDrawer, setOpenCreateDrawer] = React.useState(false)

  const onChange = (
    item: ProductDetailPage,
    key: keyof UpdateProductDetailPageDto,
    value: unknown,
  ) => {
    queryClient.setQueryData<ProductDetailPageList>(queryKey, (old) => {
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
              category:
                key === "categoryId"
                  ? (productCategories?.items?.find((category) => category.id === value) ??
                    oldItem.category)
                  : oldItem.category,
            }

            updateDetail(
              {
                id: item.id,
                data: {
                  ...(key !== "categoryId" && item.category?.id
                    ? { categoryId: item.category.id }
                    : {}),
                  [key]: value,
                },
              },
              {
                onSuccess: () => {
                  refetch()
                },
              },
            )

            return newData
          }
          return oldItem
        }),
      }
    })
  }

  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null)

  if (isCategoriesLoading) {
    return null
  }

  return (
    <Box tw="pb-8">
      <Box>
        <Typography variant="h2">상세페이지 관리</Typography>

        <Typography tw="mt-4" variant="h3">
          대분류 필터
        </Typography>

        <Select
          value={categoryFilter ?? "-"}
          onChange={(e) => {
            const { value } = e.target
            if (value === "-") {
              setCategoryFilter(null)
            } else {
              setCategoryFilter(value)
            }
          }}>
          <MenuItem value="-">전체</MenuItem>
          {productCategories?.items?.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
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
                <TableCell>대분류</TableCell>
                {names.map((name) => (
                  <TableCell tw="whitespace-pre-wrap" key={name.label}>
                    {name.label}
                  </TableCell>
                ))}
                <TableCell>우선순위</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productDetails?.items
                ?.filter((detail) => !categoryFilter || detail.category?.id === categoryFilter)
                ?.map((detail) => {
                  return (
                    <TableRow
                      tw="[&>*]:min-w-[5rem]"
                      tabIndex={-1}
                      key={detail.id}
                      hover
                      role="button"
                      onClick={() => setSelectedDetail(detail)}>
                      <TableCell>
                        <Select
                          fullWidth
                          onClick={(e) => e.stopPropagation()}
                          value={detail.category?.id ?? ""}
                          onChange={(e) => {
                            const value = e.target.value || null
                            onChange(detail, "categoryId", value)
                          }}>
                          <MenuItem value="">-- 없음 --</MenuItem>
                          {productCategories?.items?.map((pc) => (
                            <MenuItem key={pc.id} value={pc.id}>
                              {pc.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      {names.map((name) => (
                        <TableCell tw="p-1 min-w-[5rem]" key={name.key}>
                          {detail[name.key]}
                        </TableCell>
                      ))}
                      <TableCell align="center" tw="min-w-[6rem]">
                        <input
                          type="number"
                          value={detail.order ?? ""}
                          tw="w-20 border border-gray-300 text-center rounded-sm"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : Number(e.target.value)
                            onChange(detail, "order", value)
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={!!detail.category}
                          onClick={(e) => {
                            e.stopPropagation() // don’t open drawer
                            // eslint-disable-next-line no-alert, no-restricted-globals
                            if (confirm("정말 삭제하시겠습니까?")) {
                              deleteDetail(
                                { id: detail.id },
                                {
                                  onSuccess: () => {
                                    refetch()
                                  },
                                },
                              )
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
      </Paper>
      <Box tw="flex justify-between my-4">
        <Button variant="contained" onClick={() => setOpenCreateDrawer(true)}>
          행 추가
        </Button>
      </Box>

      <ProductDetailFormDrawer
        open={!!selectedDetail || openCreateDrawer}
        key={(!!selectedDetail || openCreateDrawer).toString()}
        onClose={(shouldRefetch?: boolean) => {
          if (shouldRefetch) {
            refetch()
          }
          setSelectedDetail(null)
          setOpenCreateDrawer(false)
        }}
        productDetail={selectedDetail}
      />
    </Box>
  )
}

export default ProductDetailListPage
