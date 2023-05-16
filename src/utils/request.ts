import fetcher from './fetcher'

import type { AxiosRequestConfig, AxiosError } from 'axios'
import type { ResponseBase } from '@/types/response'

const request = async <T, D = undefined>(config: AxiosRequestConfig): Promise<ResponseBase<T | D>> => {
  try {
    const res = await fetcher<T>({ ...config })

    return {
      data: res.data,
      status: res.status,
    }
  } catch (e) {
    return {
      message: (e as AxiosError<D>)?.response?.statusText,
      status: (e as AxiosError<D>)?.response?.status,
      data: (e as AxiosError<D>)?.response?.data,
    }
  }
}

export default request
