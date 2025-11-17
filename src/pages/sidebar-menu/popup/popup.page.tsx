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
  mainPopupControllerCreate,
  mainPopupControllerUpdate,
} from "@/lib/orval/main-popup/main-popup"
import { FileObject, MainPopup, UpdateMainPopupDto } from "@/lib/orval/model"
import { useLocation, useNavigate } from "react-router-dom"

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h4" my={1}>
    {children}
  </Typography>
)

const formSchema = z.object({
  description: z.string().optional(),
  order: z.string().optional(),
  status: z.boolean().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

const Popup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })
  const { state } = useLocation()
  const navigate = useNavigate()

  // 팝업 수정 페이지에서는 state에 데이터가 있음
  const popupData = state?.popupData as MainPopup

  const onSubmit = async (data: FormSchemaType) => {
    try {
      if (popupData) {
        const popupDataUpdate: UpdateMainPopupDto = {
          description: data.description,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
        }
        if (imageIds[""]) {
          popupDataUpdate.imageId = imageIds[""]
        }
        if (imageIds.EN) {
          popupDataUpdate.imageENId = imageIds.EN
        }
        if (imageIds.ZH) {
          popupDataUpdate.imageZHId = imageIds.ZH
        }
        if (imageIds.ZHTW) {
          popupDataUpdate.imageZHTWId = imageIds.ZHTW
        }
        if (imageIds.JA) {
          popupDataUpdate.imageJAId = imageIds.JA
        }
        if (imageIds.TH) {
          popupDataUpdate.imageTHId = imageIds.TH
        }
        await mainPopupControllerUpdate(popupData.id, popupDataUpdate)
      } else {
        const popupDataNew: UpdateMainPopupDto = {
          description: data.description,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
        }
        if (imageIds[""]) {
          popupDataNew.imageId = imageIds[""]
        }
        if (imageIds.EN) {
          popupDataNew.imageENId = imageIds.EN
        }
        if (imageIds.ZH) {
          popupDataNew.imageZHId = imageIds.ZH
        }
        if (imageIds.ZHTW) {
          popupDataNew.imageZHTWId = imageIds.ZHTW
        }
        if (imageIds.JA) {
          popupDataNew.imageJAId = imageIds.JA
        }
        if (imageIds.TH) {
          popupDataNew.imageTHId = imageIds.TH
        }
        await mainPopupControllerCreate(popupDataNew)
      }
      // Navigate back to the previous page after successful submission
      navigate(-1)
    } catch (error) {
      console.log("팝업 등록중 에러: ", error)
    }
  }

  const [imageIds, setImageIds] = useState({
    "": popupData?.image?.id || null, // Default case
    EN: popupData?.imageEN?.id || null,
    ZH: popupData?.imageZH?.id || null,
    ZHTW: popupData?.imageZHTW?.id || null,
    JA: popupData?.imageJA?.id || null,
    TH: popupData?.imageTH?.id || null,
  })

  const handleImageChangeId = (id: string, lang: string) => {
    setImageIds((prevIds) => ({ ...prevIds, [lang]: id }))
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" mb={4}>
        팝업 관리
      </Typography>
      <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {["", "EN", "ZH", "ZHTW", "JA", "TH"].map((lang) => (
          <div key={lang}>
            <Label>{`팝업 이미지${lang ? `(${lang.toUpperCase()})` : ""}`}</Label>
            <ImageInput
              imageSrc={
                (popupData?.[`image${lang.toUpperCase()}` as keyof MainPopup] as FileObject)?.url
              }
              onChangeId={(id) => handleImageChangeId(id, lang)}
            />
          </div>
        ))}

        <label>
          <Label>메모</Label>
          <TextField
            {...register("description")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={popupData?.description}
          />
        </label>
        <label>
          <Label>노출 순위</Label>
          <TextField
            {...register("order")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            type="number"
            defaultValue={popupData?.order}
            required
          />
        </label>
        <label tw="flex items-center w-fit">
          <Label>노출 여부</Label>
          <Checkbox {...register("status")} defaultChecked={popupData?.status === "ACTIVE"} />
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

export default Popup
