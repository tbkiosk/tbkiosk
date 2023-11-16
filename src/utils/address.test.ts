import { expect, test } from 'vitest'

import { maskAddress } from './address'

test('Address with more than 10 characters should be masked', () => {
  expect(maskAddress('0x1234567890abcdef')).toBe('0x1234...cdef')
})

test('Address with no more than 10 characters should be remained', () => {
  expect(maskAddress('0x1234')).toBe('0x1234')
})

test('Non-string should be return emtpy string', () => {
  expect(maskAddress(null)).toBe('')
})
