import React from "react"
import { BrowserRouter } from "react-router-dom"
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AxiosError } from "axios"

import RootRoutes from "./routers/routes"
import { Toast, toast } from "./design-system/components"
import { ToastType } from "./design-system/components/toast/toast.component.type"
import ThemeProviderWrapper from "./theme/ThemeProvider"
import { CssBaseline } from "@mui/material"

export default function App() {
  const mutationCache = new MutationCache({
    onError: (error, _value, _context, mutation) => {
      if (mutation.options.onError) {
        return
      }

      const { message, response } = error as AxiosError
      const { message: responseMessage } = response?.data as { message: string }

      toast({
        title: "Error",
        message: responseMessage || message,
        type: ToastType.Highlight,
      })
    },
  })
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        mutationCache,
        defaultOptions: {
          queries: {
            retry: false,
            onError: (error) => {
              const { message } = error as unknown as { message: string }

              toast({
                title: "Network Error",
                message,
                type: ToastType.Highlight,
              })
            },
          },
        },
      }),
  )
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <React.Suspense fallback={<div />}>
          <ThemeProviderWrapper>
            <CssBaseline />
            <RootRoutes />
            <Toast />
          </ThemeProviderWrapper>
        </React.Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
