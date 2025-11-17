import React from "react"
import cx from "classnames"
import LogoSvg from "@/assets/images/angler-logo.svg"

import styles from "./logo.component.module.scss"

interface Props {
  className?: string
}

const Logo: React.FC<Props> = ({ className, ...props }) => (
  <a className={cx(styles.link, className)} href={window.location.origin} {...props}>
    <img className={cx(styles.logo, className)} src={LogoSvg} alt="Logo" />
  </a>
)

export default Logo
