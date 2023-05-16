import { describe, it, expect } from 'vitest'

import fetcher from '../fetcher'

import type { AxiosError } from 'axios'

type MockResponse = {
  statusCode: number
  description: string
}

describe('fetcher', () => {
  it('should fetch data successfully', async () => {
    const res = await fetcher<MockResponse>({ url: 'https://mock.codes/200' })

    expect(res.status).equals(200)
    expect(res.data.statusCode).equals(200)
  })

  it('should fail if server responses 500', async () => {
    try {
      await fetcher<MockResponse>({ url: 'https://mock.codes/500' })
    } catch (error) {
      expect((error as AxiosError<MockResponse>)?.response?.status).equals(500)
      expect((error as AxiosError<MockResponse>)?.response?.data?.statusCode).equals(500)
    }
  })

  it('should throw an error if url is wrong', async () => {
    try {
      await fetcher<unknown>({ url: 'http://wrong.url' })
    } catch (error) {
      // request of wrong url won't be sent, so the response should be undefined
      expect((error as AxiosError<unknown>)?.response).equals(undefined)
    }
  })
})
