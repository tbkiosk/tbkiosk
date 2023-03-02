import { useAccountBalance } from '@suiet/wallet-kit'
import { useEvmNativeBalance } from '@moralisweb3/next'
import { useAccount } from 'wagmi'

const MOCK_SUI_USD_RATE = 0.01
const MOCK_ETH_USD_RATE = 1650

const BalancesWrapper = () => {
  const { address: ethAddress, isConnected: ethConnected } = useAccount()

  return (
    <div className="flex flex-row grow gap-4 h-full px-9 py-3 rounded-[20px] shadow-[0_4px_10px_rgba(216,216,216,0.25)] overflow-hidden">
      {ethAddress && ethConnected && <BalancesBase ethAddress={ethAddress} />}
    </div>
  )
}

type BalancesBaseProps = {
  ethAddress: string
}

const BalancesBase = ({ ethAddress }: BalancesBaseProps) => {
  const suiBalanceObject = useAccountBalance()
  const ethBalanceObject = useEvmNativeBalance({
    address: '0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5',
  })

  const suiBalance = Number(suiBalanceObject.balance) / 1_000_000_000
  const ethBalance = Number(ethBalanceObject.data?.balance?.ether) || 0

  return (
    <div className="flex flex-row grow gap-8">
      <div className="flex flex-col">
        <span className="text-lg">Total floor</span>
        <span className="text-4xl font-bold">
          {`$ ${(
            MOCK_SUI_USD_RATE * suiBalance +
            MOCK_ETH_USD_RATE * ethBalance
          ).toLocaleString()}`}
        </span>
      </div>
    </div>
  )
}

export default BalancesWrapper
