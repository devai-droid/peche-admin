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
import { Equipment } from "@/lib/orval/model"
import {
  useEquipmentControllerFindMany,
  equipmentControllerUpdate,
} from "@/lib/orval/equipments/equipments"

const EquipmentsList = () => {
  const navigate = useNavigate()
  const { data: equipments, refetch } = useEquipmentControllerFindMany({
    page: 1,
    limit: 100,
  })

  const handleTableRowClick = (equipment: Equipment) => {
    navigate(`/equipments/${equipment.id}`, { state: { equipmentData: equipment } })
  }

  // 노출여부 체크박스 클릭하면 바로 수정되게 하기
  const handleCheckboxChange = async (equipment: Equipment) => {
    try {
      const newStatus = equipment.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await equipmentControllerUpdate(equipment.id, { status: newStatus })
      // Refetch the data to update the UI
      refetch()
    } catch (error) {
      console.error("Error updating equipment status", error)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2">장비 관리</Typography>
      <Box display="flex" py={2} gap={2}>
        <Button component={Link} to="./new" variant="contained">
          추가
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
              <TableCell>이름</TableCell>
              <TableCell>소개문구</TableCell>
              <TableCell>노출순위</TableCell>
            </TableHead>
            <TableBody>
              {equipments?.items?.map((equipment) => (
                <TableRow
                  hover
                  onClick={() => handleTableRowClick(equipment)}
                  tabIndex={-1}
                  key={equipment.id}
                  sx={{ cursor: "pointer" }}
                  role="link">
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {/* TODO: 체크박스 클릭하면 바로 수정되게 하기 */}
                    <Checkbox
                      checked={equipment.status === "ACTIVE"}
                      onChange={() => handleCheckboxChange(equipment)}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    <img src={equipment.image?.url} alt="직원 이미지" />
                  </TableCell>
                  <TableCell>{equipment.name}</TableCell>
                  <TableCell>{equipment.descriptionSecond}</TableCell>
                  <TableCell>{equipment.order}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default EquipmentsList
