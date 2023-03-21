import { describe, it, expect, test } from 'vitest'
import * as dotenv from 'dotenv'

import { getCredential } from '../cos'

describe('cos', () => {
  it('should get valid credentials', async () => {
    dotenv.config({ path: '.env.local' })

    const res = await getCredential()

    expect(res).toBeTruthy()
  })
})
