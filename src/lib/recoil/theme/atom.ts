import { atom } from "recoil"
import { localStorageEffect } from "./effect"

export type AppThemeMode = "PureLightTheme"
export const appTheme = atom<AppThemeMode>({
  key: "appTheme",
  default: "PureLightTheme",
  effects: [localStorageEffect("appTheme")],
})
