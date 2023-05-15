import { describe, it, expect } from 'vitest'

import { generateCodeChallenge } from '../pkce'

const CODE_CHALLENGE_LENGTH = 43

describe('util', () => {
  it('should transform ipfs url to https url', async () => {
    const codeChallenge = generateCodeChallenge()

    expect(codeChallenge?.length).equals(CODE_CHALLENGE_LENGTH)
  })
})
