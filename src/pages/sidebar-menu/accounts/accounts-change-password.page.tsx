import { zodResolver } from "@hookform/resolvers/zod"
import { Button, TextField } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AccountUser, PasswordChangeDto } from "@/lib/orval/model"
import { useLocation, useNavigate } from "react-router-dom"
import { adminAuthControllerChangePassword } from "@/lib/orval/admin-auth/admin-auth"

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h4" my={1}>
    {children}
  </Typography>
)

const formSchema = z.object({
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

const AccountsChangePassword = () => {
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
  const accountData = state?.AccountData as AccountUser

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const passwordChangeData: PasswordChangeDto = {
        oldPassword: data.oldPassword || "",
        newPassword: data.newPassword || "",
      }
      await adminAuthControllerChangePassword(passwordChangeData)
    } catch (error) {
      console.log("비밀번호 변경중 에러: ", error)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" mb={4}>
        관리자 계정 관리
      </Typography>

      <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label>
          <Label>기존 비밀번호</Label>
          <TextField
            {...register("oldPassword")}
            type="password"
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            required
          />
        </label>
        <label>
          <Label>새 비밀번호</Label>
          <TextField
            {...register("newPassword")}
            type="password"
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            required
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
            변경
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default AccountsChangePassword
