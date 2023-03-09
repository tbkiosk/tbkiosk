import { useEffect, useState } from 'react'
import { useAccountBalance, useWallet } from '@suiet/wallet-kit'
import { useEvmNativeBalance } from '@moralisweb3/next'
import { useAccount } from 'wagmi'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip)

const MOCK_SUI_USD_RATE = 0.1
const MOCK_ETH_USD_RATE = 1650
const MOCK_MATIC_USD_RATE = 1.28

const BalancesWrapper = () => {
  const { address: ethAddress } = useAccount()
  const { address: suiAddress = '' } = useWallet()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const renderBalancesBase = () => {
    if (!isMounted) {
      return null
    }

    if (!ethAddress && !suiAddress) {
      return null
    }

    return <BalancesBase ethAddress={ethAddress as string} />
  }

  return (
    <div className="flex flex-row grow gap-4 h-full px-9 py-3 rounded-[20px] shadow-[0_4px_10px_rgba(216,216,216,0.25)] overflow-hidden">
      {renderBalancesBase()}
    </div>
  )
}

type BalancesBaseProps = {
  ethAddress: string
}

const BalancesBase = ({ ethAddress }: BalancesBaseProps) => {
  const suiBalanceObject = useAccountBalance()
  const ethBalanceObject = useEvmNativeBalance({
    address: ethAddress,
    chain: 0x1,
  })
  const maticBalanceObject = useEvmNativeBalance({
    address: ethAddress,
    chain: 0x89,
  })

  const suiBalanceValue =
    (Number(suiBalanceObject.balance) / 100_000_000 || 0) * MOCK_SUI_USD_RATE
  const ethBalanceValue =
    (Number(ethBalanceObject.data?.balance?.ether) || 0) * MOCK_ETH_USD_RATE
  const maticBalanceValue =
    (Number(maticBalanceObject.data?.balance?.ether) || 0) * MOCK_MATIC_USD_RATE
  const total = suiBalanceValue + ethBalanceValue + maticBalanceValue

  return (
    <div className="flex flex-row grow gap-8">
      <div className="grow">
        <p className="text-lg">Total floor</p>
        <p className="text-4xl font-bold">{`$ ${total.toLocaleString()}`}</p>
      </div>
      <div className="flex flex-row">
        <Doughnut
          data={{
            datasets: [
              {
                backgroundColor: [
                  'rgba(0, 255, 255, 0.2)',
                  'rgba(255, 255, 0, 0.2)',
                  'rgba(255, 0, 255, 0.2)',
                ],
                borderColor: [
                  'rgba(0, 255, 255, 1)',
                  'rgba(255, 255, 0, 1)',
                  'rgba(255, 0, 255, 1)',
                ],
                borderWidth: 1,
                data: [suiBalanceValue, ethBalanceValue, maticBalanceValue],
              },
            ],
            labels: ['sui', 'eth', 'matic'],
          }}
          height={80}
          options={{
            cutout: 50,
          }}
          width={80}
        />
        <div className="flex flex-col justify-center text-lg font-medium ml-4">
          <p>{`SUI ${((suiBalanceValue / total) * 100 || 0).toFixed(0)}%`}</p>
          <p>{`ETH ${((ethBalanceValue / total) * 100 || 0).toFixed(0)}%`}</p>
          <p>{`MATIC ${((maticBalanceValue / total) * 100 || 0).toFixed(
            0
          )}%`}</p>
        </div>
      </div>
    </div>
  )
}

export default BalancesWrapper
