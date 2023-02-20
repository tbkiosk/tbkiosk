// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Ed25519Keypair } from '@mysten/sui.js'
import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'

/**
 *
 * @param strength the mnemonic strength, typically 128 or 256 bits
 * @returns mnemonic words string. there should be 12 ((128+128/32)/11) or 24 ((256+256/32)/11) words
 */
export const generateMnemonic = (strength?: number) =>
  bip39.generateMnemonic(wordlist, strength)

/**
 *
 * @param mnemonics
 * @param index derivation index
 * @returns Ed25519Keypair
 */
export const getKeypairFromMnemonics = (
  mnemonics: string,
  index?: number
): Ed25519Keypair => {
  const _mnemonics = normalizeMnemonics(mnemonics)

  if (typeof index === 'number' && index > -1) {
    const path = `m/44'/784'/${index}'/0'/0'`
    return Ed25519Keypair.deriveKeypair(_mnemonics, path)
  }

  return Ed25519Keypair.deriveKeypair(_mnemonics)
}

/**
 * Validate a mnemonic string in the BIP39 English wordlist.
 *
 * @param mnemonics a words string split by spaces of length 12/15/18/21/24.
 *
 * @returns true if the mnemonic is valid, false otherwise.
 */
export function validateMnemonics(mnemonics: string): boolean {
  return bip39.validateMnemonic(mnemonics, wordlist)
}

/**
 * Sanitize the mnemonics string provided by user.
 * @param mnemonics a 12-word string split by spaces that may contain mixed cases and extra spaces.
 * @returns a sanitized mnemonics string.
 */
export function normalizeMnemonics(mnemonics: string): string {
  return mnemonics
    .trim()
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .join(' ')
}
