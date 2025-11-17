import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, TextField } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AccountUser, UserDtoByAdmin, UpdateUserDto } from "@/lib/orval/model"
import { useLocation, useNavigate } from "react-router-dom"
import {
  adminUserControllerCreateUser,
  adminUserControllerSetAdmin,
} from "@/lib/orval/admin-user/admin-user"

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h4" my={1}>
    {children}
  </Typography>
)

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

const Accounts = () => {
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
      if (!accountData) {
        const userData: UserDtoByAdmin = {
          email: data.email,
          name: data.name,
          password: data.password,
        }
        const response = await adminUserControllerCreateUser(userData)
        const userId = response.id
        // 관리자로 설정
        adminUserControllerSetAdmin(userId)
        // 생성 & 관리자 설정 후 리스트로 이동
        navigate(-1)
      } else {
        console.log("onSubmit data UPDATE", data, accountData)
      }
    } catch (error) {
      console.log("관리자 등록중 에러: ", error)
    }
  }

  const handlePasswordChangeClick = (account: AccountUser) => {
    navigate(`/accounts/changepassword/${account.id}`, { state: { AccountData: account } })
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" mb={4}>
        관리자 계정 관리
      </Typography>
      {accountData ? (
        <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label>
            <Label>이름</Label>
            <TextField
              {...register("name")}
              rows={1}
              sx={{ minWidth: 360, bgcolor: "white" }}
              defaultValue={accountData?.name}
              required
            />
          </label>
          <label>
            <Label>이메일</Label>
            <TextField
              {...register("email")}
              rows={1}
              sx={{ minWidth: 360, bgcolor: "white" }}
              defaultValue={accountData?.email}
              required
            />
          </label>

          <Box tw="self-end">
            {/* <Button
              type="button"
              variant="contained"
              sx={{ mr: 1 }}
              disabled={isSubmitting}
              color="inherit"
              onClick={() => handlePasswordChangeClick(accountData)}>
              비밀번호 변경
            </Button> */}
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
      ) : (
        <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Different form content when accountData is undefined */}
          <label>
            <Label>관리자 이름</Label>
            <TextField
              {...register("name")}
              rows={1}
              sx={{ minWidth: 360, bgcolor: "white" }}
              required
            />
          </label>
          <label>
            <Label>관리자 이메일</Label>
            <TextField
              {...register("email")}
              rows={1}
              sx={{ minWidth: 360, bgcolor: "white" }}
              required
            />
          </label>
          <label>
            <Label>Password</Label>
            <TextField
              {...register("password")}
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
              생성
            </Button>
          </Box>
        </form>
      )}
      {/* <form tw="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label>
          <Label>이름</Label>
          <TextField
            {...register("name")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={accountData?.name}
            required
          />
        </label>
        <label>
          <Label>이메일</Label>
          <TextField
            {...register("email")}
            rows={1}
            sx={{ minWidth: 360, bgcolor: "white" }}
            defaultValue={accountData?.email}
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
            저장
          </Button>
        </Box>
      </form> */}
    </Box>
  )
}

export default Accounts
