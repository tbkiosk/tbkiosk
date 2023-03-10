import { useState, useEffect } from 'react'
import { useWallet } from '@suiet/wallet-kit'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount } from 'wagmi'
import cl from 'classnames'

import { Dropdown, Tooltip, CCSignInButton } from '@/components'

import { useSuiWalletModal } from '@/context/sui_wallet_modal_context'

import { ellipsisMiddle } from '@/utils/address'

type WalletDropdownProps = {
  classNames?: string
  containerClassNames?: string
  onWalletSelectSuccess?: (address: string) => void
}

const WalletDropdown = ({ classNames, containerClassNames, onWalletSelectSuccess }: WalletDropdownProps) => {
  const { connected: suiConnected, address: suiAddress = '', disconnect: suiDisconnect } = useWallet()
  const { address: ethAddress, isConnected: ethIsConnected } = useAccount()

  const { open: ethOpen } = useWeb3Modal()
  const { setOpen: setSuiModalOpen } = useSuiWalletModal()

  const [isMounted, setIsMounted] = useState(false)

  const renderButton = () => {
    if (!isMounted) {
      return
    }

    const wallets = [suiAddress, ethAddress].filter(wallet => !!wallet)

    if (wallets.length < 1) {
      return <span>Connect wallet</span>
    }

    return <span>{`${wallets.length} wallet${wallets.length > 1 ? 's' : ''}`}</span>
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (suiConnected && suiAddress) {
      onWalletSelectSuccess?.(suiAddress)
    }
  }, [suiConnected, suiAddress])

  useEffect(() => {
    if (ethIsConnected && ethAddress) {
      onWalletSelectSuccess?.(ethAddress)
    }
  }, [ethIsConnected, ethAddress])

  return (
    <>
      <Dropdown
        renderButton={renderButton}
        classNames={classNames}
        containerClassNames={containerClassNames}
      >
        <Dropdown.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Dropdown.Item>
            {() => (
              <div
                className={cl(
                  'block w-full px-4 py-4 text-left text-sm text-white truncate rounded-tl-md rounded-tr-md cursor-pointer transition-colors hover:bg-[#333333]'
                )}
                onClick={() => (suiConnected ? suiDisconnect() : setSuiModalOpen(true))}
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
                {`Ethereum ${ethIsConnected ? `: ${ellipsisMiddle(ethAddress || '')}` : ''}`}
              </div>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {() => (
              <Tooltip
                classNames="[&>span]:text-black [&>span]:bg-white"
                tip="Coming soon"
              >
                <div
                  className={cl(
                    'block w-full px-4 py-4 text-left text-sm text-white truncate rounded-bl-md rounded-br-md cursor-not-allowed transition-colors hover:bg-[#333333]'
                  )}
                >
                  Aptos
                </div>
              </Tooltip>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {() => (
              <Tooltip
                classNames="[&>span]:text-black [&>span]:bg-white"
                tip="Coming soon"
              >
                <div
                  className={cl(
                    'block w-full px-4 py-4 text-left text-sm text-white truncate rounded-bl-md rounded-br-md cursor-not-allowed transition-colors hover:bg-[#333333]'
                  )}
                >
                  Solana
                </div>
              </Tooltip>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {() => (
              <div
                className={cl(
                  'block w-full px-4 py-4 text-left text-sm text-white truncate rounded-bl-md rounded-br-md transition-colors hover:bg-[#333333]'
                )}
              >
                <CCSignInButton className="!h-auto !p-0 !bg-transparent !text-sm !text-white !font-normal !border-none" />
              </div>
            )}
          </Dropdown.Item>
        </Dropdown.Items>
      </Dropdown>
    </>
  )
}

export default WalletDropdown
