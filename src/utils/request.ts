import axios from 'axios'

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { ResponseBase, ResponseError } from '@/types/response'

const fetcher = <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => axios<T>({ ...config })

if (process.env.NODE_ENV !== 'production') {
  axios.interceptors.request.use(function (config) {
    // eslint-disable-next-line
    console.log(config)
    return config
  })
}

export const request = async <T>(config: AxiosRequestConfig): Promise<ResponseBase<T | undefined>> => {
  try {
    const { data } = await fetcher<ResponseBase<T>>({ ...config })

    return data
  } catch (e) {
    return {
      error: (e as AxiosError<ResponseError>)?.response?.data?.error || (e as AxiosError<ResponseError>)?.response?.statusText,
    }
  }
}
