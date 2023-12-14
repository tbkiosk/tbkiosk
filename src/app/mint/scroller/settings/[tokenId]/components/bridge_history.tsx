'use client'

import { useEffect, type Key, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import ArrowIcon from 'public/icons/arrow.svg'
import ArrowIconSuccess from 'public/icons/arrow-short.svg'

import { EXPLORER } from '@/constants/explorer'
import { TransactionType } from '@/types/transactions'

import { env } from 'env.mjs'

import type { AssetTransfersWithMetadataResult } from 'alchemy-sdk'
import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import ScrollCircle from 'public/icons/tokens/scroll-circle.svg'

type ScrollerTransferResult = AssetTransfersWithMetadataResult & { type: TransactionType }

const SCROLLER_L2_FEE = 0.00035 // TODO: store in constants / get from contract

const BridgeHistory = ({ tbaAddress }: { tbaAddress: string }) => {
  const [ethPrice, setEthPrice] = useState<number | null>(null)

  const fetchEthPrice = async () => {
    const res = await fetch('/api/scroller/price/eth')
    const data = await res.json()
    setEthPrice(data.ethereum.usd)
  }

  useEffect(() => {
    fetchEthPrice()
    const intervalId = setInterval(fetchEthPrice, 10000)
    return () => clearInterval(intervalId)
  }, [])

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

    let gasUsd = 0
    if (gasItem?.value && ethPrice) {
      gasUsd = gasItem?.value * ethPrice
    }

    const txnValue = (gasItem?.value ?? 0) + (item.value ?? 0) // gas + transfer value

    const scrollFee = SCROLLER_L2_FEE
    const scrollFeeUsd = (scrollFee * (ethPrice ? ethPrice : 0)).toFixed(2)

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
            <div className="text-xs opacity-50">${gasUsd.toFixed(2)}</div>
          </div>
        )
      }
      case 'l2fee': {
        return (
          <div className="flex items-center gap-2">
            <div>
              {SCROLLER_L2_FEE} {item.asset || 'unknown'}
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
              <ArrowIconSuccess />
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

  const hasTransactions = data && data.filter(item => item.type === 'BRIDGE').length > 0
  if (!hasTransactions) {
    return (
      <div className="text-center mt-5 opacity-80">
        <p>Alas, seems no assets have yet been bridged by your Pass!</p>
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
