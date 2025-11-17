import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useMe } from "@/features/user/hooks/use-user"

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const { user, isFetching } = useMe()

  if (isFetching && !user) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default WithAuth
