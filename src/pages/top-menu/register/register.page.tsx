import React from "react"
import tw from "twin.macro"
import { z } from "zod"
import { useLocation, useNavigate } from "react-router-dom"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox, Typography } from "@/design-system/components"
import SignForm, { Form, Input, SubmitButton } from "@/features/auth/components/sign-form"
import { AuthSignUpDto } from "@/lib/orval/model"
import { useLogin } from "@/features/auth/hooks/use-auth"
import { useAdminAuthControllerRegisterUser } from "@/lib/orval/admin-auth/admin-auth"

const Container = tw.div`flex flex-col justify-center items-center h-auto md:h-full pb-16 md:pb-0`

const formSchema: z.ZodSchema<AuthSignUpDto> = z.object({
  email: z.string().min(1, "email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
  marketingAccepted: z.boolean().refine((value) => value, {
    message: "You must accept marketing",
  }),
  name: z.string(),
})

type FormSchemaType = z.infer<typeof formSchema>

const Register = () => {
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketingAccepted: false,
    },
  })
  const navigate = useNavigate()
  const { setToken } = useLogin()
  const { mutate: registerUser } = useAdminAuthControllerRegisterUser({
    mutation: {
      onSuccess: (result) => {
        const token = result as unknown as string
        setToken(token)
        const to = location.state?.from ?? "/"
        navigate(to, { replace: true })
      },
    },
  })

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => registerUser({ data })

  return (
    <Container>
      <SignForm>
        <Typography type="title">회원가입</Typography>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input type="email" placeholder="ID를 입력하세요" {...register("email")} />
            {errors.email && <span>{errors.email?.message}</span>}
          </div>
          <div>
            <Input type="password" placeholder="Password" {...register("password")} />
            {errors.password && <span>{errors.password?.message}</span>}
          </div>
          <div>
            <Input type="text" placeholder="닉네임" {...register("name")} />
            {errors.name && <span>{errors.name?.message}</span>}
          </div>
          <div>
            <Controller
              name="marketingAccepted"
              control={control}
              render={({ field: { value: checked, ...field } }) =>
                checked !== undefined ? (
                  <Checkbox {...field} checked={checked} label="마케팅 수신 동의" />
                ) : (
                  <br />
                )
              }
            />
            {errors.marketingAccepted && <span>{errors.marketingAccepted?.message}</span>}
          </div>

          <SubmitButton type="submit" disabled={isSubmitting}>
            <Typography type="text" size="lg">
              Sign Up
            </Typography>
          </SubmitButton>
        </Form>
      </SignForm>
    </Container>
  )
}

export default Register
