import { sha256 } from '@noble/hashes/sha256'
import { randomBytes } from '@noble/hashes/utils'

export const plainTextToHash = (plainText: string = generateRandomString()) =>
  Buffer.from(sha256(plainText)).toString('hex')

export const generateRandomString = () =>
  Buffer.from(randomBytes()).toString('hex')
