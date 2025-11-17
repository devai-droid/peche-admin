import { ProductCategory, ProductCategoryList } from "@/lib/orval/model"
import {
  useProductCategoryControllerCreate,
  useProductCategoryControllerFindMany,
  useProductCategoryControllerUpdate,
  productCategoryControllerRemove,
} from "@/lib/orval/product-categories/product-categories"
import { ExtendedProductCategory } from "@/lib/types/product.type"
import {
  Box,
  Button,
  Checkbox,
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
import { useQueryClient } from "@tanstack/react-query"
import React from "react"
import { Link } from "react-router-dom"

const ProductCategoryListPage = () => {
  const queryClient = useQueryClient()
  const { mutate: createProductCategory, isLoading: isCreatingProductCategory } =
    useProductCategoryControllerCreate()

  const {
    data: productCategories,
    refetch,
    queryKey,
  } = useProductCategoryControllerFindMany({
    page: 1,
    limit: 1000,
  })

  const { mutate: updateProductCategory } = useProductCategoryControllerUpdate()

  const onChange = (item: ExtendedProductCategory, key: keyof ProductCategory, value: unknown) => {
    queryClient.setQueryData<ProductCategoryList>(queryKey, (old) => {
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
            updateProductCategory({
              id: item.id,
              data: { [key]: value },
            })
            return newData
          }
          return oldItem
        }),
      }
    })
  }

  const names = [
    {
      key: "name",
      label: "상품 대분류",
    },
    {
      key: "nameEN",
      label: "상품 대분류(영어)",
    },
    {
      key: "nameZH",
      label: "상품 대분류(중국어 간체)",
    },
    {
      key: "nameZHTW",
      label: "상품 대분류(중국어 번체)",
    },
    {
      key: "nameJA",
      label: "상품 대분류(일본어)",
    },
    {
      key: "nameTH",
      label: "상품 대분류(태국어)",
    },
  ] as const

  const handleDelete = (categoryId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm("정말 해당 상품 대분류를 삭제하시겠습니까?")) {
      productCategoryControllerRemove(categoryId)
    }
  }

  return (
    <Box tw="pb-8">
      <Typography variant="h2">상품 대분류 관리</Typography>
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
                <TableCell>상세페이지</TableCell>
                <TableCell>우선순위</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productCategories?.items?.map((category) => {
                return (
                  <TableRow tabIndex={-1} key={category.id}>
                    <TableCell>
                      <Checkbox
                        value={category.status === "ACTIVE"}
                        checked={category.status === "ACTIVE"}
                        onChange={(e) => {
                          onChange(
                            category as unknown as ExtendedProductCategory,
                            "status",
                            e.currentTarget.checked ? "ACTIVE" : "INACTIVE",
                          )
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
                            onChange(
                              category as unknown as ExtendedProductCategory,
                              e.currentTarget.name as keyof ProductCategory,
                              e.currentTarget.value,
                            )
                          }
                        />
                      </TableCell>
                    ))}
                    <TableCell tw="min-w-[10rem]">
                      {category.detailPages?.map((detailPage) => {
                        const detail = detailPage as unknown as { id: string; name: string }
                        return <Typography key={detail.id}>{detail.name}</Typography>
                      })}
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        tw="w-full text-center"
                        value={category.order || ""}
                        onChange={(e) => {
                          onChange(
                            category as unknown as ExtendedProductCategory,
                            "order",
                            parseInt(e.target.value, 10),
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell tw="text-center">
                      {" "}
                      {/* Added Delete Button Cell */}
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(category.id)}
                        disabled={category.status === "ACTIVE"}>
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
          onClick={() => createProductCategory({ data: {} }, { onSuccess: () => refetch() })}>
          행 추가
        </Button>
        <Button component={Link} to="/product-details" variant="contained" color="inherit">
          상세페이지 추가
        </Button>
      </Box>
    </Box>
  )
}

export default ProductCategoryListPage
