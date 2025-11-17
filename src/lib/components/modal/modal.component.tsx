import ReactModal from "react-modal"
import cx from "classnames"

import styles from "./modal.component.module.scss"

ReactModal.setAppElement("#modal")

const Modal = ({ ...props }: ReactModal.Props) => (
  <ReactModal
    {...props}
    className={cx(styles.modal, props.className)}
    overlayClassName={cx(styles.overlay, props.overlayClassName)}
    appElement={document.getElementById("modal") as HTMLElement}
  />
)

export default Modal
