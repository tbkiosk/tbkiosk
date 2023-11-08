'use client'

import { ConnectWallet, useAddress, useContract, Web3Button, useContractRead, useSigner, ThirdwebSDK } from '@thirdweb-dev/react'
import { erc20ABI } from '@wagmi/core'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import { chain } from '@/constants/chain'
import { bytesToHex, numberToBytes } from 'viem'
import { TokenboundClient } from '@tokenbound/sdk'

const NFT_CONTRACT_ADDRESS = '0x117E22Df83B49b105F87430601614eB263D688F4'
const REGISTRY_CONTRACT_ADDRESS = '0x284be69BaC8C983a749956D7320729EB24bc75f9'
const IMPLEMENTATION_CONTRACT_ADDRESS = '0x794f050559314Aecf62Cecb2f7ca321F7817a298'
const USDC_CONTRACT = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
const AMOUNT_TO_DEPOSIT = 10
const USDC_DECIMAL = 6

const Allowance = () => {
  const address = useAddress()
  const { contract } = useContract(USDC_CONTRACT, erc20ABI)
  const { data, isLoading, error } = useContractRead(contract, 'allowance', [address, NFT_CONTRACT_ADDRESS])
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return <div>Allowance: {ethers.utils.formatUnits(data, USDC_DECIMAL)} USDC</div>
}

const Mint = ({ amount }: { amount: number }) => {
  const signer = useSigner()

  return (
    <Web3Button
      action={async contract => {
        if (!signer) return
        const sdk = ThirdwebSDK.fromSigner(signer, 'goerli', {
          clientId: '562418b1bf3b5fd10fe1b4e690f17558',
        })
        const nftContract = await sdk.getContract(NFT_CONTRACT_ADDRESS, 'nft-drop')
        const prepareTx = await nftContract.erc721.claim.prepare(amount)
        const claimArgs = prepareTx.getArgs()
        const salt = bytesToHex(numberToBytes(0, { size: 32 }))
        const claimAndCreateArgs = {
          receiver: claimArgs[0],
          quantity: claimArgs[1],
          currency: claimArgs[2],
          pricePerToken: claimArgs[3],
          allowlistProof: claimArgs[4],
          data: claimArgs[5],
          registry: REGISTRY_CONTRACT_ADDRESS,
          implementation: IMPLEMENTATION_CONTRACT_ADDRESS,
          salt: salt,
          chainId: chain.chainId,
          tokenToTransfer: USDC_CONTRACT,
          /**Note: leave amountToTransfer as 0 if user doesn't want to deposit token before mint, it will still create tba but does not transfer any toke right after*/
          amountToTransfer: ethers.utils.parseUnits(AMOUNT_TO_DEPOSIT.toString(), USDC_DECIMAL),
        }
        await contract.call('claimAndCreateTba', [claimAndCreateArgs])
      }}
      contractAddress={NFT_CONTRACT_ADDRESS}
      onError={error => {
        toast.error((error as unknown as { reason: string })?.reason || 'Failed to approve')
      }}
      onSuccess={() => {
        toast.success('Token minted')
      }}
      theme="dark"
    >
      Step2: Mint,Create TBA, Transfer Token
    </Web3Button>
  )
}

const ApproveToken = ({ amount }: { amount: number }) => {
  return (
    <Web3Button
      action={async contract => {
        await contract.call('approve', [
          NFT_CONTRACT_ADDRESS,
          ethers.utils.parseUnits((AMOUNT_TO_DEPOSIT * amount).toString(), USDC_DECIMAL),
        ])
      }}
      contractAbi={erc20ABI}
      contractAddress={USDC_CONTRACT}
      onError={error => {
        toast.error((error as unknown as { reason: string })?.reason || 'Failed to approve')
      }}
      onSuccess={() => {
        toast.success('Approved')
      }}
      theme="dark"
    >
      Step1: Approve {AMOUNT_TO_DEPOSIT * amount} USDC
    </Web3Button>
  )
}

const TbaAddress = ({ id }: { id: string }) => {
  const TOKEN_ID = id
  const tokenboundClient = new TokenboundClient({
    chainId: chain.chainId,
    registryAddress: REGISTRY_CONTRACT_ADDRESS,
    implementationAddress: IMPLEMENTATION_CONTRACT_ADDRESS,
  })

  const tokenboundAccount = tokenboundClient.getAccount({
    tokenContract: NFT_CONTRACT_ADDRESS,
    tokenId: TOKEN_ID,
  })

  return (
    <p>
      Tokenbound Account for Token #{TOKEN_ID} : {<span>{tokenboundAccount}</span>}
    </p>
  )
}

export default function Page() {
  const tokens = Array.from({ length: 100 }, (_, i) => i.toString())
  return (
    <div style={{ padding: '50px' }}>
      <ConnectWallet />
      <br />
      <br />
      <h2>
        Total Allowance:
        <Allowance />
      </h2>
      <h2>Mint a single token</h2>
      <ApproveToken amount={1} />
      <br />
      <br />
      <Mint amount={1} />
      <br />
      <br />
      <br />
      <h2>Mint two tokens</h2>
      <ApproveToken amount={2} />
      <br />
      <br />
      <Mint amount={2} />
      <br />
      <br />
      <br />
      {tokens.map(token => {
        return (
          <TbaAddress
            id={token}
            key={token}
          />
        )
      })}
    </div>
  )
}
