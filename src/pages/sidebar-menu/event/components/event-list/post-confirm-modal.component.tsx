import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import { Typography } from "@mui/material"

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>,
  ) => {
    return <Slide direction="up" ref={ref} {...props} />
  },
)

interface Props {
  handleClose: () => void
  open: boolean
  handleConfirm: () => void
  leftName?: string
  rightName?: string
}

const PostConfirmModal = ({ handleClose, open, handleConfirm, leftName, rightName }: Props) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle color="red" tw="px-20 py-10">
        <Typography variant="h2">**꼭 확인 부탁드립니다**</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Typography tw="mb-4" variant="h3">
            게시된 이벤트: {leftName ?? "없음"}
          </Typography>
          {/* <Typography tw="mb-4" variant="h3">
            오른쪽: {rightName ?? "없음"}
          </Typography> */}
          <Typography tw="mb-4 text-md">이 선택 되었습니다. 저장 하시겠습니까?</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          아니오
        </Button>
        <Button onClick={handleConfirm}>예</Button>
      </DialogActions>
    </Dialog>
  )
}

export default PostConfirmModal
