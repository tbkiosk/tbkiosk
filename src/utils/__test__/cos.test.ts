import { describe, it, expect } from 'vitest'

import { getCredential } from '../cos'

describe('cos', () => {
  it('should get valid credentials', async () => {
    const res = await getCredential()

    expect(res).toBeTruthy()
  })
})
