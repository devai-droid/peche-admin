import { useIntegratedCrmCategoryControllerFindMany } from "@/lib/orval/integrated-crm-categories/integrated-crm-categories"
import {
  CreateProductBackupDto,
  CreateProductDto,
  Product,
  UpdateProductBackupDto,
  UpdateProductDto,
} from "@/lib/orval/model"
import {
  useProductBackupControllerCreate,
  useProductBackupControllerRemove,
  useProductBackupControllerUpdate,
} from "@/lib/orval/product-backup/product-backup"
import { useProductCategoryControllerFindMany } from "@/lib/orval/product-categories/product-categories"
import { useProductDetailPageControllerFindMany } from "@/lib/orval/product-detail-pages/product-detail-pages"
import {
  useProductControllerCreate,
  useProductControllerRemove,
  useProductControllerUpdate,
} from "@/lib/orval/products/products"
import { ExtendedProduct } from "@/lib/types/product.type"
import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import React from "react"
import { useForm } from "react-hook-form"
import tw from "twin.macro"

const ErrorMessage = tw(Typography)`text-red-500 block`

const names = [
  { key: "name", label: "상품명 (한국어)" },
  { key: "nameEN", label: "상품명 (영어)" },
  { key: "nameZH", label: "상품명 (중국어 간체)" },
  { key: "nameZHTW", label: "상품명 (중국어 번체)" },
  { key: "nameJA", label: "상품명 (일본어)" },
  { key: "nameTH", label: "상품명 (태국어)" },
  { key: "description", label: "상품설명 (한국어)" },
  { key: "descriptionEN", label: "상품설명 (영어)" },
  { key: "descriptionZH", label: "상품설명 (중국어 간체)" },
  { key: "descriptionZHTW", label: "상품설명 (중국어 번체)" },
  { key: "descriptionJA", label: "상품설명 (일본어)" },
  { key: "descriptionTH", label: "상품설명 (태국어)" },
] as const

const orderNames = [
  { key: "order", label: "한국어", required: true },
  { key: "orderEN", label: "영어", required: false },
  { key: "orderZH", label: "중국어 간체", required: false },
  { key: "orderZHTW", label: "중국어 번체", required: false },
  { key: "orderJA", label: "일본어", required: false },
  { key: "orderTH", label: "태국어", required: false },
] as const

interface Props {
  onClose: (saved?: boolean) => void
  product: ExtendedProduct | null
  open?: boolean
  backupBundleId?: string
}

