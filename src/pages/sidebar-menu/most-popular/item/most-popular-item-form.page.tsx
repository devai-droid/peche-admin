/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import ImageInput from "@/lib/components/image-input.component"
import { FileObject } from "@/lib/orval/model"

import { useProductDetailPageControllerFindMany } from "@/lib/orval/product-detail-pages/product-detail-pages"

interface Props {
  item?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

const MostPopularItemForm = ({ item, onSubmit, onCancel, loading }: Props) => {
  const [imageId, setImageId] = React.useState<string | null>(item?.image?.id || null)

  // 🔽 상세페이지 목록 가져오기
  const { data: detailPages } = useProductDetailPageControllerFindMany({
    page: 1,
    limit: 1000,
  })

  const sortedDetails = detailPages?.items
    ? [...detailPages.items].sort((a, b) => a.name.localeCompare(b.name, "ko"))
    : []

  const [selectedDetail, setSelectedDetail] = React.useState(item?.productDetailPageId || "")

  const handleSave = () => {
    const data = {
      title: (document.getElementById("title") as HTMLInputElement).value,
      titleEN: (document.getElementById("titleEN") as HTMLInputElement).value,
      titleZH: (document.getElementById("titleZH") as HTMLInputElement).value,
      titleZHTW: (document.getElementById("titleZHTW") as HTMLInputElement).value,
      titleJA: (document.getElementById("titleJA") as HTMLInputElement).value,
      titleTH: (document.getElementById("titleTH") as HTMLInputElement).value,
      productDetailPageId: selectedDetail || null,
      order: Number((document.getElementById("order") as HTMLInputElement).value),
      imageId,
    }

    onSubmit(data)
  }

  return (
    <Box tw="flex flex-col gap-4 w-[480px] max-w-full">
      <Typography variant="h3">MostPopular Item 관리</Typography>

      {/* ------------------------- */}
      {/* 이미지 업로드 */}
      {/* ------------------------- */}
      <Box>
        <Typography tw="mb-2 font-semibold">대표 이미지</Typography>
        <ImageInput
          imageSrc={(item?.image as FileObject)?.url}
          onChangeId={(id) => setImageId(id)}
        />

        {item?.image && !imageId && (
          <Typography tw="text-red-500 text-sm mt-2">
            이미지를 삭제했습니다. 저장을 눌러야 최종 반영됩니다.
          </Typography>
        )}
      </Box>

      {/* ------------------------- */}
      {/* 제목 */}
      {/* ------------------------- */}
      <TextField id="title" label="제목" defaultValue={item?.title} />
      <TextField id="titleEN" label="제목(영어)" defaultValue={item?.titleEN} />
      <TextField id="titleZH" label="제목(중국어 간체)" defaultValue={item?.titleZH} />
      <TextField id="titleZHTW" label="제목(중국어 번체)" defaultValue={item?.titleZHTW} />
      <TextField id="titleJA" label="제목(일본어)" defaultValue={item?.titleJA} />
      <TextField id="titleTH" label="제목(태국어)" defaultValue={item?.titleTH} />

      {/* ------------------------- */}
      {/* 상세페이지 드롭다운 */}
      {/* ------------------------- */}
      <FormControl fullWidth>
        <InputLabel id="detail-page-select-label">Product Detail Page</InputLabel>
        <Select
          labelId="detail-page-select-label"
          id="productDetailPageId"
          value={selectedDetail}
          label="Product Detail Page"
          onChange={(e) => setSelectedDetail(e.target.value)}>
          <MenuItem value="">
            <em>선택 없음</em>
          </MenuItem>

          {sortedDetails?.map((detail) => (
            <MenuItem key={detail.id} value={detail.id}>
              {detail.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ------------------------- */}
      {/* 우선순위 */}
      {/* ------------------------- */}
      <TextField id="order" label="우선순위" type="number" defaultValue={item?.order || 0} />

      {/* ------------------------- */}
      {/* 버튼 */}
      {/* ------------------------- */}
      <Box tw="flex gap-3 justify-end mt-4">
        <Button variant="outlined" onClick={onCancel}>
          취소
        </Button>
        <Button variant="contained" disabled={loading} onClick={handleSave}>
          저장
        </Button>
      </Box>
    </Box>
  )
}

export default MostPopularItemForm
