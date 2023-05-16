import axios, { type AxiosRequestConfig, AxiosResponse } from 'axios'

const fetcher = <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => axios<T>({ ...config }).then(res => res)

export default fetcher
