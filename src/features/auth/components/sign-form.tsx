import React from "react"
import tw, { styled } from "twin.macro"

const Container = tw.div`
  bg-white
  flex flex-col justify-center items-center
  p-4 md:p-10 gap-10
  w-full max-w-[564px]
`

const Form = tw.form`w-full flex flex-col gap-5`
const Input = tw.input`w-full md:h-10 border border-line border-solid rounded-md bg-transparent focus:outline-none p-4 md:p-2 md:pr-3`
const SubmitButton = tw.button`w-full md:w-[141px] h-10 bg-point rounded-full text-white focus:outline-none`
const InputForm = tw.div`relative`
const InputIcon = styled.div(({ active }: { active?: boolean }) => [
  tw`absolute top-1/2 transform -translate-y-1/2 right-0`,
  active ? tw`text-white` : tw`text-line`,
])

function SignForm({ children }: { children: React.ReactNode }) {
  return <Container>{children}</Container>
}

export default SignForm

export { Form, Input, SubmitButton, InputForm, InputIcon }
