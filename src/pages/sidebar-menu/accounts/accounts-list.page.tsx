import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { Button } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { AccountUser } from "@/lib/orval/model"
import {
  useAdminUserControllerFindUsers,
  adminUserControllerRemoveAdmin,
} from "@/lib/orval/admin-user/admin-user"

const AccountsList = () => {
  const navigate = useNavigate()
  const { data: accounts, refetch } = useAdminUserControllerFindUsers({
    page: 1,
    limit: 100,
    role: "ADMIN",
  })

  const handleTableRowClick = (account: AccountUser) => {
    navigate(`/accounts/${account.id}`, { state: { AccountData: account } })
  }

  const handleDeleteClick = async (account: AccountUser) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm("정말 삭제하시겠습니까?")
    if (confirmed) {
      try {
        await adminUserControllerRemoveAdmin(account.id)
      } catch (error) {
        console.error("삭제 중 오류 발생:", error)
      }
    } else {
      console.log("삭제 취소")
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2">관리자 계정 관리</Typography>
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
              <TableCell>관리자 이름</TableCell>
              <TableCell>관리자 이메일</TableCell>
              <TableCell>권한 삭제</TableCell>
            </TableHead>
            <TableBody>
              {accounts?.items?.map((account) => (
                <TableRow
                  hover
                  // onClick={() => handleTableRowClick(account)}
                  tabIndex={-1}
                  key={account.id}
                  sx={{ cursor: "pointer" }}
                  role="link">
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{ mr: 1 }}
                      color="inherit"
                      onClick={() => handleDeleteClick(account)}>
                      삭제
                    </Button>{" "}
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

export default AccountsList
