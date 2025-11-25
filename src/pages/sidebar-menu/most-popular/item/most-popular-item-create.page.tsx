/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { Box, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import MostPopularItemForm from "./most-popular-item-form.page"

import { useMostPopularItemControllerCreate } from "@/lib/orval/most-popular-items/most-popular-items"

const MostPopularItemCreatePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const { mutate: createItem, isLoading } = useMostPopularItemControllerCreate()

  const handleSubmit = (data: any) => {
    // categoryId 필요함
    createItem(
      { data: { ...data, categoryId: id } },
      {
        onSuccess: () => {
          navigate(`/most-popular/${id}`)
        },
      },
    )
  }

  return (
    <Box p={8}>
      <Typography variant="h2" mb={4}>
        Most Popular Item 추가
      </Typography>

      <MostPopularItemForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        loading={isLoading}
      />
    </Box>
  )
}

export default MostPopularItemCreatePage
