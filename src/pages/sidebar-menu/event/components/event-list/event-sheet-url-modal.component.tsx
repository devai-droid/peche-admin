import { useForm } from "react-hook-form"
import { ImportFromGoogleSpreadsheetEventDto } from "@/lib/orval/model"
import { Box, Button, Modal, Paper, TextField, Typography } from "@mui/material"
import React from "react"
import { useEventControllerImport } from "@/lib/orval/events/events"

interface Props {
  open?: boolean
  onClose: (saved?: boolean) => void
  bundleId?: string
}

const EventSheetUrlModal = ({ open = false, onClose, bundleId }: Props) => {
  const { mutate: importFromGoogleSpreadsheet } = useEventControllerImport()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({})

  const onSubmit = (data: Partial<ImportFromGoogleSpreadsheetEventDto>) => {
    const options = {
      onSuccess: () => {
        onClose(true)
      },
    }

    const body = {
      ...data,
    } as Partial<ImportFromGoogleSpreadsheetEventDto>

    if (data.url && data.url !== "") {
      importFromGoogleSpreadsheet(
        {
          data: {
            ...body,
            bundleId,
          } as ImportFromGoogleSpreadsheetEventDto,
        },
        options,
      )
    }
  }

  return (
    <Modal open={open} onClose={() => onClose()}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper tw="absolute-center p-8 min-w-[40rem]">
          <Typography variant="h3" tw="mb-8 text-center">
            구글 시트 url 입력
          </Typography>
          <Box tw="mb-4">
            <TextField
              fullWidth
              label="url"
              {...register("url", {
                required: true,
              })}
              type="text"
            />
          </Box>
          <Box tw="flex justify-between w-full">
            <Box></Box>
            <Box>
              <Button tw="mr-4" color="inherit" variant="contained" onClick={() => onClose()}>
                닫기
              </Button>
              <Button variant="contained" type="submit">
                임포트
              </Button>
            </Box>
          </Box>
        </Paper>
      </form>
    </Modal>
  )
}

export default EventSheetUrlModal
