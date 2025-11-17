import ImageInput from "@/lib/components/image-input.component"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, TextField } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { memberControllerCreate, memberControllerUpdate } from "@/lib/orval/members/members"
import {
  Member,
  CreateMemberDto,
  UpdateMemberDto,
  CreateMemberDtoOccupation,
} from "@/lib/orval/model"
import { useLocation, useNavigate } from "react-router-dom"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

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
  description: z.string().optional(),
  descriptionEN: z.string().optional(),
  descriptionZH: z.string().optional(),
  descriptionZHTW: z.string().optional(),
  descriptionJA: z.string().optional(),
  descriptionTH: z.string().optional(),
  birthDate: z.string().optional(),
  phoneNumber: z.string().optional(),
  joinDate: z.string().optional(),
  order: z.string().optional(),
  status: z.boolean().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

const Staffs = () => {
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
  const memberData = state?.memberData as Member

  const onSubmit = async (data: FormSchemaType) => {
    try {
      if (memberData) {
        const memberDataUpdate: UpdateMemberDto = {
          description: data.description,
          descriptionEN: data.descriptionEN,
          descriptionZH: data.descriptionZH,
          descriptionZHTW: data.descriptionZHTW,
          descriptionJA: data.descriptionJA,
          descriptionTH: data.descriptionTH,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
          name: data.name || "",
          nameEN: data.nameEN || "",
          nameZH: data.nameZH || "",
          nameZHTW: data.nameZHTW || "",
          nameJA: data.nameJA || "",
          nameTH: data.nameTH || "",
          occupation: data.occupation as CreateMemberDtoOccupation,
          birthDate: data.birthDate || "",
          joinDate: data.joinDate || "",
          phoneNumber: data.phoneNumber || "",
        }
        if (imageId !== "") {
          memberDataUpdate.imageId = imageId
        }
        await memberControllerUpdate(memberData.id, memberDataUpdate)
      } else {
        const memberDataNew: CreateMemberDto = {
          description: data.description,
          descriptionEN: data.descriptionEN,
          descriptionZH: data.descriptionZH,
          descriptionZHTW: data.descriptionZHTW,
          descriptionJA: data.descriptionJA,
          descriptionTH: data.descriptionTH,
          order: data.order as unknown as number,
          status: data.status ? "ACTIVE" : "INACTIVE",
          name: data.name || "",
          nameEN: data.nameEN || "",
          nameZH: data.nameZH || "",
          nameZHTW: data.nameZHTW || "",
          nameJA: data.nameJA || "",
          nameTH: data.nameTH || "",
          occupation: data.occupation as CreateMemberDtoOccupation,
          birthDate: data.birthDate || "",
          joinDate: data.joinDate || "",
          phoneNumber: data.phoneNumber || "",
          imageId,
        }
        await memberControllerCreate(memberDataNew)
      }
    } catch (error) {
      console.log("상품 등록중 에러: ", error)
    }
  }

  const [imageId, setImageId] = useState("")

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" mb={4}>
        직원 관리
      </Typography>
      <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>직원 이미지</Label>
          <ImageInput imageSrc={memberData?.image?.url} onChangeId={(id) => setImageId(id)} />
        </div>

        <label>
          <Label>이름</Label>
          <TextField
            {...register("name")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.name}
            required
          />
        </label>
        <label>
          <Label>이름(영어)</Label>
          <TextField
            {...register("nameEN")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.nameEN}
          />
        </label>
        <label>
          <Label>이름(중국어 간체)</Label>
          <TextField
            {...register("nameZH")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.nameZH}
          />
        </label>
        <label>
          <Label>이름(중국어 번체)</Label>
          <TextField
            {...register("nameZHTW")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.nameZHTW}
          />
        </label>
        <label>
          <Label>이름(일본어)</Label>
          <TextField
            {...register("nameJA")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.nameJA}
          />
        </label>
        <label>
          <Label>이름(태국어)</Label>
          <TextField
            {...register("nameTH")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.nameTH}
          />
        </label>
        <label>
          <Label>직군</Label>
          <Select
            {...register("occupation")}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.occupation}>
            {Object.entries(CreateMemberDtoOccupation).map(([key, value]) => (
              <MenuItem key={value} value={value}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </label>
        <label>
          <Label>소개문구</Label>
          <TextField
            {...register("description")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.description}
          />
        </label>
        <label>
          <Label>소개문구(영어)</Label>
          <TextField
            {...register("descriptionEN")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.descriptionEN}
          />
        </label>
        <label>
          <Label>소개문구(중국어 간체)</Label>
          <TextField
            {...register("descriptionZH")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.descriptionZH}
          />
        </label>
        <label>
          <Label>소개문구(중국어 번체)</Label>
          <TextField
            {...register("descriptionZHTW")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.descriptionZHTW}
          />
        </label>
        <label>
          <Label>소개문구(일본어)</Label>
          <TextField
            {...register("descriptionJA")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.descriptionJA}
          />
        </label>
        <label>
          <Label>소개문구(태국어)</Label>
          <TextField
            {...register("descriptionTH")}
            multiline
            rows={4}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.descriptionTH}
          />
        </label>
        <label>
          <Label>생년월일</Label>
          <TextField
            {...register("birthDate")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.birthDate}
            placeholder="예: 1990-01-01"
          />
        </label>
        <label>
          <Label>번호</Label>
          <TextField
            {...register("phoneNumber")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.phoneNumber}
          />
        </label>
        <label>
          <Label>입사일</Label>
          <TextField
            {...register("joinDate")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={memberData?.joinDate}
            placeholder="예: 2024-01-01"
          />
        </label>
        <label>
          <Label>노출 순위</Label>
          <TextField
            {...register("order")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            type="number"
            defaultValue={memberData?.order}
            required
          />
        </label>
        <label tw="flex items-center w-fit">
          <Label>노출 여부</Label>
          <Checkbox {...register("status")} defaultChecked={memberData?.status === "ACTIVE"} />
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

export default Staffs
