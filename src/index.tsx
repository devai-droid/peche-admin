import { createRoot } from "react-dom/client"
import { RecoilRoot } from "recoil"
import App from "./App"

import "./styles/font-family.scss"
import "./styles/index.scss"
import "./styles/tailwind.css"

const container = document.getElementById("root")
const root = createRoot(container as Element)

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
)
