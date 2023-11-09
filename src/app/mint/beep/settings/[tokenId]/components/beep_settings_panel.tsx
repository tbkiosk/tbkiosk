'use client'

import BeepDeployed from './beep_deployed'

const BeepSettingsPanel = ({ tokenId, tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  return (
    <div className="min-h-[240px] mt-4 p-8 flex flex-col bg-[#131313] rounded-[10px]">
      <BeepDeployed
        tbaAddress={tbaAddress}
        tokenId={tokenId}
      />
    </div>
  )
}

export default BeepSettingsPanel
