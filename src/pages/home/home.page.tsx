import React from "react"
import BaseLayout from "@/design-system/components/layout/base-layout"
import SidebarLayout from "@/design-system/components/layout/sidebar-layout"

const Home: React.FC = () => {
  return (
    <BaseLayout>
      <SidebarLayout />
    </BaseLayout>
  )
}

export default Home
