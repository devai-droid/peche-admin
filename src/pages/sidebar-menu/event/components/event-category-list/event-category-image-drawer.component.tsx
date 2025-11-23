import React from "react"
import { Drawer, Box, Typography, Button } from "@mui/material"
import ImageInput from "@/lib/components/image-input.component"
import { FileObject, UpdateEventCategoryDto } from "@/lib/orval/model"
import { useEventCategoryControllerUpdate } from "@/lib/orval/event-categories/event-categories"

interface Props {
  open: boolean
  category: any | null
  onClose: (saved?: boolean) => void
}

const EventCategoryImageDrawer = ({ open, category, onClose }: Props) => {
  const { mutate: updateCategory, isLoading } = useEventCategoryControllerUpdate()

  const [imageId, setImageId] = React.useState<string | null>(null)

  // 삭제 버튼 눌렀는지 여부 (업로드 되기 전 기본 null 상태와 구분하기 위해)
  const [isDeleted, setIsDeleted] = React.useState(false)

  React.useEffect(() => {
    if (category) {
      const id = (category.image as FileObject)?.id || null
      setImageId(id)
      setIsDeleted(false) // 새로 열 때 초기화
    }
  }, [category])

  if (!category) return null

  const handleSave = () => {
    const body: UpdateEventCategoryDto = {}

    if (typeof imageId === "string" && !isDeleted) {
      body.imageId = imageId
    } else {
      body.imageId = null as any
    }

    updateCategory({ id: category.id, data: body }, { onSuccess: () => onClose(true) })
  }

  const handleDeleteImage = () => {
    setIsDeleted(true)
    setImageId(null)
  }

  return (
    <Drawer anchor="right" open={open} onClose={() => onClose()}>
      <Box tw="m-4 min-w-[50vw] flex flex-col h-full">
        <Typography variant="h3" tw="mb-6">
          이벤트 대분류 이미지 관리
        </Typography>

        <Box tw="flex-1">
          <Typography tw="mb-2">대표 이미지</Typography>

          {/* ⭐ 삭제 버튼을 누른 경우에만 문구 표시 */}
          {isDeleted ? (
            <Box tw="p-4 border border-red-300 text-center text-red-500 rounded-md">
              삭제를 원하시면 저장을 눌러주세요.
            </Box>
          ) : (
            <ImageInput
              imageSrc={(category.image as FileObject)?.url}
              onChangeId={(id) => {
                setIsDeleted(false)
                setImageId(id)
              }}
            />
          )}

          {/* 삭제 버튼은 이미지 있을 때만 표시 */}
          {!isDeleted && imageId && (
            <Button variant="outlined" color="error" tw="mt-4" onClick={handleDeleteImage}>
              이미지 삭제
            </Button>
          )}
        </Box>

        <Box tw="text-right">
          <Button tw="mr-4" color="inherit" variant="contained" onClick={() => onClose()}>
            닫기
          </Button>
          <Button variant="contained" disabled={isLoading} onClick={handleSave}>
            저장
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default EventCategoryImageDrawer
