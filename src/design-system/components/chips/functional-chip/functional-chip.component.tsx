import React, { ForwardRefRenderFunction } from "react"
import cx from "classnames"
import { HTMLButtonProps, SvgIcon } from "@/lib/types/html-element-type"
import Icon from "../../icon/icon.component"
import styles from "./functional-chip.component.module.scss"

interface Props extends HTMLButtonProps {
  text: string
  icon?: SvgIcon
  selected: boolean
}

const FunctionalChip: ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  { text, icon, selected, className, ...props },
  ref,
) => (
  <button
    ref={ref}
    {...props}
    className={cx(styles.chip, { [styles.selected]: selected }, className)}>
    {icon && <Icon icon={icon} size={18} className={styles.icon} />}
    <span className={styles.text}>{text}</span>
  </button>
)

export default React.forwardRef(FunctionalChip)
