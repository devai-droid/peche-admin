import { useEventBackupBundleControllerFindMany } from "@/lib/orval/event-backup-bundle/event-backup-bundle"
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
import { Link } from "react-router-dom"

interface Props {
  open?: boolean
  onClose: () => void
}

const EventBackupListModal = ({ open = false, onClose }: Props) => {
  const [page, setPage] = useState(1)
  const { data: backupList } = useEventBackupBundleControllerFindMany({
    page,
  })

  return (
    <Modal open={open} onClose={onClose}>
      <Paper tw="absolute-center p-8 min-w-[40rem]">
        <Typography variant="h3" tw="mb-8 text-center">
          이벤트 목록 백업 불러오기
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
                <TableCell>No.</TableCell>
                <TableCell>저장 날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {backupList?.items?.map((backup) => {
                return (
                  <TableRow
                    key={backup.id}
                    component={Link}
                    to={`/events/backups/${backup.id}`}
                    hover
                    role="link">
                    <TableCell>{backup.name}</TableCell>
                    <TableCell>{dayjs(backup.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          tw="mt-8"
          count={backupList?.meta.totalPages ?? 0}
          page={page}
          onChange={(e, p) => setPage(p)}
        />
      </Paper>
    </Modal>
  )
}

export default EventBackupListModal
