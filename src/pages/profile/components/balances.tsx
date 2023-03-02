import { useEffect, useState } from 'react'
import { useAccountBalance } from '@suiet/wallet-kit'
import { useEvmNativeBalance } from '@moralisweb3/next'
import { useAccount } from 'wagmi'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip)

const MOCK_SUI_USD_RATE = 0.01
const MOCK_ETH_USD_RATE = 1650

const BalancesWrapper = () => {
  const { address: ethAddress, isConnected: ethConnected } = useAccount()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const renderBalancesBase = () => {
    if (!isMounted) {
      return null
    }

    if (!ethAddress || !ethConnected) {
      return null
    }

    return <BalancesBase ethAddress={ethAddress} />
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
  })

  const suiBalance = Number(suiBalanceObject.balance) / 100_000_000 || 0
  const ethBalance = Number(ethBalanceObject.data?.balance?.ether) || 0
  const total = suiBalance + ethBalance

  return (
    <div className="flex flex-row grow gap-8">
      <div className="grow">
        <p className="text-lg">Total floor</p>
        <p className="text-4xl font-bold">
          {`$ ${(
            MOCK_SUI_USD_RATE * suiBalance +
            MOCK_ETH_USD_RATE * ethBalance
          ).toLocaleString()}`}
        </p>
      </div>
      <div className="flex flex-row">
        <Doughnut
          data={{
            datasets: [
              {
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
                data: [suiBalance, ethBalance],
              },
            ],
            labels: ['sui', 'eth'],
          }}
          height={80}
          options={{
            cutout: 50,
          }}
          width={80}
        />
        <div className="flex flex-col justify-center text-lg font-medium ml-4">
          <p>{`ETH ${((ethBalance / total) * 100 || 0).toFixed(0)}%`}</p>
          <p>{`SUI ${((suiBalance / total) * 100 || 0).toFixed(0)}%`}</p>
        </div>
      </div>
    </div>
  )
}

export default BalancesWrapper
