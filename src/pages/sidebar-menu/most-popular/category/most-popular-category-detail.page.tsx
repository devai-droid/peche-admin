/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { useNavigate, useParams, Link } from "react-router-dom"

import {
  useMostPopularCategoryControllerFindOne,
  useMostPopularCategoryControllerUpdate,
} from "@/lib/orval/most-popular-categories/most-popular-categories"

import {
  useMostPopularItemControllerFindAll,
  useMostPopularItemControllerRemove,
} from "@/lib/orval/most-popular-items/most-popular-items"

import { UpdateMostPopularCategoryDto } from "@/lib/orval/model"

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h4" my={1}>
    {children}
  </Typography>
)

const MostPopularCategoryDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: category, refetch } = useMostPopularCategoryControllerFindOne(id!)
  const { mutate: updateCategory } = useMostPopularCategoryControllerUpdate()

  const { data: items, refetch: refetchItems } = useMostPopularItemControllerFindAll()
  const { mutate: deleteItem } = useMostPopularItemControllerRemove()

  const relatedItems = items?.filter((item) => item.category?.id === id)

  if (!category) {
    return (
      <Box p={8}>
        <Typography>카테고리를 찾을 수 없습니다.</Typography>
      </Box>
    )
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const dto: UpdateMostPopularCategoryDto = {
      name: form.get("name") as string,
      nameEN: form.get("nameEN") as string,
      nameZH: form.get("nameZH") as string,
      nameZHTW: form.get("nameZHTW") as string,
      nameJA: form.get("nameJA") as string,
      nameTH: form.get("nameTH") as string,
      keywords: (form.get("keywords") as string)?.split(",").map((k) => k.trim()),
      order: Number(form.get("order") || 0),
      status: form.get("status") ? "ACTIVE" : "INACTIVE",
    }

    updateCategory({ id: category.id, data: dto }, { onSuccess: () => refetch() })
  }

  const handleDelete = (itemId: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("정말 이 아이템을 삭제하시겠습니까?")) return

    deleteItem(
      { id: itemId },
      {
        onSuccess: () => {
          refetchItems()
        },
      },
    )
  }

  return (
    <Box p={8}>
      <Typography variant="h2" mb={4}>
        Most Popular Category 상세 관리
      </Typography>

      {/* ============= CATEGORY FORM ============= */}
      <form onSubmit={handleSave} tw="flex flex-col gap-4 max-w-[600px]">
        <label>
          <Label>카테고리명</Label>
          <TextField name="name" defaultValue={category.name} fullWidth />
        </label>

        <label>
          <Label>카테고리명(영어)</Label>
          <TextField name="nameEN" defaultValue={category.nameEN} fullWidth />
        </label>

        <label>
          <Label>카테고리명(중국어 간체)</Label>
          <TextField name="nameZH" defaultValue={category.nameZH} fullWidth />
        </label>

        <label>
          <Label>카테고리명(중국어 번체)</Label>
          <TextField name="nameZHTW" defaultValue={category.nameZHTW} fullWidth />
        </label>

        <label>
          <Label>카테고리명(일본어)</Label>
          <TextField name="nameJA" defaultValue={category.nameJA} fullWidth />
        </label>

        <label>
          <Label>카테고리명(태국어)</Label>
          <TextField name="nameTH" defaultValue={category.nameTH} fullWidth />
        </label>

        <label>
          <Label>키워드 (,로 구분)</Label>
          <TextField name="keywords" defaultValue={category.keywords?.join(", ")} fullWidth />
        </label>

        <label>
          <Label>노출순위</Label>
          <TextField name="order" type="number" defaultValue={category.order} />
        </label>

        <label tw="flex items-center">
          <Label>노출 여부</Label>
          <Checkbox name="status" defaultChecked={category.status === "ACTIVE"} />
        </label>

        <Box tw="self-end">
          <Button
            type="button"
            variant="contained"
            color="inherit"
            sx={{ mr: 1 }}
            onClick={() => navigate(`/most-popular/`)}>
            뒤로가기
          </Button>

          <Button type="submit" variant="contained">
            저장
          </Button>
        </Box>
      </form>

      {/* ============= ITEM LIST ============= */}
      <Box mt={10}>
        <Typography variant="h3" mb={2}>
          해당 카테고리의 Most Popular Items
        </Typography>

        <Button variant="contained" component={Link} to={`/most-popular/${id}/items/new`} tw="mb-4">
          아이템 추가
        </Button>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>대표 이미지</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>우선순위</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {relatedItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.title || ""}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      "이미지 없음"
                    )}
                  </TableCell>

                  <TableCell>{item.title || "-"}</TableCell>
                  <TableCell>{item.order}</TableCell>

                  <TableCell>
                    <Button size="small" component={Link} to={`/most-popular/items/${item.id}`}>
                      수정
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      sx={{ ml: 1 }}
                      onClick={() => handleDelete(item.id)}>
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  )
}

export default MostPopularCategoryDetailPage
