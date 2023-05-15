import randomstring from 'randomstring'
import CryptoJS from 'crypto-js'
import base64url from 'base64url'

export const generateCodeChallenge = () => {
  const codeVerifier = randomstring.generate(128)
  const base64Digest = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64)
  const codeChallenge = base64url.fromBase64(base64Digest)

  return codeChallenge
}
