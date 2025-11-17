import ImageInput from "@/lib/components/image-input.component"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, TextField } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  equipmentControllerCreate,
  equipmentControllerUpdate,
} from "@/lib/orval/equipments/equipments"
import { Equipment, CreateEquipmentDto, UpdateEquipmentDto } from "@/lib/orval/model"
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
  descriptionFirst: z.string().optional(),
  descriptionFirstEN: z.string().optional(),
  descriptionFirstZH: z.string().optional(),
  descriptionFirstZHTW: z.string().optional(),
  descriptionFirstJA: z.string().optional(),
  descriptionFirstTH: z.string().optional(),
  descriptionSecond: z.string().optional(),
  descriptionSecondEN: z.string().optional(),
  descriptionSecondZH: z.string().optional(),
  descriptionSecondZHTW: z.string().optional(),
  descriptionSecondJA: z.string().optional(),
  descriptionSecondTH: z.string().optional(),
  order: z.string().optional(),
  status: z.boolean().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

const Equipments = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })
  const { state } = useLocation()
  const navigate = useNavigate()

  // 수정 페이지에서는 state에 데이터가 있음
  const equipmentData = state?.equipmentData as Equipment

  const onSubmit = async (data: FormSchemaType) => {
    try {
      if (equipmentData) {
        const equipmentDataUpdate: UpdateEquipmentDto = {
          descriptionFirst: data.descriptionFirst,
          descriptionFirstEN: data.descriptionFirstEN,
          descriptionFirstZH: data.descriptionFirstZH,
          descriptionFirstZHTW: data.descriptionFirstZHTW,
          descriptionFirstJA: data.descriptionFirstJA,
          descriptionFirstTH: data.descriptionFirstTH,
          descriptionSecond: data.descriptionSecond,
          descriptionSecondEN: data.descriptionSecondEN,
          descriptionSecondZH: data.descriptionSecondZH,
          descriptionSecondZHTW: data.descriptionSecondZHTW,
          descriptionSecondJA: data.descriptionSecondJA,
          descriptionSecondTH: data.descriptionSecondTH,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
          name: data.name || "",
          nameEN: data.nameEN || "",
          nameZH: data.nameZH || "",
          nameZHTW: data.nameZHTW || "",
          nameJA: data.nameJA || "",
          nameTH: data.nameTH || "",
        }
        if (imageId !== "") {
          equipmentDataUpdate.imageId = imageId
        }
        await equipmentControllerUpdate(equipmentData.id, equipmentDataUpdate)
      } else {
        const equipmentDataNew: CreateEquipmentDto = {
          descriptionFirst: data.descriptionFirst,
          descriptionFirstEN: data.descriptionFirstEN,
          descriptionFirstZH: data.descriptionFirstZH,
          descriptionFirstZHTW: data.descriptionFirstZHTW,
          descriptionFirstJA: data.descriptionFirstJA,
          descriptionFirstTH: data.descriptionFirstTH,
          descriptionSecond: data.descriptionSecond,
          descriptionSecondEN: data.descriptionSecondEN,
          descriptionSecondZH: data.descriptionSecondZH,
          descriptionSecondZHTW: data.descriptionSecondZHTW,
          descriptionSecondJA: data.descriptionSecondJA,
          descriptionSecondTH: data.descriptionSecondTH,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
          name: data.name || "",
          nameEN: data.nameEN || "",
          nameZH: data.nameZH || "",
          nameZHTW: data.nameZHTW || "",
          nameJA: data.nameJA || "",
          nameTH: data.nameTH || "",
          imageId,
        }
        await equipmentControllerCreate(equipmentDataNew)
      }
    } catch (error) {
      console.log("장비 등록중 에러: ", error)
    }
  }

  const [imageId, setImageId] = useState("")

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" mb={4}>
        장비 관리
      </Typography>
      <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>장비 이미지</Label>
          <ImageInput imageSrc={equipmentData?.image?.url} onChangeId={(id) => setImageId(id)} />
        </div>

        <label>
          <Label>이름</Label>
          <TextField
            {...register("name")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.name}
            required
          />
        </label>
        <label>
          <Label>이름(영어)</Label>
          <TextField
            {...register("nameEN")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.nameEN}
          />
        </label>
        <label>
          <Label>이름(중국어 간체)</Label>
          <TextField
            {...register("nameZH")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.nameZH}
          />
        </label>
        <label>
          <Label>이름(중국어 번체)</Label>
          <TextField
            {...register("nameZHTW")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.nameZHTW}
          />
        </label>
        <label>
          <Label>이름(일본어)</Label>
          <TextField
            {...register("nameJA")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.nameJA}
          />
        </label>
        <label>
          <Label>이름(태국어)</Label>
          <TextField
            {...register("nameTH")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.nameTH}
          />
        </label>
        <label>
          <Label>소개문구</Label>
          <TextField
            {...register("descriptionSecond")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.descriptionSecond}
          />
        </label>
        <label>
          <Label>소개문구(영어)</Label>
          <TextField
            {...register("descriptionSecondEN")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.descriptionSecondEN}
          />
        </label>
        <label>
          <Label>소개문구(중국어 간체)</Label>
          <TextField
            {...register("descriptionSecondZH")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.descriptionSecondZH}
          />
        </label>
        <label>
          <Label>소개문구(중국어 번체)</Label>
          <TextField
            {...register("descriptionSecondZHTW")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.descriptionSecondZHTW}
          />
        </label>
        <label>
          <Label>소개문구(일본어)</Label>
          <TextField
            {...register("descriptionSecondJA")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.descriptionSecondJA}
          />
        </label>
        <label>
          <Label>소개문구(태국어)</Label>
          <TextField
            {...register("descriptionSecondTH")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={equipmentData?.descriptionSecondTH}
          />
        </label>
        <label>
          <Label>노출 순위</Label>
          <TextField
            {...register("order")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            type="number"
            defaultValue={equipmentData?.order}
            required
          />
        </label>
        <label tw="flex items-center w-fit">
          <Label>노출 여부</Label>
          <Checkbox {...register("status")} defaultChecked={equipmentData?.status === "ACTIVE"} />
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

export default Equipments
