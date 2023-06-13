import axios from 'axios'

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { ResponseBase, ResponseError } from '@/types/response'

const fetcher = <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => axios<T>({ ...config }).then(res => res)

export const request = async <T>(config: AxiosRequestConfig): Promise<ResponseBase<T>> => {
  try {
    const res = await fetcher<T>({ ...config })

    return {
      data: res.data,
      status: res.status,
    }
  } catch (e) {
    return {
      message: (e as AxiosError<ResponseError>)?.response?.data?.message || (e as AxiosError<ResponseError>)?.response?.statusText,
      status: (e as AxiosError<ResponseError>)?.response?.status,
      data: (e as AxiosError<T>)?.response?.data,
    }
  }
}
