'use client'

import { useState } from 'react'
import { Tabs, Tab } from '@nextui-org/react'

import AssetHistory from './asset_history'
import BridgeHistory from './bridge_history'
import { TbaUser } from '@/types'

enum TabsKeys {
  INVT = 'INVT',
  DW = 'DW',
}

// enum HistoryFilter {
//   ALL = 'ALL',
//   DEPOSIT = 'DEPOSIT',
//   WITHDRAWAL = 'WITHDRAWAL',
//   BRIDGE = 'BRIDGE',
//   GAS = 'GAS',
// }

const TbaRecord = ({ tba, owner }: { tba: TbaUser; owner: string }) => {
  const [selected, setSelected] = useState<TabsKeys>(TabsKeys.INVT)
  // const [filter, setFilter] = useState<HistoryFilter>(HistoryFilter.ALL)

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="tba-record-tabs"
        classNames={{
          cursor: 'bg-transparent shadow-none',
          panel: 'overflow-x-auto',
          tabContent:
            'font-medium text-xl group-data-[selected=false]:text-white group-data-[selected=true]:text-[#78edc1] bg-transparent group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-b-[#78edc1]',
          tabList: 'bg-transparent',
        }}
        onSelectionChange={key => setSelected(key as TabsKeys)}
        selectedKey={selected}
      >
        <Tab
          key={TabsKeys.INVT}
          title="Bridge History"
        >
          <BridgeHistory tbaAddress={tba.address} />
        </Tab>
        <Tab
          key={TabsKeys.DW}
          title="Deposits/Withdrawals"
        >
          <AssetHistory
            tbaAddress={tba.address}
            tbaOwner={owner}
          />
        </Tab>
      </Tabs>
    </div>
  )
}

export default TbaRecord
