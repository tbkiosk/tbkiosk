'use client'

import { useEffect, type Key } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import ArrowIcon from 'public/icons/arrow.svg'

import { EXPLORER } from '@/constants/explorer'
import { TransactionType } from '@/types/transactions'

import { env } from 'env.mjs'

import type { AssetTransfersWithMetadataResult } from 'alchemy-sdk'
// import BeepEth from 'public/icons/tokens/beep-eth.svg'
import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import ScrollCircle from 'public/icons/tokens/scroll-circle.svg'

type ScrollerTransferResult = AssetTransfersWithMetadataResult & { type: TransactionType }

const BridgeHistory = ({ tbaAddress }: { tbaAddress: string }) => {
  const { data, isFetching, error } = useQuery<ScrollerTransferResult[]>({
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-investment', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/scroller/profile/${tbaAddress}/bridging-history`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const investmentData: ScrollerTransferResult[] = await res.json()

      return investmentData || []
    },
  })

  const trimTrailingZeros = (num: number) => (+num.toFixed(10)).toString().replace(/(\.[0-9]*?)0*$/, '$1')

  const renderCell = (item: ScrollerTransferResult, columnKey: Key) => {
    const gasItem: ScrollerTransferResult | undefined = data?.find(_tx => _tx.hash === item.hash && _tx.type === TransactionType.GAS)

    const ETH_PRICE = 2050 // TODO: retrieve
    const scrollL2Fee = 0.00035 // TODO: store in constants / get from contract

    const txnValue = (gasItem?.value ?? 0) + (item.value ?? 0)

    const gasUsd = (gasItem?.value ?? 0 * 2050).toFixed(2)

    const scrollFee = scrollL2Fee
    const scrollFeeUsd = (scrollFee * 2050).toFixed(2)

    switch (columnKey) {
      case 'activity': {
        return (
          <div className="flex items-center gap-1">
            <div className="h-6 w-6">
              <EthereumCircle />
            </div>
            <div className="h-3 w-3">
              <ArrowIcon />
            </div>
            <div className="h-6 w-6">
              <ScrollCircle />
            </div>
          </div>
        )
      }
      case 'amount': {
        return (
          <div>
            {trimTrailingZeros(+txnValue.toFixed(12))} {item.asset || 'unknown'}
          </div>
        )
      }
      case 'gas': {
        return (
          <div className="flex items-center gap-2">
            <div>
              {gasItem?.value?.toFixed(8)} {item.asset || 'unknown'}
            </div>
            <div className="text-xs opacity-50">${gasUsd}</div>
          </div>
        )
      }
      case 'l2fee': {
        return (
          <div className="flex items-center gap-2">
            <div>
              {scrollL2Fee} {item.asset || 'unknown'}
            </div>
            <div className="text-xs opacity-50">${scrollFeeUsd}</div>
          </div>
        )
      }
      case 'status': {
        return (
          <a
            className="flex items-center text-[#78edc1] hover:underline"
            href={`${EXPLORER[+env.NEXT_PUBLIC_CHAIN_ID_SCROLLER as 1 | 5 | 137 | 11155111]}/tx/${item.hash}`}
            rel="noreferrer"
            target="_blank"
          >
            Success
            <span className="h-4 w-4">
              <ArrowIcon />
            </span>
          </a>
        )
      }
      case 'time': {
        return item?.metadata?.blockTimestamp ? dayjs(item.metadata.blockTimestamp).format('YYYY-MM-DD HH:mm') : '-'
      }
      default: {
        return null
      }
    }
  }

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || 'Failed to load bridged transactions')
    }
  }, [error])

  if (isFetching) {
    return (
      <div className="flex justify-center mt-[3rem]">
        <Spinner color="default" />
      </div>
    )
  }

  return (
    <Table
      aria-label="TBA bridged history"
      classNames={{
        base: 'min-w-[640px]',
        td: 'font-medium',
        th: 'bg-transparent',
        wrapper: 'p-0 bg-transparent shadow-none',
      }}
    >
      <TableHeader>
        <TableColumn key="activity">Activity</TableColumn>
        <TableColumn key="amount">Amount</TableColumn>
        <TableColumn key="gas">L1 Gas</TableColumn>
        <TableColumn key="l2fee">L2 Fee (Fixed)</TableColumn>
        <TableColumn key="time">Time</TableColumn>
        <TableColumn key="status">Status</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isFetching}
        items={data?.filter(item => item.type === 'BRIDGE') || []}
      >
        {item => <TableRow key={item.uniqueId}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  )
}

export default BridgeHistory
