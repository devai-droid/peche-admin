/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageInput from "@/lib/components/image-input.component"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, TextField } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  mainProductControllerCreate,
  mainProductControllerUpdate,
} from "@/lib/orval/main-products/main-products"
import {
  FileObject,
  MainProduct,
  CreateMainProductDto,
  UpdateMainProductDto,
} from "@/lib/orval/model"
import { useLocation, useNavigate } from "react-router-dom"

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h4" my={1}>
    {children}
  </Typography>
)

const formSchema = z.object({
  productId: z.string().optional(),
  description: z.string().optional(),
  order: z.string().optional(),
  status: z.boolean().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

const MainPageProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })
  const { state } = useLocation()
  const navigate = useNavigate()

  // 상품 수정 페이지에서는 state에 데이터가 있음
  const productData = state?.productData as MainProduct

  const onSubmit = async (data: FormSchemaType) => {
    try {
      if (productData) {
        const productDataUpdate: UpdateMainProductDto = {
          description: data.description,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
          productId: data.productId || "",
        }
        if (imageIds[""]) {
          productDataUpdate.imageId = imageIds[""]
        }
        if (imageIds.EN) {
          productDataUpdate.imageENId = imageIds.EN
        }
        if (imageIds.ZH) {
          productDataUpdate.imageZHId = imageIds.ZH
        }
        if (imageIds.ZHTW) {
          productDataUpdate.imageZHTWId = imageIds.ZHTW
        }
        if (imageIds.JA) {
          productDataUpdate.imageJAId = imageIds.JA
        }
        if (imageIds.TH) {
          productDataUpdate.imageTHId = imageIds.TH
        }
        await mainProductControllerUpdate(productData.id, productDataUpdate)
      } else {
        const productDataNew: CreateMainProductDto = {
          description: data.description,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
          productId: data.productId || "",
        }
        if (imageIds[""]) {
          productDataNew.imageId = imageIds[""]
        }
        if (imageIds.EN) {
          productDataNew.imageENId = imageIds.EN
        }
        if (imageIds.ZH) {
          productDataNew.imageZHId = imageIds.ZH
        }
        if (imageIds.ZHTW) {
          productDataNew.imageZHTWId = imageIds.ZHTW
        }
        if (imageIds.JA) {
          productDataNew.imageJAId = imageIds.JA
        }
        if (imageIds.TH) {
          productDataNew.imageTHId = imageIds.TH
        }
        await mainProductControllerCreate(productDataNew)
      }
    } catch (error) {
      console.log("상품 등록중 에러: ", error)
    }
  }

  const [imageIds, setImageIds] = useState({
    "": productData?.image?.id || null, // Default case
    EN: productData?.imageEN?.id || null,
    ZH: productData?.imageZH?.id || null,
    ZHTW: productData?.imageZHTW?.id || null,
    JA: productData?.imageJA?.id || null,
    TH: productData?.imageTH?.id || null,
  })

  const handleImageChangeId = (id: string, lang: string) => {
    setImageIds((prevIds) => ({ ...prevIds, [lang]: id }))
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" mb={4}>
        상품 관리
      </Typography>
      <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {["", "EN", "ZH", "ZHTW", "JA", "TH"].map((lang) => (
          <div key={lang}>
            <Label>{`상품 이미지${lang ? `(${lang.toUpperCase()})` : ""}`}</Label>
            <ImageInput
              imageSrc={
                (productData?.[`image${lang.toUpperCase()}` as keyof MainProduct] as FileObject)
                  ?.url
              }
              onChangeId={(id) => handleImageChangeId(id, lang)}
            />
          </div>
        ))}

        <label>
          <Label>상품ID</Label>
          <TextField
            {...register("productId")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={productData?.product?.id}
            required
          />
        </label>
        <label>
          <Label>메모</Label>
          <TextField
            {...register("description")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={productData?.description}
          />
        </label>
        <label>
          <Label>노출 순위</Label>
          <TextField
            {...register("order")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            type="number"
            defaultValue={productData?.order}
            required
          />
        </label>
        <label tw="flex items-center w-fit">
          <Label>노출 여부</Label>
          <Checkbox {...register("status")} defaultChecked={productData?.status === "ACTIVE"} />
        </label>

        <Box tw="self-end">
          <Button
            type="button"
            variant="contained"
            sx={{ mr: 1 }}
            disabled={isSubmitting}
            color="inherit"
            onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="contained">
            저장
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default MainPageProduct
