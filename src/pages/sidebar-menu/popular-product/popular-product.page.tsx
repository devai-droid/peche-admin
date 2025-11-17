/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, TextField } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  popularProductControllerCreate,
  popularProductControllerUpdate,
} from "@/lib/orval/popular-products/popular-products"
import { PopularProduct, CreatePopularProductDto, UpdatePopularProductDto } from "@/lib/orval/model"
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
  productName: z.string().optional(),
  productNameEN: z.string().optional(),
  productNameZH: z.string().optional(),
  productNameZHTW: z.string().optional(),
  productNameJA: z.string().optional(),
  productNameTH: z.string().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

const PopularProductPage = () => {
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
  const productData = state?.productData as PopularProduct

  const onSubmit = async (data: FormSchemaType) => {
    try {
      if (productData) {
        const productDataUpdate: UpdatePopularProductDto = {
          description: data.description,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
          productId: data.productId || "",
          productName: data.productName,
          productNameEN: data.productNameEN,
          productNameZH: data.productNameZH,
          productNameZHTW: data.productNameZHTW,
          productNameJA: data.productNameJA,
          productNameTH: data.productNameTH,
        }
        await popularProductControllerUpdate(productData.id, productDataUpdate)
      } else {
        const productDataNew: CreatePopularProductDto = {
          description: data.description,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
          productId: data.productId || "",
          productName: data.productName,
          productNameEN: data.productNameEN,
          productNameZH: data.productNameZH,
          productNameZHTW: data.productNameZHTW,
          productNameJA: data.productNameJA,
          productNameTH: data.productNameTH,
        }
        await popularProductControllerCreate(productDataNew)
      }
    } catch (error) {
      console.log("등록중 에러: ", error)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" mb={4}>
        상품 관리
      </Typography>
      <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
          <Label>상품이름</Label>
          <TextField
            {...register("productName")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={productData?.productName}
            required
          />
        </label>
        <label>
          <Label>상품이름(영어)</Label>
          <TextField
            {...register("productNameEN")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={productData?.productNameEN}
          />
        </label>
        <label>
          <Label>상품이름(중국어 간체)</Label>
          <TextField
            {...register("productNameZH")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={productData?.productNameZH}
          />
        </label>
        <label>
          <Label>상품이름(중국어 번체)</Label>
          <TextField
            {...register("productNameZHTW")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={productData?.productNameZHTW}
          />
        </label>
        <label>
          <Label>상품이름(일본어)</Label>
          <TextField
            {...register("productNameJA")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={productData?.productNameJA}
          />
        </label>
        <label>
          <Label>상품이름(태국어)</Label>
          <TextField
            {...register("productNameTH")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={productData?.productNameTH}
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

export default PopularProductPage
