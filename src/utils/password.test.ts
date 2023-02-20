import { describe, it, expect } from 'vitest'

import { plainTextToHash, generateRandomString } from './password'

describe('password', () => {
  it('should create correct random string', () => {
    const hash = plainTextToHash('test')

    expect(hash).equals(
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    )
  })

  it('should create random string from Uint8Array', () => {
    const hash = plainTextToHash()

    expect(hash).toBeTruthy()
  })

  it('should generate random string', () => {
    const random = generateRandomString()

    expect(random).toBeTruthy()
  })
})
