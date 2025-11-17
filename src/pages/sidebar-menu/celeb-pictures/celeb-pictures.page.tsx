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
  celebPicturesControllerCreate,
  celebPicturesControllerUpdate,
} from "@/lib/orval/celeb-pictures/celeb-pictures"
import {
  FileObject,
  CelebPictures,
  CreateCelebPicturesDto,
  UpdateCelebPicturesDto,
} from "@/lib/orval/model"
import { useLocation, useNavigate } from "react-router-dom"

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h4" my={1}>
    {children}
  </Typography>
)

const formSchema = z.object({
  name: z.string().optional(),
  nameEN: z.string().optional(),
  nameZH: z.string().optional(),
  nameZHTW: z.string().optional(),
  nameJA: z.string().optional(),
  nameTH: z.string().optional(),
  occupation: z.string().optional(),
  occupationEN: z.string().optional(),
  occupationZH: z.string().optional(),
  occupationZHTW: z.string().optional(),
  occupationJA: z.string().optional(),
  occupationTH: z.string().optional(),
  mainPageOrder: z.string().optional(),
  archivePageOrder: z.string().optional(),
  status: z.boolean().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

const CelebPicturesPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })
  const { state } = useLocation()
  const navigate = useNavigate()
  const [openSnackbar, setOpenSnackbar] = useState(false)

  // 상품 수정 페이지에서는 state에 데이터가 있음
  const pictureData = state?.pictureData as CelebPictures

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const mainPageOrder =
        data.mainPageOrder && data.mainPageOrder !== "" ? Number(data.mainPageOrder) : undefined
      const archivePageOrder =
        data.archivePageOrder && data.archivePageOrder !== ""
          ? Number(data.archivePageOrder)
          : undefined

      if (pictureData) {
        const pictureDataUpdate: UpdateCelebPicturesDto = {
          name: data.name,
          nameEN: data.nameEN,
          nameZH: data.nameZH,
          nameZHTW: data.nameZHTW,
          nameJA: data.nameJA,
          nameTH: data.nameTH,
          occupation: data.occupation,
          occupationEN: data.occupationEN,
          occupationZH: data.occupationZH,
          occupationZHTW: data.occupationZHTW,
          occupationJA: data.occupationJA,
          occupationTH: data.occupationTH,
          mainPageOrder,
          archivePageOrder,
          status: data.status ? "ACTIVE" : "INACTIVE",
        }
        if (imageIds[""]) pictureDataUpdate.imageId = imageIds[""]
        if (imageIds.EN) pictureDataUpdate.imageENId = imageIds.EN
        if (imageIds.ZH) pictureDataUpdate.imageZHId = imageIds.ZH
        if (imageIds.ZHTW) pictureDataUpdate.imageZHTWId = imageIds.ZHTW
        if (imageIds.JA) pictureDataUpdate.imageJAId = imageIds.JA
        if (imageIds.TH) pictureDataUpdate.imageTHId = imageIds.TH

        await celebPicturesControllerUpdate(pictureData.id, pictureDataUpdate)
      } else {
        const pictureDataNew: CreateCelebPicturesDto = {
          name: data.name,
          nameEN: data.nameEN,
          nameZH: data.nameZH,
          nameZHTW: data.nameZHTW,
          nameJA: data.nameJA,
          nameTH: data.nameTH,
          occupation: data.occupation,
          occupationEN: data.occupationEN,
          occupationZH: data.occupationZH,
          occupationZHTW: data.occupationZHTW,
          occupationJA: data.occupationJA,
          occupationTH: data.occupationTH,
          mainPageOrder,
          archivePageOrder,
          status: data.status ? "ACTIVE" : "INACTIVE",
        }
        if (imageIds[""]) pictureDataNew.imageId = imageIds[""]
        if (imageIds.EN) pictureDataNew.imageENId = imageIds.EN
        if (imageIds.ZH) pictureDataNew.imageZHId = imageIds.ZH
        if (imageIds.ZHTW) pictureDataNew.imageZHTWId = imageIds.ZHTW
        if (imageIds.JA) pictureDataNew.imageJAId = imageIds.JA
        if (imageIds.TH) pictureDataNew.imageTHId = imageIds.TH

        await celebPicturesControllerCreate(pictureDataNew)
      }

      // eslint-disable-next-line no-alert
      alert("저장되었습니다!")
    } catch (error) {
      console.log("사진 등록중 에러: ", error)
    }
  }

  const [imageIds, setImageIds] = useState({
    "": pictureData?.image?.id || null, // Default case
    EN: pictureData?.imageEN?.id || null,
    ZH: pictureData?.imageZH?.id || null,
    ZHTW: pictureData?.imageZHTW?.id || null,
    JA: pictureData?.imageJA?.id || null,
    TH: pictureData?.imageTH?.id || null,
  })

  const handleImageChangeId = (id: string, lang: string) => {
    setImageIds((prevIds) => ({ ...prevIds, [lang]: id }))
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" mb={4}>
        셀럽 사진 관리
      </Typography>
      <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* {["", "EN", "ZH", "ZHTW", "JA", "TH"].map((lang) => ( */}
        {[""].map((lang) => (
          <div key={lang}>
            <Label>{`셀럽 이미지${lang ? `(${lang.toUpperCase()})` : ""}`}</Label>
            <ImageInput
              imageSrc={
                (pictureData?.[`image${lang.toUpperCase()}` as keyof CelebPictures] as FileObject)
                  ?.url
              }
              onChangeId={(id) => handleImageChangeId(id, lang)}
            />
          </div>
        ))}

        <label>
          <Label>이름</Label>
          <TextField
            {...register("name")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.name}
            required
          />
        </label>
        <label>
          <Label>이름 (영어)</Label>
          <TextField
            {...register("nameEN")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.nameEN}
          />
        </label>
        <label>
          <Label>이름 (중국어 간체)</Label>
          <TextField
            {...register("nameZH")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.nameZH}
          />
        </label>
        <label>
          <Label>이름 (중국어 번체)</Label>
          <TextField
            {...register("nameZHTW")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.nameZHTW}
          />
        </label>
        <label>
          <Label>이름 (일본어)</Label>
          <TextField
            {...register("nameJA")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.nameJA}
          />
        </label>
        <label>
          <Label>이름 (태국어)</Label>
          <TextField
            {...register("nameTH")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.nameTH}
          />
        </label>
        <label>
          <Label>직업</Label>
          <TextField
            {...register("occupation")}
            multiline
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.occupation}
          />
        </label>
        <label>
          <Label>직업 (영어)</Label>
          <TextField
            {...register("occupationEN")}
            multiline
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.occupationEN}
          />
        </label>
        <label>
          <Label>직업 (중국어 간체)</Label>
          <TextField
            {...register("occupationZH")}
            multiline
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.occupationZH}
          />
        </label>
        <label>
          <Label>직업 (중국어 번체)</Label>
          <TextField
            {...register("occupationZHTW")}
            multiline
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.occupationZHTW}
          />
        </label>
        <label>
          <Label>직업 (일본어)</Label>
          <TextField
            {...register("occupationJA")}
            multiline
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.occupationJA}
          />
        </label>
        <label>
          <Label>직업 (태국어)</Label>
          <TextField
            {...register("occupationTH")}
            multiline
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={pictureData?.occupationTH}
          />
        </label>
        <label>
          <Label>메인 페이지 노출 순위</Label>
          <TextField
            {...register("mainPageOrder")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            type="number"
            defaultValue={pictureData?.mainPageOrder}
            required
          />
        </label>
        <label tw="flex items-center w-fit">
          <Label>메인 페이지 노출 여부</Label>
          <Checkbox {...register("status")} defaultChecked={pictureData?.status === "ACTIVE"} />
        </label>
        <label>
          <Label>아카이브 페이지 노출 순위</Label>
          <TextField
            {...register("archivePageOrder")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            type="number"
            defaultValue={pictureData?.archivePageOrder}
          />
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

export default CelebPicturesPage
