'use client'

import { Spinner } from '@nextui-org/spinner'
import { match } from 'ts-pattern'

import BeepUndeployed from './beep_undeployed'

import { useOwnedBeepTbaDeployedStatus } from '@/hooks/use_owned_beep_tba_deployed_status'

const BeepSettingsPanel = ({ tokenId, tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  const { status } = useOwnedBeepTbaDeployedStatus({ tokenId })

  return (
    <div className="min-h-[240px] mt-4 p-8 flex flex-col bg-[#131313] rounded-[10px]">
      {match(status)
        .with('Loading', () => (
          <div className="flex grow justify-center items-center">
            <Spinner color="default" />
          </div>
        ))
        .with('Deployed', () => (
          <>
            <h1>deployed</h1>
          </>
        ))
        .with('NotDeployed', () => (
          <BeepUndeployed
            tbaAddress={tbaAddress}
            tokenId={tokenId}
          />
        ))
        .with('Error', () => <p>Something Went wrong while trying to fetch data</p>)
        .with('NoToken', () => <p>No token</p>)
        .exhaustive()}
    </div>
  )
}

export default BeepSettingsPanel
