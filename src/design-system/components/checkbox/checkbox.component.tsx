import React, { ForwardRefRenderFunction } from "react"
import ButtonBase from "@mui/material/ButtonBase"

import styles from "./checkbox.component.module.scss"
import { CheckboxIcon } from "@/assets/icon"
import { HTMLInputProps } from "@/lib/types/html-element-type"

interface Props extends HTMLInputProps {
  label?: string
  checked: boolean
}

// TODO: active & disabled 디자인 없음, disabled 디자인이 애매함. 디자인 수정되면 작업
const Checkbox: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { label, checked, ...props },
  ref,
) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <label>
      <input ref={ref} className={styles.input} type="checkbox" {...props} checked={checked} />
      <div className={styles["checkbox-container"]}>
        <div className={styles["ripple-wrapper"]}>
          <ButtonBase className={styles["checkbox-custom"]} centerRipple focusRipple>
            {checked ? <CheckboxIcon /> : <div className={styles["checkbox-unchecked"]} />}
          </ButtonBase>
        </div>
        {label && <p className={styles.text}>{label}</p>}
      </div>
    </label>
  )
}

export default React.forwardRef(Checkbox)
