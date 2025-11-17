import { useQueryClient } from "@tanstack/react-query"
import { LocalStorageKeys } from "@/lib/constants/local-storage-key.constant"
import { userKeys } from "@/lib/constants/query-keys/user.query-key"
import { LocalStorage } from "@/lib/service/local-storage.service"
import { useUserControllerFindMe } from "@/lib/orval/users/users"
import { useLogout } from "@/features/auth/hooks/use-auth"
import { useToken } from "@/lib/hooks/use-token"
import { AccountUser } from "@/lib/orval/model"

function getStoredUser(): AccountUser | undefined {
  const storedUser = LocalStorage.get(LocalStorageKeys.User)
  return storedUser ? JSON.parse(storedUser) : undefined
}

export function useMe() {
  const queryClient = useQueryClient()
  const { token } = useToken()
  const { logout } = useLogout()

  const { data: user, ...rest } = useUserControllerFindMe({
    query: {
      queryKey: userKeys.me,
      retry: false,
      enabled: !!token,
      initialData: () => getStoredUser(),
      onSuccess: (received: AccountUser) => {
        LocalStorage.set(LocalStorageKeys.User, JSON.stringify(received))
      },
      onError: () => {
        logout()
      },
    },
  })

  function updateUser(newUser: AccountUser): void {
    queryClient.setQueryData(userKeys.me, newUser)
    LocalStorage.set(LocalStorageKeys.User, JSON.stringify(newUser))
  }

  return { user: user as AccountUser, updateUser, ...rest }
}
