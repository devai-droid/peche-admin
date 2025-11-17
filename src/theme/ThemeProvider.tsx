import React, { ReactNode } from "react"
import { ThemeProvider } from "@mui/material"
import { themeCreator } from "./base"
import { appTheme } from "@/lib/recoil/theme"
import { useRecoilValue } from "recoil"

export type ThemeProps = {
  children: ReactNode
}

const ThemeProviderWrapper: React.FC<ThemeProps> = ({ children }) => {
  const themeName = useRecoilValue(appTheme)
  const theme = themeCreator(themeName)

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default ThemeProviderWrapper
