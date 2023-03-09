type RawIpfs = `${'ipfs://'}${string}`

const IPFS_PROTOCOL = 'ipfs://'
const HTTP_PROTOCOL = 'http'

export const rawIpfsToUrl = (rawIpfs: RawIpfs) =>
  rawIpfs.startsWith(IPFS_PROTOCOL) ? rawIpfs.replace(IPFS_PROTOCOL, 'https://ipfs.io/ipfs/') : ''

export const stringToPinataURL = (str: string) => {
  if (!str) return ''

  if (str.startsWith(HTTP_PROTOCOL)) {
    return str
  } else {
    return `https://cyberconnect.mypinata.cloud/ipfs/${str}`
  }
}
