import { describe, it, expect } from 'vitest'

import { request } from '../request'

type MockResponse = {
  statusCode: number
  description: string
}

describe('request', () => {
  it('should fetch data successfully', async () => {
    const res = await request<MockResponse>({ url: 'https://mock.codes/200' })

    expect(res?.data?.statusCode).equals(200)
  })

  it('should fail if server responses 500', async () => {
    const res = await request<never, MockResponse>({ url: 'https://mock.codes/500' })

    expect((res?.error as MockResponse)?.statusCode).equal(500)
  })

  it('should throw an error if url is wrong', async () => {
    const res = await request<never, never>({ url: 'http://wrong.url' })

    expect(res.data).toBeUndefined()
    expect(res.error).toBeUndefined()
  })
})
