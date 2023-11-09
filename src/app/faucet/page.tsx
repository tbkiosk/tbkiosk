'use client'
import { toast } from 'react-toastify'
import { useBalance, useContract, useTokenBalance, Web3Button } from '@thirdweb-dev/react'

const FAUCET_CONTRACT = '0x79E0a7769F078A75F5AeFBCDd98cD94700329D6C'
const USDC_CONTRACT = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'

const UserUSDCBalance = () => {
  const { data, isLoading, error } = useBalance(USDC_CONTRACT)
  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Error</span>
  return <span> {data?.displayValue} USDC</span>
}

const ContractUSDCBalance = () => {
  const { contract } = useContract(USDC_CONTRACT, 'token')
  const { data, isLoading, error } = useTokenBalance(contract, FAUCET_CONTRACT)
  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Error</span>
  return <span> {data?.displayValue} USDC</span>
}

export default function Page() {
  return (
    <div>
      <p>Faucet Contract: {FAUCET_CONTRACT}</p>
      <p>USDC Contract: {USDC_CONTRACT}</p>
      <p>
        Your Balance: <UserUSDCBalance />
      </p>
      <p>
        Contract Balance: <ContractUSDCBalance />
      </p>
      <Web3Button
        action={async contract => {
          await contract.call('withdraw')
        }}
        contractAddress={FAUCET_CONTRACT}
        onError={error => {
          toast.error((error as unknown as { reason: string })?.reason || 'Failed to get USDC')
        }}
        onSuccess={() => {
          toast.success('Success!')
        }}
        theme="dark"
      >
        Get Goerli USDC
      </Web3Button>
    </div>
  )
}