const ProductFormDrawer = ({ open, onClose, product, backupBundleId }: Props) => {
  const { data: productCategories } = useProductCategoryControllerFindMany({
    page: 1,
    limit: 1000,
  })

  const { mutate: updateProduct, isLoading: isUpdateLoading } = useProductControllerUpdate()
  const { mutate: createProduct, isLoading: isCreateLoading } = useProductControllerCreate()
  const { mutate: deleteProduct, isLoading: isDeleteLoading } = useProductControllerRemove()

  const { mutate: updateProductBackup } = useProductBackupControllerUpdate()
  const { mutate: createProductBackup } = useProductBackupControllerCreate()
  const { mutate: deleteProductBackup } = useProductBackupControllerRemove()

  const { data: details } = useProductDetailPageControllerFindMany({
    page: 1,
    limit: 1000,
  })
  const { data: integratedCrmCategories } = useIntegratedCrmCategoryControllerFindMany()

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...product,
      category: product?.category?.id ?? product?.category ?? undefined,
      detailPageId: product?.detailPage?.id ?? undefined,
      integratedCrmCategoryId: product?.integratedCrmCategory?.id ?? undefined,
    },
  })

  const onSubmit = (data: Partial<CreateProductDto | UpdateProductDto>) => {
    const options = {
      onSuccess: () => {
        onClose(true)
      },
    }

    const body = {
      ...data,
      orderEN: data.orderEN ?? data.order,
      orderZH: data.orderZH ?? data.order,
      orderZHTW: data.orderZHTW ?? data.order,
      orderJA: data.orderJA ?? data.order,
      orderTH: data.orderTH ?? data.order,
      visible: !!data.name && (product?.visible ?? true),
      visibleEN: !!data.nameEN && (product?.visibleEN ?? true),
      visibleZH: !!data.nameZH && (product?.visibleZH ?? true),
      visibleZHTW: !!data.nameZHTW && (product?.visibleZHTW ?? true),
      visibleJA: !!data.nameJA && (product?.visibleJA ?? true),
      visibleTH: !!data.nameTH && (product?.visibleTH ?? true),
    } as Partial<CreateProductDto | UpdateProductDto>

    if (backupBundleId && product?.id) {
      updateProductBackup({ id: product.id, data: body as UpdateProductBackupDto }, options)
    } else if (backupBundleId) {
      createProductBackup(
        {
          data: {
            ...body,
            backupBundleId,
          } as CreateProductBackupDto,
        },
        options,
      )
    } else if (product?.id) {
      updateProduct({ id: product.id, data: body as UpdateProductDto }, options)
    } else {
      createProduct({ data: body as CreateProductDto }, options)
    }
  }

  const isLoading = isUpdateLoading || isCreateLoading

  return (
    <Drawer anchor="right" open={open} onClose={() => onClose()}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box tw="m-4 min-w-[50vw] flex flex-col h-full">
          <Box tw="flex-1">
            <Box tw="flex gap-4">
              <Box tw="flex-1">
                <Typography tw="mb-8" variant="h3">
                  상품 설명
                </Typography>
                {names.map(({ key, label }) => {
                  return (
                    <Box key={key} tw="mb-4">
                      <TextField
                        fullWidth
                        label={label}
                        {...register(key)}
                        multiline={key.includes("description")}
                        rows={key.includes("description") ? 4 : 1}
                      />
                    </Box>
                  )
                })}
              </Box>
              <Box>
                <Typography tw="mb-8" variant="h3">
                  우선순위
                </Typography>
                {orderNames.map(({ key, label, required = false }) => {
                  return (
                    <Box key={key} tw="mb-4">
                      <TextField
                        tw="w-20"
                        label={label}
                        {...register(key, {
                          required,
                          valueAsNumber: true,
                        })}
                        type="number"
                      />
                      <ErrorMessage>{errors[key] && "우선순위는 필수입니다."}</ErrorMessage>
                    </Box>
                  )
                })}
                <Typography tw="my-8" variant="h3">
                  가격
                </Typography>
                <Box tw="mb-4">
                  <TextField
                    tw="w-28"
                    label="가격"
                    {...register("price", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    type="number"
                  />
                  <ErrorMessage>{errors.price && "가격은 필수입니다."}</ErrorMessage>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography tw="mt-8" variant="h3">
                상품 분류
              </Typography>
              <Box tw="mt-4 flex gap-3">
                <FormControl tw="flex-1">
                  <InputLabel id="product-form-select-label">상품 대분류</InputLabel>
                  <Select
                    labelId="product-form-select-label"
                    id="product-form-select"
                    onClick={(e) => e.stopPropagation()}
                    value={watch("category")}
                    onChange={(e) => {
                      setValue("category", e.target.value)
                    }}>
                    {productCategories?.items?.map((pc) => (
                      <MenuItem key={pc.id} value={pc.id}>
                        {pc.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl tw="flex-1">
                  <InputLabel id="product-detail-select-label">상세페이지</InputLabel>
                  <Select
                    labelId="product-detail-select-label"
                    id="product-detail-select"
                    value={watch("detailPageId")}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setValue("detailPageId", e.target.value)}>
                    {details?.items.map((detail) => (
                      <MenuItem key={detail.id} value={detail.id}>
                        {detail.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl tw="flex-1">
                  <InputLabel id="crm-category-select-label">통함 CRM 대분류</InputLabel>
                  <Select
                    labelId="crm-category-select-label"
                    id="crm-category-select"
                    value={watch("integratedCrmCategoryId")}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setValue("integratedCrmCategoryId", e.target.value)}>
                    {integratedCrmCategories?.map((crm) => (
                      <MenuItem key={crm.id} value={crm.id}>
                        {crm.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>

          <Box tw="flex justify-between w-full">
            <Box>
              <Button
                css={!product?.id && tw`hidden`}
                color="error"
                variant="contained"
                disabled={isDeleteLoading || (watch("name")?.includes("상담") ?? false)}
                onClick={() => {
                  const options = {
                    onSuccess: () => {
                      onClose(true)
                    },
                  }
                  if (backupBundleId) {
                    deleteProductBackup({ id: product?.id ?? "" }, options)
                  } else {
                    deleteProduct({ id: product?.id ?? "" }, options)
                  }
                }}>
                삭제
              </Button>
            </Box>
            <Box>
              <Button tw="mr-4" color="inherit" variant="contained" onClick={() => onClose()}>
                닫기
              </Button>
              <Button variant="contained" type="submit" disabled={isLoading}>
                저장
              </Button>
            </Box>
          </Box>
          <Box tw="h-4 shrink-0" />
        </Box>
      </form>
    </Drawer>
  )
}

export default ProductFormDrawer
