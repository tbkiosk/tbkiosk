import { describe, it, expect } from 'vitest'

import { rawIpfsToUrl } from './ipfs'

describe('util', () => {
  it('transform ipfs url to https url', async () => {
    const input = 'ipfs://abc.png'
    const result = 'https://ipfs.io/ipfs/abc.png'

    expect(rawIpfsToUrl(input)).equals(result)
  })
})
