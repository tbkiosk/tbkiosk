import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useWallet } from '@suiet/wallet-kit'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount } from 'wagmi'
import cl from 'classnames'

import { Dropdown, Tooltip } from '@/components'

import { useSuiWalletModal } from '@/context/sui_wallet_modal_context'

import { ellipsisMiddle } from '@/utils/address'

type WalletDropdownProps = {
  onWalletSelectSuccess?: (address: string) => void
  buttonClassNames?: string
}

const WalletDropdown = ({ onWalletSelectSuccess, buttonClassNames }: WalletDropdownProps) => {
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

  const onDisconnectAll = () => {
    if (suiConnected) {
      suiDisconnect()
    }
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
        buttonClassNames={buttonClassNames}
        renderButton={renderButton}
        startIcon={
          <Image
            alt=""
            className="absolute left-6"
            height={24}
            src="/icons/wallet.svg"
            width={24}
          />
        }
      >
        <Dropdown.Items
          className={cl([
            'w-full absolute top-full right-0 pb-2 z-10 rounded-b-[1.75rem] overflow-hidden',
            'bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
          ])}
        >
          <Dropdown.Item>
            {() => (
              <div
                className="w-full pl-16 pr-4 py-2 relative text-left text-sm text-white truncate cursor-pointer group transition-colors hover:bg-[#2a2a2d]"
                onClick={() => ethOpen()}
              >
                <Image
                  alt=""
                  className="absolute inset-y-0 left-6 my-auto"
                  height={24}
                  src="/icons/chains/eth.svg"
                  width={24}
                />
                {`Ethereum ${ethIsConnected ? `: ${ellipsisMiddle(ethAddress || '')}` : ''}`}
                {ethIsConnected && (
                  <Image
                    alt=""
                    className="absolute inset-y-0 right-2 my-auto opacity-0 transition-opacity group-hover:opacity-100"
                    height={24}
                    src="/icons/disconnect.svg"
                    width={24}
                  />
                )}
              </div>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {() => (
              <div
                className="w-full pl-16 pr-4 py-2 relative text-left text-sm text-white truncate cursor-pointer group transition-colors hover:bg-[#2a2a2d] hover:pr-8"
                onClick={() => (suiConnected ? suiDisconnect() : setSuiModalOpen(true))}
              >
                <Image
                  alt=""
                  className="absolute inset-y-0 left-6 my-auto"
                  height={24}
                  src="/icons/chains/sui.svg"
                  width={24}
                />
                {`Sui ${suiConnected ? `: ${ellipsisMiddle(suiAddress)}` : ''}`}
                {suiConnected && (
                  <Image
                    alt=""
                    className="absolute inset-y-0 right-2 my-auto opacity-0 transition-opacity group-hover:opacity-100"
                    height={24}
                    src="/icons/disconnect.svg"
                    width={24}
                  />
                )}
              </div>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {() => (
              <Tooltip
                classNames="[&>span]:text-black [&>span]:bg-white"
                tip="Coming soon"
              >
                <div className="w-full pl-16 pr-4 py-2 relative text-left text-sm text-white truncate cursor-pointer transition-colors hover:bg-[#2a2a2d]">
                  <Image
                    alt=""
                    className="absolute inset-y-0 left-6 my-auto"
                    height={24}
                    src="/icons/chains/polygon.svg"
                    width={24}
                  />
                  Polygon
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
                <div className="w-full pl-16 pr-4 py-2 relative text-left text-sm text-white truncate cursor-pointer transition-colors hover:bg-[#2a2a2d]">
                  <Image
                    alt=""
                    className="absolute inset-y-0 left-6 my-auto"
                    height={24}
                    src="/icons/chains/solana.svg"
                    width={24}
                  />
                  Solana
                </div>
              </Tooltip>
            )}
          </Dropdown.Item>
          <hr className="my-2" />
          <Dropdown.Item>
            {() => (
              <div
                className="w-full pl-16 pr-4 py-2 relative text-left text-sm text-white truncate cursor-pointer transition-colors hover:bg-[#2a2a2d]"
                onClick={onDisconnectAll}
              >
                <Image
                  alt=""
                  className="absolute inset-y-0 left-6 my-auto"
                  height={24}
                  src="/icons/disconnect.svg"
                  width={24}
                />
                Disconnect all
              </div>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {() => (
              <div className="w-full pl-16 pr-4 py-2 relative text-left text-sm text-white truncate cursor-pointer transition-colors hover:bg-[#2a2a2d]">
                <Image
                  alt=""
                  className="absolute inset-y-0 left-6 my-auto"
                  height={24}
                  src="/icons/switch.svg"
                  width={24}
                />
                Switch to creator
              </div>
            )}
          </Dropdown.Item>
        </Dropdown.Items>
      </Dropdown>
    </>
  )
}

export default WalletDropdown
