import React, { useState } from "react"
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
import { Member, CreateMemberDtoOccupation } from "@/lib/orval/model"
import { useMemberControllerFindMany, memberControllerUpdate } from "@/lib/orval/members/members"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

const StaffsList = () => {
  const navigate = useNavigate()
  const { data: members, refetch } = useMemberControllerFindMany({
    page: 1,
    limit: 100,
  })
  const [occupationFilter, setOccupationFilter] = useState("")

  const handleTableRowClick = (member: Member) => {
    navigate(`/staffs/${member.id}`, { state: { memberData: member } })
  }

  // 노출여부 체크박스 클릭하면 바로 수정되게 하기
  const handleCheckboxChange = async (member: Member) => {
    try {
      const newStatus = member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await memberControllerUpdate(member.id, { status: newStatus })
      // Refetch the data to update the UI
      refetch()
    } catch (error) {
      console.error("Error updating product status", error)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2">직원 관리</Typography>
      <Box display="flex" py={2} gap={2}>
        <Select
          value={occupationFilter}
          onChange={(e) => setOccupationFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 120 }}>
          <MenuItem value="">전체</MenuItem>
          {Object.entries(CreateMemberDtoOccupation).map(([label, value]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
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
              <TableCell>직군</TableCell>
              <TableCell>소개문구</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>번호</TableCell>
              <TableCell>입사일</TableCell>
              <TableCell>노출순위</TableCell>
            </TableHead>
            <TableBody>
              {/* {members?.items?.map((member) => ( */}
              {members?.items
                .filter((member) => !occupationFilter || member.occupation === occupationFilter)
                .map((member) => (
                  <TableRow
                    hover
                    onClick={() => handleTableRowClick(member)}
                    tabIndex={-1}
                    key={member.id}
                    sx={{ cursor: "pointer" }}
                    role="link">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {/* TODO: 체크박스 클릭하면 바로 수정되게 하기 */}
                      <Checkbox
                        checked={member.status === "ACTIVE"}
                        onChange={() => handleCheckboxChange(member)}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 100 }}>
                      <img src={member.image?.url} alt="직원 이미지" />
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.occupation}</TableCell>
                    <TableCell>{member.description}</TableCell>
                    <TableCell>{member.birthDate}</TableCell>
                    <TableCell>{member.phoneNumber}</TableCell>
                    <TableCell>{member.joinDate}</TableCell>
                    <TableCell>{member.order}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default StaffsList
