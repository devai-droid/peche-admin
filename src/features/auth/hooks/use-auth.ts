import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { userKeys } from "@/lib/constants/query-keys/user.query-key"
import { LocalStorage } from "@/lib/service/local-storage.service"
import { LocalStorageKeys } from "@/lib/constants/local-storage-key.constant"
import { useToken } from "@/lib/hooks/use-token"
import { useAdminAuthControllerLogin } from "@/lib/orval/admin-auth/admin-auth"

export function useLogin() {
  const queryClient = useQueryClient()
  const { setToken } = useToken()

  const saveToken = useCallback(
    (token: string | null) => {
      setToken(token)
      queryClient.invalidateQueries([])
    },
    [queryClient],
  )

  const { mutate: login } = useAdminAuthControllerLogin({
    mutation: {
      onSuccess: (data) => {
        const token = data as unknown as string
        saveToken(token)
      },
    },
  })
  return { login, setToken: saveToken }
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { setToken } = useToken()

  const { mutate } = useMutation(
    () => {
      setToken(null)
      LocalStorage.remove(LocalStorageKeys.User)
      queryClient.removeQueries([])
      return Promise.resolve()
    },
    {
      onMutate: () => {
        queryClient.setQueryData(userKeys.me, null)
      },
    },
  )

  return { logout: mutate }
}
