'use client'

import { Web3Button } from '@thirdweb-dev/react'
import { erc6551RegistryAbiV2 } from '@tokenbound/sdk'
import { toast } from 'react-toastify'

import { useOwnedBeepTbaDeployedStatus } from '@/hooks/use_owned_beep_tba_deployed_status'

import Note from 'public/beep/note.svg'

import { env } from 'env.mjs'

const BeepUndeployed = ({ tokenId, tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  const { setAccountDeployedStatus } = useOwnedBeepTbaDeployedStatus({ tokenId })

  const createAccount = async () => {
    try {
      const res = await fetch(`/api/beep/profile/${tbaAddress}`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to create user account')
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-20 w-20 my-12">
        <Note />
      </div>
      <p className="mb-8 font-medium text-center">
        You haven&apos;t deployed your token bound account yet. So you will not be able to use auto-invest function now.
      </p>
      <Web3Button
        action={async contract => {
          await contract.call('createAccount', [
            env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS,
            env.NEXT_PUBLIC_CHAIN_ID,
            env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS,
            tokenId ?? '',
            0,
            '0x',
          ])
        }}
        className="!h-12 !w-full !bg-white !text-lg md:!text:xl !text-black !rounded-full !transition-colors hover:!bg-[#e1e1e1] [&>svg>circle]:!stroke-white"
        contractAbi={erc6551RegistryAbiV2}
        contractAddress={env.NEXT_PUBLIC_REGISTRY_ADDRESS}
        onError={error => {
          toast.error((error as unknown as { reason: string })?.reason || 'Failed to deploy')
        }}
        onSuccess={() => {
          setAccountDeployedStatus('Deployed')
          createAccount()
        }}
        theme="dark"
      >
        Deploy Token Bound Account
      </Web3Button>
    </div>
  )
}

export default BeepUndeployed
