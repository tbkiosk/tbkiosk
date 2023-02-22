type RawIpfs = `${'ipfs://'}${string}`

const IPFS_PROTOCOL = 'ipfs://'

export const rawIpfsToUrl = (rawIpfs: RawIpfs) =>
  rawIpfs.startsWith(IPFS_PROTOCOL)
    ? rawIpfs.replace(IPFS_PROTOCOL, 'https://ipfs.io/ipfs/')
    : ''
