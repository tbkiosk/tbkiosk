'use client'

import { ConnectWallet, useConnectionStatus, useAddress } from '@thirdweb-dev/react'

import { maskAddress } from '@/utils/address'

const ScrollerSettingsConnectButton = () => {
  const connectionStatus = useConnectionStatus()
  const address = useAddress()

  return (
    <ConnectWallet
      detailsBtn={() => (
        <button className="flex items-center justify-center gap-2 px-4 py-2 font-medium text-black bg-white rounded-xl tracking-wider">
          {connectionStatus === 'connected' && (
            <div className="w-[10px]">
              <svg
                width="10"
                height="20"
                viewBox="0 0 10 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99671 10.1875L5 13.8125L0 10.1875L5 0L9.99671 10.1875ZM5 14.9766L0 11.3516L5 20L10 11.3516L5 14.9766Z"
                  fill="black"
                />
              </svg>
            </div>
          )}
          {connectionStatus === 'disconnected' ? 'Connect Wallet' : maskAddress(address)}
        </button>
      )}
      switchToActiveChain
      style={{ paddingBottom: '8px', paddingTop: '8px' }}
    />
  )
}

export default ScrollerSettingsConnectButton
