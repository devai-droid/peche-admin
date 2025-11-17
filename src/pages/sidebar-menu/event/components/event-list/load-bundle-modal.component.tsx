import {
  useEventBackupBundleControllerFindMany,
  useEventBackupBundleControllerUpdate,
} from "@/lib/orval/event-backup-bundle/event-backup-bundle"
import { useEventBundleControllerFindMany } from "@/lib/orval/event-bundle/event-bundle"
import { useProductBackupBundleControllerFindMany } from "@/lib/orval/product-backup-bundle/product-backup-bundle"
import {
  Modal,
  Paper,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Pagination,
} from "@mui/material"
import dayjs from "dayjs"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

interface Props {
  open?: boolean
  onClose: () => void
}

const LoadEventBundleModal = ({ open = false, onClose }: Props) => {
  const { id } = useParams()
  const [page, setPage] = useState(1)
  const { data: bundleList } = useEventBundleControllerFindMany({
    page,
  })
  const { mutate: loadBundle, isLoading } = useEventBackupBundleControllerUpdate()
  const navigate = useNavigate()

  return (
    <Modal open={open} onClose={onClose}>
      <Paper tw="absolute-center p-8 min-w-[40rem]">
        <Typography variant="h3" tw="mb-8 text-center">
          수정 사항이 적용될 목록을 선택해주세요
        </Typography>

        <TableContainer>
          <Table
            sx={{
              "& .MuiTableCell-root": {
                border: "1px solid #d0d0d0",
              },
            }}>
            <TableHead tw="bg-[#eee]">
              <TableRow tw="[&>*]:!text-center">
                <TableCell>생성 날짜</TableCell>
                <TableCell>이벤트 목록</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bundleList?.items?.map((bundle) => {
                return (
                  <TableRow
                    key={bundle.id}
                    hover
                    role="button"
                    onClick={() => {
                      if (isLoading) {
                        return
                      }
                      loadBundle(
                        {
                          id: id || "",
                          data: {
                            eventBundleId: bundle.id,
                          },
                        },
                        {
                          onSuccess: () => {
                            navigate("/events")
                          },
                        },
                      )
                    }}>
                    <TableCell>{dayjs(bundle.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                    <TableCell>{bundle.name}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          tw="mt-8"
          count={bundleList?.meta.totalPages ?? 0}
          page={page}
          onChange={(e, p) => setPage(p)}
        />
      </Paper>
    </Modal>
  )
}

export default LoadEventBundleModal
