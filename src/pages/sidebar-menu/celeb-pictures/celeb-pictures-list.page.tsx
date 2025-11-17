/* eslint-disable no-alert */
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Checkbox from "@mui/material/Checkbox"
import { Button } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import {
  useCelebPicturesControllerFindMany,
  celebPicturesControllerUpdate,
  celebPicturesControllerRemove,
} from "@/lib/orval/celeb-pictures/celeb-pictures"
import { CelebPictures } from "@/lib/orval/model"

const CelebPicturesList = () => {
  const navigate = useNavigate()
  const { data: pictures, refetch } = useCelebPicturesControllerFindMany({
    page: 1,
    limit: 10,
  })
  const handleTableRowClick = (picture: CelebPictures) => {
    console.log("click: ", picture)
    navigate(`/celeb-pictures/${picture.id}`, { state: { pictureData: picture } })
  }

  const handleCheckboxChange = async (picture: CelebPictures) => {
    try {
      const newStatus = picture.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await celebPicturesControllerUpdate(picture.id, { status: newStatus })
      // Refetch the data to update the UI
      refetch()
    } catch (error) {
      console.error("Error updating picture status", error)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2">셀럽 사진 관리</Typography>
      <Box display="flex" py={2} gap={2}>
        <Button component={Link} to="./new" variant="contained">
          사진 추가
        </Button>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{
              minWidth: 650,
              "& .MuiTableCell-root": {
                border: "1px solid #d0d0d0",
              },
            }}>
            <TableHead>
              <TableCell>노출여부</TableCell>
              <TableCell>이미지</TableCell>
              {/* <TableCell>이미지(영어)</TableCell>
              <TableCell>이미지(중국어)</TableCell>
              <TableCell>이미지(일본어)</TableCell>
              <TableCell>이미지(태국어)</TableCell> */}
              <TableCell>이름</TableCell>
              <TableCell>메인 페이지 우선순위</TableCell>
              <TableCell>아카이브 페이지 우선순위</TableCell>
              <TableCell>삭제</TableCell>
            </TableHead>
            <TableBody>
              {pictures?.items?.map((picture) => (
                <TableRow
                  hover
                  onClick={() => handleTableRowClick(picture)}
                  tabIndex={-1}
                  key={picture.id}
                  sx={{ cursor: "pointer" }}
                  role="link">
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {/* TODO: 체크박스 클릭하면 바로 수정되게 하기 */}
                    <Checkbox
                      checked={picture.status === "ACTIVE"}
                      onChange={() => handleCheckboxChange(picture)}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={picture.image?.url} alt="한국어 이미지" />
                  </TableCell>
                  {/* <TableCell sx={{ maxWidth: 100 }}>
                    <img src={picture.imageEN?.url} alt="영어 이미지" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={picture.imageZH?.url} alt="중국어 이미지" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={picture.imageJA?.url} alt="일본어 이미지" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={picture.imageTH?.url} alt="태국어 이미지" />
                  </TableCell> */}
                  <TableCell>{picture.name}</TableCell>
                  <TableCell>{picture.mainPageOrder}</TableCell>
                  <TableCell>{picture.archivePageOrder}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      color="error"
                      onClick={async () => {
                        if (!window.confirm("정말 삭제하시겠습니까?")) return
                        try {
                          await celebPicturesControllerRemove(picture.id)
                          refetch()
                        } catch (err) {
                          console.error("Error deleting picture:", err)
                        }
                      }}>
                      <DeleteIcon />
                    </IconButton>
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

export default CelebPicturesList
