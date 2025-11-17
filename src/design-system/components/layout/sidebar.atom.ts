import { atom } from "recoil"

export const sidebarToggleState = atom<boolean>({
  key: "sidebarToggleState",
  default: false,
})
