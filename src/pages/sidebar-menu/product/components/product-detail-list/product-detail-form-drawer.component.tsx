import {
  CreateProductDto,
  Product,
  ProductDetailPage,
  UpdateProductDetailPageDto,
  UpdateProductDto,
  FileObject,
} from "@/lib/orval/model"
import {
  useProductDetailPageControllerCreate,
  useProductDetailPageControllerFindMany,
  useProductDetailPageControllerFindOne,
  useProductDetailPageControllerUpdate,
} from "@/lib/orval/product-detail-pages/product-detail-pages"
import {
  useProductControllerCreate,
  useProductControllerUpdate,
} from "@/lib/orval/products/products"
import { ExtendedProduct, ExtendedProductDetail } from "@/lib/types/product.type"
import { Language, languageKey } from "@/lib/utils/locale.util"
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  TextField,
  TextareaAutosize,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import React from "react"
import { useForm } from "react-hook-form"
import tw from "twin.macro"
import ImageInput from "@/lib/components/image-input.component"

const ErrorMessage = tw(Typography)`text-red-500 block`

interface Name {
  key: keyof UpdateProductDetailPageDto
  label: string
  language?: boolean
}

const names: Name[] = [
  { key: "name", label: "", language: true },
  { key: "description", label: "기본 설명", language: true },
  { key: "referenceUrl", label: "참고 URL", language: false },
  // { key: "procedure", label: "시술 과정", language: true },
  // { key: "information", label: "시술 안내", language: true },
  // { key: "advantages", label: "장점", language: true },
  // { key: "target", label: "시술 추천대상", language: true },
  // { key: "qAndA", label: "Q&A", language: true },
  // { key: "caution", label: "주의사항", language: true },
]

interface Props {
  onClose: (saved?: boolean) => void
  productDetail: ProductDetailPage | null
  open?: boolean
}

const ProductDetailFormDrawer = ({ open, onClose, productDetail }: Props) => {
  const [lang, setLang] = React.useState<Language>(Language.KO)

  const { data: productDetails } = useProductDetailPageControllerFindMany()

  const { mutate: updateDetail, isLoading: isUpdateLoading } =
    useProductDetailPageControllerUpdate()
  const { mutate: createDetail, isLoading: isCreateLoading } =
    useProductDetailPageControllerCreate()
  const { handleSubmit, register, setValue, watch } = useForm<UpdateProductDetailPageDto>({
    defaultValues: {
      ...(productDetail as UpdateProductDetailPageDto),
    },
  })
  const [imageId, setImageId] = React.useState<string | null>(
    (productDetail?.image as FileObject)?.id || null,
  )

  const handleImageChangeId = (id: string) => {
    setImageId(id)
  }

  useProductDetailPageControllerFindOne<ExtendedProductDetail>(productDetail?.id || "", {
    query: {
      enabled: !!productDetail?.id,
      onSuccess: (data) => {
        setValue(
          "relatedDetailPageIds",
          data.relatedDetailPages?.map((v) => v.relatedProductDetailPage.id) || [],
        )
      },
    },
  })

  const onSubmit = (data: Partial<CreateProductDto | UpdateProductDto>) => {
    if (isLoading) return
    const options = {
      onSuccess: () => {
        onClose(true)
      },
    }

    const body = {
      ...data,
      ...(imageId && { imageId }),
    } as Partial<CreateProductDto | UpdateProductDto>

    if (productDetail?.id) {
      updateDetail({ id: productDetail.id, data: body as UpdateProductDto }, options)
    } else {
      createDetail({ data: body as CreateProductDto }, options)
    }
  }

  const isLoading = isUpdateLoading || isCreateLoading

  return (
    <Drawer anchor="right" open={open} onClose={() => onClose()}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box tw="m-4 min-w-[50vw] flex flex-col h-full">
          <Box tw="flex-1">
            <Box tw="mb-8 flex items-center gap-4">
              <Typography variant="h3">상품 설명</Typography>
              <ToggleButtonGroup
                value={lang || "KO"}
                exclusive
                onChange={(e, value) => {
                  if (value === "KO") {
                    setLang("")
                  } else if (value) {
                    setLang(value)
                  }
                }}>
                {languageKey.map(({ key, label }) => (
                  <ToggleButton key={key} value={key || "KO"}>
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
            {names.map(({ key, label, language }) => {
              const langKey = language ? (`${key}${lang}` as keyof UpdateProductDetailPageDto) : key
              return (
                <Box key={langKey} tw="mb-4">
                  <Typography tw="mb-2">{label}</Typography>
                  <TextareaAutosize tw="w-full border p-2" {...register(langKey)} />
                </Box>
              )
            })}
            <Box tw="mb-8">
              <Typography variant="h4" tw="mb-2">
                대표 이미지
              </Typography>

              <ImageInput
                imageSrc={(productDetail?.image as FileObject)?.url}
                onChangeId={handleImageChangeId}
              />
            </Box>

            {/* <Box>
              <Autocomplete
                multiple
                options={productDetails?.items || []}
                getOptionLabel={(option) => option?.name as string}
                onChange={(e, value) => {
                  const ids =
                    value?.map((v) => v?.id).filter((v): v is string => typeof v === "string") || []

                  setValue("relatedDetailPageIds", ids)
                }}
                value={
                  watch("relatedDetailPageIds")?.map((id) => {
                    return productDetails?.items.find((v) => v.id === id)
                  }) || []
                }
                renderInput={(params) => <TextField {...params} label="연관시술" />}
              />
            </Box> */}
          </Box>
          <Box tw="text-right">
            <Button tw="mr-4" color="inherit" variant="contained" onClick={() => onClose()}>
              닫기
            </Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              저장
            </Button>
          </Box>
          <Box tw="h-4 shrink-0" />
        </Box>
      </form>
    </Drawer>
  )
}

export default ProductDetailFormDrawer
