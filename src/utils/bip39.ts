// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Ed25519Keypair } from "@mysten/sui.js";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

/**
 *
 * @param strength the mnemonic strength, typically 128 or 256 bits
 * @returns mnemonic words string. there should be 12 ((128+128/32)/11) or 24 ((256+256/32)/11) words
 */
export const generateMnemonic = (strength?: number) =>
  bip39.generateMnemonic(wordlist, strength);

/**
 *
 * @param strength the mnemonic strength, typically 128 or 256 bits
 * @returns [mnemonics, keypair]
 */
export const generateMnemonicAndKeypair = (strength?: number) => {
  const mnemonics = generateMnemonic(strength);
  const keypair = getKeypairFromMnemonics(mnemonics);

  return [mnemonics, keypair];
};

/**
 *
 * @param mnemonics
 * @param index derivation index
 * @returns Ed25519Keypair
 */
export const getKeypairFromMnemonics = (
  mnemonics: string,
  index = 0
): Ed25519Keypair => {
  const _mnemonics = normalizeMnemonics(mnemonics);

  if (index > -1) {
    const path = `m/44'/784'/${index}'/0'/0'`;
    return Ed25519Keypair.deriveKeypair(_mnemonics, path);
  }

  return Ed25519Keypair.deriveKeypair(_mnemonics);
};

/**
 * Converts mnemonic to entropy (byte array) using the english wordlist.
 * @param mnemonic 12-24 words
 * @return the entropy of the mnemonic (Uint8Array)
 */
export function mnemonicToEntropy(mnemonic: string): Uint8Array {
  return bip39.mnemonicToEntropy(mnemonic, wordlist);
}

/**
 * Converts entropy (byte array) to mnemonic using the english wordlist.
 * @param entropy Uint8Array
 * @return the mnemonic as string
 */
export function entropyToMnemonic(entropy: Uint8Array): string {
  return bip39.entropyToMnemonic(entropy, wordlist);
}

/**
 * Generate random byte to be used as entropy for the mnemonic
 * @param strength defaults to 128 to generate 12-word mnemonic that now is the default for the wallet
 * @returns
 */
export function getRandomEntropy(strength: 128 | 256 = 128) {
  return randomBytes(strength / 8);
}

export function validateEntropy(entropy: Uint8Array) {
  assertBytes(entropy, 16, 20, 24, 28, 32);
  return true;
}

/**
 * Validate a mnemonic string in the BIP39 English wordlist.
 *
 * @param mnemonics a words string split by spaces of length 12/15/18/21/24.
 *
 * @returns true if the mnemonic is valid, false otherwise.
 */
export function validateMnemonics(mnemonics: string): boolean {
  return bip39.validateMnemonic(mnemonics, wordlist);
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
    .join(" ");
}

export function entropyToSerialized(entropy: Uint8Array) {
  return bytesToHex(entropy);
}

/**
 *
 * @param serializedEntropy the serialized value of entropy (produced by {@link entropyToSerialized})
 * @returns the entropy bytes
 */
export function toEntropy(serializedEntropy: string) {
  return hexToBytes(serializedEntropy);
}

// ported from https://github.com/paulmillr/noble-hashes/blob/main/src/_assert.ts#L9
export function assertBytes(b: Uint8Array | undefined, ...lengths: number[]) {
  if (!(b instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new TypeError(
      `Expected Uint8Array of length ${lengths}, not of length=${b.length}`
    );
}
