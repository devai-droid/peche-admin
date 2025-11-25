import React from "react"
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
} from "@mui/material"

import { Link, useNavigate } from "react-router-dom"

import {
  useMostPopularCategoryControllerFindAll,
  useMostPopularCategoryControllerCreate,
  useMostPopularCategoryControllerUpdate,
  useMostPopularCategoryControllerRemove,
} from "@/lib/orval/most-popular-categories/most-popular-categories"

import { MostPopularCategory } from "@/lib/orval/model"

const MostPopularCategoryListPage = () => {
  const navigate = useNavigate()

  const { data: categories, refetch } = useMostPopularCategoryControllerFindAll()
  const { mutate: createCategory } = useMostPopularCategoryControllerCreate()
  const { mutate: updateCategory } = useMostPopularCategoryControllerUpdate()
  const { mutate: deleteCategory } = useMostPopularCategoryControllerRemove()

  // 노출 여부 변경
  const handleStatusChange = (category: MostPopularCategory, checked: boolean) => {
    updateCategory(
      { id: category.id, data: { status: checked ? "ACTIVE" : "INACTIVE" } },
      { onSuccess: () => refetch() },
    )
  }

  // 우선순위 변경
  const handleOrderChange = (category: MostPopularCategory, value: string) => {
    updateCategory(
      { id: category.id, data: { order: Number(value) } },
      { onSuccess: () => refetch() },
    )
  }

  // 상세 페이지로 이동
  const openDetailPage = (category: MostPopularCategory) => {
    navigate(`/most-popular/${category.id}`, { state: { categoryData: category } })
  }

  return (
    <Box tw="p-8">
      <Typography variant="h2">Most Popular Category 관리</Typography>

      <Box tw="flex py-4 gap-4">
        <Button
          variant="contained"
          onClick={() => createCategory({ data: {} }, { onSuccess: () => refetch() })}>
          카테고리 생성
        </Button>
      </Box>

      <Paper tw="rounded-none">
        <TableContainer>
          <Table
            sx={{
              minWidth: 650,
              "& .MuiTableCell-root": { border: "1px solid #d0d0d0" },
            }}>
            <TableHead tw="bg-[#eee]">
              <TableRow tw="[&>*]:text-center">
                <TableCell>사용</TableCell>
                <TableCell>카테고리명</TableCell>
                <TableCell>키워드</TableCell>
                <TableCell>우선순위</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories?.map((category) => (
                <TableRow
                  key={category.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => openDetailPage(category)}>
                  <TableCell onClick={(e) => e.stopPropagation()} tw="text-center">
                    <Checkbox
                      checked={category.status === "ACTIVE"}
                      onChange={(e) => handleStatusChange(category, e.target.checked)}
                    />
                  </TableCell>

                  <TableCell>{category.name || "-"}</TableCell>

                  <TableCell tw="text-center">{(category.keywords || []).join(", ")}</TableCell>

                  <TableCell tw="text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="number"
                      tw="w-20 text-center"
                      value={category.order || ""}
                      onChange={(e) => handleOrderChange(category, e.target.value)}
                    />
                  </TableCell>

                  <TableCell tw="text-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      color="error"
                      disabled={category.status === "ACTIVE"} // ACTIVE면 삭제 제한
                      onClick={() => {
                        // eslint-disable-next-line no-restricted-globals
                        if (confirm("정말 삭제하시겠습니까?")) {
                          deleteCategory({ id: category.id }, { onSuccess: () => refetch() })
                        }
                      }}>
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default MostPopularCategoryListPage
