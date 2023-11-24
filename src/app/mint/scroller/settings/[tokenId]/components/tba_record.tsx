'use client'
import { Tabs, Tab } from '@nextui-org/react'

// import InvestmentHistory from '@/app/mint/scroller/settings/[tokenId]/components/investment_history'
// import { DepositHistory } from '@/app/mint/scroller/settings/[tokenId]/components/deposit_history'

type Props = {
  tbaAddress: string
}

const TbaRecord = ({ tbaAddress }: Props) => {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        variant="underlined"
        classNames={{
          tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-[#78EDC1]',
          tab: 'max-w-fit px-0 h-12 md:text-xl font-medium',
          tabContent: 'group-data-[selected=true]:text-[#78EDC1] group-data-[hover=true]:text-[#78EDC1] text-white',
          panel: 'px-0',
        }}
      >
        <Tab
          key="invest"
          title="DCA Transactions"
        >
          {/* <InvestmentHistory tbaAddress={tbaAddress} /> */}
        </Tab>
        <Tab
          key="deposit"
          title="Deposit/Withdrawals"
        >
          {/* <DepositHistory tbaAddress={tbaAddress} /> */}
        </Tab>
      </Tabs>
    </div>
  )
}

export default TbaRecord
