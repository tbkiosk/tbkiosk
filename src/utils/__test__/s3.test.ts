import { describe, it, expect } from 'vitest'

import { listBuckets } from '../s3'

describe('S3', () => {
  it('should list buckets successfully', async () => {
    const buckets = await listBuckets()

    expect(buckets?.length).toBeGreaterThanOrEqual(1)
  })
})
