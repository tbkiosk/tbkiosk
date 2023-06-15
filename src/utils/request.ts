import axios from 'axios'

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { ResponseBase } from '@/types/response'

const fetcher = <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => axios<T>({ ...config })

if (process.env.NODE_ENV !== 'production') {
  axios.interceptors.request.use(function (config) {
    // eslint-disable-next-line
    console.log(config)
    return config
  })
}

export const request = async <T, R = unknown>(config: AxiosRequestConfig): Promise<ResponseBase<T, R | string>> => {
  try {
    const { data } = await fetcher<T>({ ...config })

    return { data }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return {
        error: (e as AxiosError<R>)?.response?.data || (e as AxiosError<R>)?.response?.statusText,
      }
    } else {
      return {
        error: (e as Error)?.message,
      }
    }
  }
}
