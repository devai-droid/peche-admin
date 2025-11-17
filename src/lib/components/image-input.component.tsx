/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageOutlined } from "@mui/icons-material"
import { Button } from "@mui/material"
import React, { useState } from "react"
import useFileUpload from "../hooks/use-file-upload"
import { fileControllerFindOneFileObject } from "../orval/files/files"

interface ImageInputProps {
  onChangeId: (id: string) => void
  imageSrc?: string | undefined
}

const ImageInput = ({ onChangeId, imageSrc }: ImageInputProps) => {
  const { mutateAsync: uploadImage, isLoading: isUploadLoading } = useFileUpload()
  const [fileObj, setFileObj] = useState<void | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      try {
        const { id } = await uploadImage(selectedFile)

        // send id to parent component
        onChangeId(id)

        const fetchedFileObj = await fileControllerFindOneFileObject(id)
        setFileObj(fetchedFileObj)
      } catch (error) {
        console.log("Error uploading the file: ", error)
      }
    }
  }

  let displayedSrc: string | undefined

  if (fileObj && (fileObj as { url: string })?.url) {
    displayedSrc = (fileObj as { url: string })?.url
  } else if (imageSrc) {
    displayedSrc = imageSrc
  }

  return (
    <div>
      {displayedSrc ? (
        <img src={displayedSrc} style={{ maxWidth: "200px" }} alt="preview" />
      ) : (
        <ImageOutlined tw="text-[4rem]" />
      )}

      <label>
        <input type="file" tw="hidden" accept="image/*" onChange={handleFileChange} />
        <Button
          variant="contained"
          component="div"
          sx={{ marginLeft: 4 }}
          size="small"
          color="inherit"
          disabled={isUploadLoading}>
          {isUploadLoading ? "Uploading..." : "Upload File"}
        </Button>
      </label>
    </div>
  )
}

export default ImageInput
