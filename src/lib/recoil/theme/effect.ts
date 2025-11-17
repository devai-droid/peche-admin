import { AtomEffect } from "recoil"
import { AppThemeMode } from "@/lib/recoil/theme/atom"

export const localStorageEffect =
  (key: string): AtomEffect<AppThemeMode> =>
  ({ setSelf, onSet }) => {
    const stored = localStorage.getItem(key)
    if (stored === "PureLightTheme") {
      setSelf(stored)
    }
    onSet((value, _, isReset) => {
      if (isReset) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, value || _)
      }
    })
  }
