import type { ResponseError } from '@/types/response'

const fetcher = async <T>(resource: RequestInfo, options?: RequestInit): Promise<T> => {
  const res = await fetch(resource, options)
  const json = await res.json()

  if (!res.ok) {
    const error: ResponseError = new Error()
    error.status = res.status
    error.message = json?.message || res.statusText

    throw error
  }

  return res.json as T
}

export default fetcher
