import { Product, ProductList } from "@/lib/orval/model"
import {
  useProductCategoryControllerCreate,
  useProductCategoryControllerFindMany,
  useProductCategoryControllerUpdate,
} from "@/lib/orval/product-categories/product-categories"
import {
  useProductControllerCreate,
  useProductControllerFindMany,
  useProductControllerUpdate,
} from "@/lib/orval/products/products"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
import ProductFormDrawer from "./components/product-list/product-form-drawer.component"
import { ExtendedProduct, ExtendedProductBackup } from "@/lib/types/product.type"
import { useIntegratedCrmCategoryControllerFindMany } from "@/lib/orval/integrated-crm-categories/integrated-crm-categories"
import { toast } from "@/design-system/components"
import { ToastType } from "@/design-system/components/toast/toast.component.type"
import BackupListModal from "./components/product-list/backup-list-modal.component"
import {
  useProductBackupControllerFindMany,
  useProductBackupControllerUpdate,
} from "@/lib/orval/product-backup/product-backup"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useProductBackupBundleControllerUpdate } from "@/lib/orval/product-backup-bundle/product-backup-bundle"
import { useProductDetailPageControllerFindMany } from "@/lib/orval/product-detail-pages/product-detail-pages"

const names = [
  {
    key: "name",
    label: "상품명\n(한국어)",
    visibleKey: "visible",
  },
  {
    key: "description",
    label: "상품설명\n(한국어)",
    visibleKey: null,
  },
  {
    key: "nameEN",
    label: "상품명\n(영어)",
    visibleKey: "visibleEN",
  },
  {
    key: "descriptionEN",
    label: "상품설명\n(영어)",
    visibleKey: null,
  },
  {
    key: "nameZH",
    label: "상품명\n(중국어 간체)",
    visibleKey: "visibleZH",
  },
  {
    key: "descriptionZH",
    label: "상품설명\n(중국어 간체)",
    visibleKey: null,
  },
  {
    key: "nameZHTW",
    label: "상품명\n(중국어 번체)",
    visibleKey: "visibleZHTW",
  },
  {
    key: "descriptionZHTW",
    label: "상품설명\n(중국어 번체)",
    visibleKey: null,
  },
  {
    key: "nameJA",
    label: "상품명\n(일본어)",
    visibleKey: "visibleJA",
  },
  {
    key: "descriptionJA",
    label: "상품설명\n(일본어)",
    visibleKey: null,
  },
  {
    key: "nameTH",
    label: "상품명\n(태국어)",
    visibleKey: "visibleTH",
  },
  {
    key: "descriptionTH",
    label: "상품설명\n(태국어)",
    visibleKey: null,
  },
] as const

const SavedProductListPage = () => {
  const [page, setPage] = React.useState(1)
  const queryClient = useQueryClient()
  const { data: productCategories, isLoading: isCategoriesLoading } =
    useProductCategoryControllerFindMany()
  const { id } = useParams()
  const {
    data: products,
    refetch,
    queryKey,
    isError: isProductsError,
  } = useProductBackupControllerFindMany({
    page,
    backupBundleId: id,
  })
  const { mutate: updateProduct } = useProductBackupControllerUpdate()

  const [selectedProduct, setSelectedProduct] = React.useState<ExtendedProductBackup | null>(null)
  const [openCreateDrawer, setOpenCreateDrawer] = React.useState(false)
  const { data: details } = useProductDetailPageControllerFindMany()
  const { data: integratedCrmCategories } = useIntegratedCrmCategoryControllerFindMany()

  const { mutate: postProduct, isLoading } = useProductBackupBundleControllerUpdate()
  const navigate = useNavigate()

  const onChange = (
    item: ExtendedProductBackup,
    key: keyof ExtendedProductBackup,
    value: unknown,
  ) => {
    queryClient.setQueryData<ProductList>(queryKey, (old) => {
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
            updateProduct({
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

  if (!id || isProductsError) {
    return <Navigate to="/products" />
  }

  return (
    <Box tw="pb-8">
      <Typography variant="h2">상품 목록 불러오기</Typography>
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
                <TableCell>상품 대분류</TableCell>
                <TableCell>상세페이지</TableCell>
                <TableCell>통합 CRM 대분류</TableCell>
                {names.map((name) => (
                  <TableCell tw="whitespace-pre-wrap" key={name.label}>
                    {name.label}
                  </TableCell>
                ))}
                <TableCell>가격</TableCell>
                <TableCell>우선순위(인기)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.items?.map((p) => {
                const product = p as ExtendedProductBackup
                return (
                  <TableRow
                    tw="[&>*]:min-w-[5rem]"
                    tabIndex={-1}
                    key={product.id}
                    hover
                    role="button"
                    onClick={() => setSelectedProduct(product)}>
                    <TableCell>
                      <Select
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                        value={product.category?.id ?? product.category ?? ""}
                        onChange={(e) => onChange(product, "category", e.target.value)}>
                        {productCategories?.items?.map((pc) => (
                          <MenuItem key={pc.id} value={pc.id}>
                            {pc.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        labelId="product-detail-select-label"
                        id="product-detail-select"
                        value={product.detailPageId ?? product.detailPage?.id ?? ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onChange(product, "detailPageId", e.target.value)}>
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
                          product.integratedCrmCategoryId ?? product.integratedCrmCategory?.id ?? ""
                        }
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          onChange(product, "integratedCrmCategoryId", e.target.value)
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
                        <Typography>{product[name.key]}</Typography>
                        {name.visibleKey && product[name.key] && (
                          <Box tw="text-center" onClick={(e) => e.stopPropagation()}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  value={product[name.key]}
                                  onChange={(e) =>
                                    onChange(product, name.visibleKey, e.target.checked)
                                  }
                                  checked={Boolean(product[name.visibleKey])}
                                />
                              }
                              label="노출 여부"
                            />
                          </Box>
                        )}
                      </TableCell>
                    ))}
                    <TableCell tw="min-w-[5rem]">{product.price.toLocaleString()}원</TableCell>
                    <TableCell tw="min-w-[5rem]">{product.order}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box tw="border-x border-[#ddd] py-4 flex justify-center">
          <Pagination
            count={products?.meta?.totalPages ?? 0}
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
        </Box>
      </Box>
      <Box tw="flex justify-end gap-3 my-4">
        <Button variant="contained" color="inherit">
          미리보기
        </Button>
        <Button component={Link} to="/products" variant="contained" color="error">
          돌아가기
        </Button>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={() =>
            postProduct(
              {
                id,
              },
              {
                onSuccess: () => {
                  toast({
                    message: "업로드 완료",
                    type: ToastType.Success,
                  })
                  navigate("/products")
                },
              },
            )
          }>
          업로드 / 홈페이지 게시
        </Button>
      </Box>

      <ProductFormDrawer
        open={!!selectedProduct || openCreateDrawer}
        key={(!!selectedProduct || openCreateDrawer).toString()}
        onClose={(shouldRefetch?: boolean) => {
          if (shouldRefetch) {
            refetch()
          }
          setSelectedProduct(null)
          setOpenCreateDrawer(false)
        }}
        product={selectedProduct as unknown as ExtendedProduct}
        backupBundleId={id}
      />
    </Box>
  )
}

export default SavedProductListPage
