'use client'

import { useState } from 'react'
import { Tabs, Tab } from '@nextui-org/react'

import DepositHistory from './deposit_history'

enum TabsKeys {
  DW = 'DW',
}

const TbaRecord = ({ tbaAddress }: { tbaAddress: string }) => {
  const [selected, setSelected] = useState<TabsKeys>(TabsKeys.DW)

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="tba-record-tabs"
        classNames={{
          cursor: 'bg-transparent shadow-none',
          tabContent:
            'font-medium text-xl group-data-[selected=false]:text-white group-data-[selected=true]:text-[#78edc1] bg-transparent group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-b-[#78edc1]',
          tabList: 'bg-transparent',
        }}
        onSelectionChange={key => setSelected(key as TabsKeys)}
        selectedKey={selected}
      >
        <Tab
          key={TabsKeys.DW}
          title="Deposit/Withdrawals"
        >
          <DepositHistory tbaAddress={tbaAddress} />
        </Tab>
      </Tabs>
    </div>
  )
}

export default TbaRecord
