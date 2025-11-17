/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import qs from "qs"
import { env } from "../env"

const BASE_API_URL = env.BACKEND_API_URL.replace("/api", "")

const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-type": "application/json",
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error

    // ✅ 특정 API 404는 무시
    if (response?.status === 404 && config?.url?.includes("/product-backup/")) {
      console.warn("무시된 404 응답 (product-backup):", config.url)
      // 정상 응답처럼 처리하여 Promise.reject 방지
      return Promise.resolve({ data: null })
    }

    // ✅ 다른 에러는 그대로 throw
    return Promise.reject(error)
  },
)

function setAuthHeader(token: string): void {
  axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`
}

function clearAuthHeader(): void {
  axiosClient.defaults.headers.common.Authorization = undefined
}

export default axiosClient
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source()
  const promise = axiosClient({
    ...config,
    cancelToken: source.token,
    paramsSerializer: (params) =>
      qs.stringify(params, {
        arrayFormat: "comma",
        encode: false,
      }),
  }).then(({ data }) => data)

  return promise
}
export { setAuthHeader, clearAuthHeader }
