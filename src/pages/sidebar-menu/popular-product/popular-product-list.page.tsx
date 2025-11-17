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
  usePopularProductControllerFindMany,
  popularProductControllerUpdate,
} from "@/lib/orval/popular-products/popular-products"
import { PopularProduct } from "@/lib/orval/model"

const PopularProductList = () => {
  const navigate = useNavigate()
  const { data: products, refetch } = usePopularProductControllerFindMany({
    page: 1,
    limit: 10,
  })
  const handleTableRowClick = (product: PopularProduct) => {
    navigate(`/popular-products/${product.id}`, { state: { productData: product } })
  }

  // 상품 노출여부 체크박스 클릭하면 바로 수정되게 하기
  const handleCheckboxChange = async (product: PopularProduct) => {
    try {
      const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await popularProductControllerUpdate(product.id, { status: newStatus })
      // Refetch the data to update the UI
      refetch()
    } catch (error) {
      console.error("Error updating product status", error)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2">고객님들이 많이 찾는 시술 관리</Typography>
      <Box display="flex" py={2} gap={2}>
        <Button component={Link} to="./new" variant="contained">
          상품 추가
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
              <TableCell>상품</TableCell>
              <TableCell>우선순위</TableCell>
            </TableHead>
            <TableBody>
              {products?.items?.map((product) => (
                <TableRow
                  hover
                  onClick={() => handleTableRowClick(product)}
                  tabIndex={-1}
                  key={product.id}
                  sx={{ cursor: "pointer" }}
                  role="link">
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {/* TODO: 체크박스 클릭하면 바로 수정되게 하기 */}
                    <Checkbox
                      checked={product.status === "ACTIVE"}
                      onChange={() => handleCheckboxChange(product)}
                    />
                  </TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.order}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default PopularProductList
