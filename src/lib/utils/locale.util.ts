export type Language = (typeof Language)[keyof typeof Language]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Language = {
  KO: "",
  EN: "EN",
  ZH: "ZH",
  ZHTW: "ZHTW",
  JA: "JA",
  TH: "TH",
} as const

export const languageKey = [
  {
    key: Language.KO,
    label: "한국어",
  },
  {
    key: Language.EN,
    label: "영어",
  },
  {
    key: Language.ZH,
    label: "중국어 간체",
  },
  {
    key: Language.ZHTW,
    label: "중국어 번체",
  },
  {
    key: Language.JA,
    label: "일본어",
  },
  {
    key: Language.TH,
    label: "태국어",
  },
] as const
