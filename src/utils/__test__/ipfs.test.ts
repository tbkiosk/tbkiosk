import { describe, it, expect } from 'vitest'

import { rawIpfsToUrl } from '../ipfs'

describe('util', () => {
  it('should transform ipfs url to https url', async () => {
    const input = 'ipfs://abc.png'
    const result = 'https://ipfs.io/ipfs/abc.png'

    expect(rawIpfsToUrl(input)).equals(result)
  })

  it('should return empty if it is not ipfs protocal url', async () => {
    const input = 'notipfs://abc.png'

    // @ts-expect-error intended to test error case
    expect(rawIpfsToUrl(input)).equals('')
  })
})
