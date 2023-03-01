import { useState, useEffect } from 'react'
import { useWallet } from '@suiet/wallet-kit'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount } from 'wagmi'
import cl from 'classnames'

import { Dropdown } from '@/components'

import { useSuiWalletModal } from '@/context/sui_wallet_modal_context'

import { ellipsisMiddle } from '@/utils/address'

const WalletDropdown = () => {
  const {
    connected: suiConnected,
    address: suiAddress = '',
    disconnect: suiDisconnect,
  } = useWallet()
  const { address: ethAddress, isConnected: ethIsConnected } = useAccount()

  const { open: ethOpen } = useWeb3Modal()
  const { setOpen: setSuiModalOpen } = useSuiWalletModal()

  const [mounted, setMounted] = useState(false)

  const renderButton = () => {
    if (!mounted) {
      return <span>Connect wallet</span>
    }

    const wallets = [suiAddress, ethAddress].filter((wallet) => !!wallet)

    if (wallets.length < 1) {
      return <span>Connect wallet</span>
    }

    return (
      <span>{`${wallets.length} wallet${wallets.length > 1 ? 's' : ''}`}</span>
    )
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Dropdown renderButton={renderButton}>
        <Dropdown.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Dropdown.Item>
            {() => (
              <div
                className={cl(
                  'block w-full px-4 py-4 text-left text-sm text-white truncate rounded-tl-md rounded-tr-md cursor-pointer transition-colors hover:bg-[#333333]'
                )}
                onClick={() =>
                  suiConnected ? suiDisconnect() : setSuiModalOpen(true)
                }
              >
                {`Sui ${suiConnected ? `: ${ellipsisMiddle(suiAddress)}` : ''}`}
              </div>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {() => (
              <div
                className={cl(
                  'block w-full px-4 py-4 text-left text-sm text-white truncate rounded-bl-md rounded-br-md cursor-pointer transition-colors hover:bg-[#333333]'
                )}
                onClick={() => ethOpen()}
              >
                {`Ethereum ${
                  ethIsConnected ? `: ${ellipsisMiddle(ethAddress || '')}` : ''
                }`}
              </div>
            )}
          </Dropdown.Item>
        </Dropdown.Items>
      </Dropdown>
    </>
  )
}

export default WalletDropdown
