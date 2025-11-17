import React from "react"
import tw from "twin.macro"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Typography } from "@/design-system/components"
import { useLogin } from "@/features/auth/hooks/use-auth"
import SignForm, {
  Form,
  Input,
  InputForm,
  SubmitButton,
} from "@/features/auth/components/sign-form"

const Container = tw.div`flex flex-col justify-center items-center h-full md:h-full pb-16 md:pb-0`

const Between = tw.div`flex flex-col md:flex-row md:justify-between items-end md:items-center gap-9 md:gap-0 mt-5`

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

type FormSchemaType = z.infer<typeof formSchema>

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })

  const onSuccessfulLogin = () => {
    const to = location.state?.from ?? "/"
    navigate(to)
  }

  const onSubmit: SubmitHandler<FormSchemaType> = (data) =>
    login({ data }, { onSuccess: onSuccessfulLogin })

  return (
    <Container>
      <SignForm>
        <Typography type="title">로그인</Typography>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input placeholder="이메일 *" {...register("email")} />
            <Typography>{errors.email?.message}</Typography>
          </div>
          <div>
            <InputForm>
              <Input type="password" placeholder="Password *" {...register("password")} />
            </InputForm>
            <Typography>{errors.password?.message}</Typography>
          </div>
          <Between>
            <SubmitButton type="submit" disabled={isSubmitting}>
              <Typography size="lg" type="text">
                Login
              </Typography>
            </SubmitButton>
          </Between>
        </Form>
      </SignForm>
    </Container>
  )
}

export default Login
