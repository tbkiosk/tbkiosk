import { useState } from 'react'
import { useWallet, ConnectModal } from '@suiet/wallet-kit'
import cl from 'classnames'

import { Dropdown, Loading } from '@/components'

import { ellipsisMiddle } from '@/utils/address'

const WalletDropdown = () => {
  const {
    connecting: suiConnecting,
    connected: suiConnected,
    address: suiAddress = '',
    disconnect: suiDisconnect,
  } = useWallet()

  const [isModalVisible, setModalVisible] = useState(false)

  const renderButton = () => {
    const wallets = [suiAddress].filter((wallet) => !!wallet)

    if (wallets.length < 1) {
      return <span>Connect wallet</span>
    }

    return (
      <span>{`${wallets.length} wallet${wallets.length > 1 ? 's' : ''}`}</span>
    )
  }

  return (
    <>
      <ConnectModal
        onConnectSuccess={() => setModalVisible(false)}
        onOpenChange={(open: boolean) => setModalVisible(open)}
        open={isModalVisible}
      />
      <Dropdown renderButton={renderButton}>
        <Dropdown.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Dropdown.Item>
            {() => (
              <Loading isLoading={suiConnecting}>
                <div
                  className={cl(
                    'block w-full px-4 py-4 text-left text-sm text-white truncate rounded-tl-md rounded-tr-md cursor-pointer transition-colors hover:bg-[#333333]'
                  )}
                  onClick={() =>
                    suiConnected ? suiDisconnect() : setModalVisible(true)
                  }
                >
                  {`Sui ${
                    suiConnected ? `: ${ellipsisMiddle(suiAddress)}` : ''
                  }`}
                </div>
              </Loading>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            {() => (
              <Loading isLoading={suiConnecting}>
                <div
                  className={cl(
                    'block w-full px-4 py-4 text-left text-sm text-white rounded-bl-md rounded-br-md cursor-pointer transition-colors hover:bg-[#333333]'
                  )}
                >
                  {`Ethereum`}
                </div>
              </Loading>
            )}
          </Dropdown.Item>
        </Dropdown.Items>
      </Dropdown>
    </>
  )
}

export default WalletDropdown
