import React from "react"
import { Box } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import {
  useMostPopularItemControllerFindOne,
  useMostPopularItemControllerUpdate,
} from "@/lib/orval/most-popular-items/most-popular-items"
import MostPopularItemForm from "./most-popular-item-form.page"

const MostPopularItemEditPage = () => {
  const navigate = useNavigate()
  const { itemId } = useParams()

  // ✔ 구조 분해 적용 (경고 해결)
  const { data: item, isLoading: isFetching } = useMostPopularItemControllerFindOne(itemId ?? "")

  const {
    mutate, // update 함수
    isLoading, // 로딩 여부
  } = useMostPopularItemControllerUpdate()

  if (!itemId) {
    return <Box p={8}>잘못된 아이템 ID 입니다.</Box>
  }

  if (isFetching) {
    return <Box p={8}>로딩중...</Box>
  }

  if (!item) {
    return <Box p={8}>아이템을 찾을 수 없습니다.</Box>
  }

  const handleSubmit = (data: any) => {
    mutate(
      { id: itemId, data },
      {
        onSuccess: () => navigate(-1),
      },
    )
  }

  return (
    <Box tw="p-8">
      <MostPopularItemForm
        item={item}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        loading={isLoading}
      />
    </Box>
  )
}

export default MostPopularItemEditPage
