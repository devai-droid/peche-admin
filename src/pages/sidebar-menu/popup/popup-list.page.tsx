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
import {
  useMainPopupControllerFindMany,
  mainPopupControllerUpdate,
} from "@/lib/orval/main-popup/main-popup"
import { MainPopup } from "@/lib/orval/model"

const PopupList = () => {
  const navigate = useNavigate()
  const { data: popups, refetch } = useMainPopupControllerFindMany({
    page: 1,
    limit: 10,
  })

  const handleTableRowClick = (popup: MainPopup) => {
    navigate(`/popups/${popup.id}`, { state: { popupData: popup } })
  }

  // 팝업 노출여부 체크박스 클릭하면 바로 수정되게 하기
  const handleCheckboxChange = async (popup: MainPopup) => {
    try {
      const newStatus = popup.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await mainPopupControllerUpdate(popup.id, { status: newStatus })
      // Refetch the data to update the UI
      refetch()
    } catch (error) {
      console.error("Error updating popup status", error)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2">팝업 관리</Typography>
      <Box display="flex" py={2} gap={2}>
        <Button component={Link} to="./new" variant="contained">
          팝업 추가
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
              <TableCell>이미지(영어)</TableCell>
              <TableCell>이미지(중국어 간체)</TableCell>
              <TableCell>이미지(중국어 번체)</TableCell>
              <TableCell>이미지(일본어)</TableCell>
              <TableCell>이미지(태국어)</TableCell>
              <TableCell>메모(설명)</TableCell>
              <TableCell>우선순위</TableCell>
            </TableHead>
            <TableBody>
              {popups?.items?.map((popup) => (
                <TableRow
                  hover
                  onClick={() => handleTableRowClick(popup)}
                  tabIndex={-1}
                  key={popup.id}
                  sx={{ cursor: "pointer" }}
                  role="link">
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {/* TODO: 체크박스 클릭하면 바로 수정되게 하기 */}
                    <Checkbox
                      checked={popup.status === "ACTIVE"}
                      onChange={() => handleCheckboxChange(popup)}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={popup.image?.url} alt="한국어 이미지" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={popup.imageEN?.url} alt="영어 이미지" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={popup.imageZH?.url} alt="중국어 간체 이미지" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={popup.imageZHTW?.url} alt="중국어 번체 이미지" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={popup.imageJA?.url} alt="일본어 이미지" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={popup.imageTH?.url} alt="태국어 이미지" />
                  </TableCell>
                  <TableCell>{popup.description}</TableCell>
                  <TableCell>{popup.order}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default PopupList
