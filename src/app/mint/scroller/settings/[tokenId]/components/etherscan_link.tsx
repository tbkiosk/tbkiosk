import { EXPLORER } from '@/constants/explorer'

import { env } from 'env.mjs'

const ExplorerLink = ({ txhash, isSuccessful }: { txhash: string; isSuccessful: boolean }) => {
  const explorerBase = EXPLORER[+env.NEXT_PUBLIC_CHAIN_ID_SCROLLER as 1 | 5 | 137 | 11155111]
  return (
    <a
      href={`${explorerBase}/tx/${txhash}`}
      className="inline-flex items-center"
      target={'_blank'}
      rel="noreferrer"
    >
      {isSuccessful ? <span className="text-[#78EDC1]">Success</span> : <span className="text-[#ED3733]">Failed</span>}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.79289 4.50001C4.79289 4.10948 5.10947 3.7929 5.49999 3.7929L11.5 3.7929C11.8905 3.7929 12.2071 4.10948 12.2071 4.50001L12.2071 10.5C12.2071 10.8905 11.8905 11.2071 11.5 11.2071C11.1095 11.2071 10.7929 10.8905 10.7929 10.5L10.7929 6.20712L4.99999 12C4.72385 12.2762 4.27613 12.2762 3.99999 12C3.72385 11.7239 3.72385 11.2762 3.99999 11L9.79289 5.20711L5.49999 5.20712C5.10947 5.20712 4.79289 4.89053 4.79289 4.50001Z"
          fill={isSuccessful ? '#78EDC1' : '#ED3733'}
        />
      </svg>
    </a>
  )
}

export default ExplorerLink
