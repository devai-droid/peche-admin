import { Select, SelectProps } from "@mui/material"

import styles from "./dropdown-input.component.module.scss"

const publicProps: SelectProps = {
  variant: "standard",
  className: styles["hidden-border"],
  classes: {
    select: styles.select,
    icon: styles["select-icon"],
  },
  MenuProps: {
    sx: {
      "& .MuiPaper-root": {
        background: "#484848",
        marginTop: "1rem",
        borderRadius: "8px",
        maxHeight: `${2.5 * 5}rem`,
        color: "white",
        opacity: "0.9 !important",

        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },

      "& .Mui-selected": {
        background: "#D9D9D933 !important                                          ",
      },
    },
  },
}

const DropdownInput = (props: SelectProps) => <Select {...publicProps} {...props} />

export default DropdownInput
