import type { ResponseBase } from '@/types/response'

const request = async <T>(url: string, options: RequestInit = {}): Promise<ResponseBase<T>> => {
  const { headers, ...rest } = options
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    })
    const data = await res.json()

    if (!res.ok) {
      return {
        status: res.status,
        message: data?.message || res.statusText,
      }
    }

    return { data }
  } catch (e) {
    return {
      message: (e as Error).message,
    }
  }
}

export default request
