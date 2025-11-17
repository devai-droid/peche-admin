import { ProductList } from "@/lib/orval/model"
import { useProductCategoryControllerFindMany } from "@/lib/orval/product-categories/product-categories"
import {
  useProductControllerFindMany,
  useProductControllerUpdate,
  useProductControllerRemove,
} from "@/lib/orval/products/products"
import { useProductBackupControllerRemove } from "@/lib/orval/product-backup/product-backup"
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import { ExtendedProduct } from "@/lib/types/product.type"
import { useIntegratedCrmCategoryControllerFindMany } from "@/lib/orval/integrated-crm-categories/integrated-crm-categories"
import { toast } from "@/design-system/components"
import { ToastType } from "@/design-system/components/toast/toast.component.type"
import BackupListModal from "./components/product-list/backup-list-modal.component"
import { useProductBackupBundleControllerCreate } from "@/lib/orval/product-backup-bundle/product-backup-bundle"
import { useProductDetailPageControllerFindMany } from "@/lib/orval/product-detail-pages/product-detail-pages"
import ProductSheetUrlModal from "./components/product-list/product-sheet-url-modal.component"

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

const ProductListPage = () => {
  const [page, setPage] = React.useState(1)
  const [selectedDetail, setSelectedDetail] = React.useState("")
  const [selectedCrmCategory, setSelectedCrmCategory] = React.useState("")
  const [selectedSortBy, setSelectedSortBy] = React.useState("")
  const [selectedSortOrder, setSelectedSortOrder] = React.useState("")
  const queryClient = useQueryClient()

  const { mutateAsync: deleteProduct } = useProductControllerRemove()
  const { mutateAsync: deleteProductBackup } = useProductBackupControllerRemove()

  const { data: productCategories, isLoading: isCategoriesLoading } =
    useProductCategoryControllerFindMany({
      page: 1,
      limit: 1000,
    })

  const {
    data: products,
    refetch,
    isLoading: isProductsLoading,
    queryKey,
  } = useProductControllerFindMany({
    page,
    limit: 100,
    ...(selectedSortBy && { sortBy: [selectedSortBy] }),
    ...(selectedSortOrder && { sortOrder: [selectedSortOrder] }),
    ...(selectedDetail && { detailPageId: selectedDetail }),
    ...(selectedCrmCategory && { integratedCrmCategoryId: selectedCrmCategory }),
  })

  const { mutate: updateProduct } = useProductControllerUpdate()

  const [selectedProduct, setSelectedProduct] = React.useState<ExtendedProduct | null>(null)
  const [openCreateDrawer, setOpenCreateDrawer] = React.useState(false)

  const { data: details } = useProductDetailPageControllerFindMany({
    page: 1,
    limit: 1000,
  })
  // 상세페이지 이름을 한글 기준으로 정렬 (요청받은 기능)
  const sortedDetails = details?.items
    ? [...details.items].sort((a, b) => a.name.localeCompare(b.name, "ko"))
    : []

  const { data: integratedCrmCategories } = useIntegratedCrmCategoryControllerFindMany()

  const { mutate: backupProducts, isLoading: isBackupLoading } =
    useProductBackupBundleControllerCreate()

  const [openBackupListModal, setOpenBackupListModal] = React.useState(false)
  const [openSheetUrlModal, setOpenSheetUrlModal] = React.useState(false)

  const onChange = (item: ExtendedProduct, key: keyof ExtendedProduct, value: unknown) => {
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

  return (
    <Box tw="pb-8">
      <Typography variant="h2">상품 목록</Typography>

      <Box tw="mb-4 mt-4" style={{ display: "flex", flexDirection: "column" }}>
        {/* First Row: Detail and CRM Category Select */}
        <Box style={{ display: "flex", width: "100%" }}>
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

      <Paper tw="mt-8 rounded-none" style={{ width: "fit-content" }}>
        {isProductsLoading && ( // Show overlay with loading spinner
          <Box
            tw="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50"
            style={{ backdropFilter: "blur(8px)" }}>
            <CircularProgress />
          </Box>
        )}
        <TableContainer>
          <Table
            sx={{
              "& .MuiTableCell-root": {
                border: "1px solid #d0d0d0",
              },
            }}>
            <TableHead tw="bg-[#eee]">
              <TableRow tw="[&>*]:!text-center">
                <TableCell>ID</TableCell>
                <TableCell>상품 대분류</TableCell>
                <TableCell>상세페이지</TableCell>
                <TableCell>통합 CRM 대분류</TableCell>
                {names.map((name) => (
                  <TableCell
                    tw="whitespace-pre-wrap"
                    style={{ minWidth: "250px" }}
                    key={name.label}>
                    {name.label}
                  </TableCell>
                ))}
                <TableCell>가격</TableCell>
                <TableCell>우선순위(인기)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.items?.map((p) => {
                const product = p as unknown as ExtendedProduct
                return (
                  <TableRow
                    tw="[&>*]:min-w-[5rem]"
                    tabIndex={-1}
                    key={product.id}
                    hover
                    role="button"
                    onClick={() => setSelectedProduct(product)}>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation() // Prevents the drawer from opening when clicking the ID cell
                      }}>
                      {product.id}
                    </TableCell>
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
          <Button variant="contained" color="inherit" onClick={() => setOpenBackupListModal(true)}>
            불러오기
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={() =>
              backupProducts(undefined, {
                onSuccess: () => {
                  toast({
                    message: "임시저장 완료",
                    type: ToastType.Success,
                  })
                },
              })
            }
            disabled={isBackupLoading}>
            임시저장
          </Button>
          {/* <Button variant="contained" color="inherit" onClick={() => setOpenCreateDrawer(true)}>
            미리보기
          </Button> */}
        </Box>
        <Box>
          <Button
            tw="mr-4"
            variant="contained"
            color="error"
            onClick={async () => {
              if (
                // eslint-disable-next-line no-restricted-globals
                !confirm("정말 모든 상품을 삭제하시겠습니까?\n(‘상담하기’ 상품은 제외됩니다)")
              ) {
                return
              }

              const deletableProducts =
                products?.items?.filter((p) => !p.name?.includes("상담하기")) ?? []

              if (deletableProducts.length === 0) {
                toast({
                  message: "삭제할 상품이 없습니다.",
                })
                return
              }

              try {
                await Promise.all(
                  deletableProducts.map(async (product) => {
                    await deleteProduct({ id: product.id })
                    // 백업 삭제는 실패해도 무시
                    await deleteProductBackup({ id: product?.id ?? "" }).catch((error) => {
                      if (error.response?.status === 404) {
                        console.warn("이미 삭제된 백업:", product.id)
                        return null
                      }
                      console.error("백업 삭제 실패:", error)
                      return null
                    })
                  }),
                )

                toast({
                  message: `${deletableProducts.length}개의 상품이 삭제되었습니다.`,
                  type: ToastType.Success,
                })
                await refetch()
              } catch (error) {
                console.error(error)
                toast({
                  message: "삭제 중 오류가 발생했습니다.",
                  type: ToastType.Highlight,
                })
              }
            }}>
            모든 상품 삭제
          </Button>
          <Button variant="contained" onClick={() => setOpenSheetUrlModal(true)}>
            구글시트에서 임포트
          </Button>
        </Box>
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
        product={selectedProduct as ExtendedProduct}
      />

      <BackupListModal
        key={openBackupListModal.toString()}
        open={openBackupListModal}
        onClose={() => setOpenBackupListModal(false)}
      />
      <ProductSheetUrlModal
        key={openSheetUrlModal.toString()}
        open={openSheetUrlModal}
        onClose={(shouldRefetch?: boolean) => {
          if (shouldRefetch) {
            refetch()
          }
          setOpenSheetUrlModal(false)
        }}
      />
    </Box>
  )
}

export default ProductListPage
