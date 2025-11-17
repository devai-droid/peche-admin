/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import { fileControllerCreatePreSignedUrl } from "../orval/files/files"
// import { userFileControllerCreateConfirmedFileUrl } from "../orval/user-files/user-files"

const useFileUpload = () => {
  const mutation = useMutation(async (file: File) => {
    const [uploadTarget] = await fileControllerCreatePreSignedUrl({
      count: 1,
    })
    const { url } = uploadTarget

    const buffer = await file.arrayBuffer()

    await axios.put(url, buffer, { headers: { "Content-Type": file.type } })

    return { ...uploadTarget, url: url.split("?")[0] }
  })

  return mutation
}

export default useFileUpload
