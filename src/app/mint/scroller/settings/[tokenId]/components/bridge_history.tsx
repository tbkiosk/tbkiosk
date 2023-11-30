'use client'

import { useEffect, type Key } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import ArrowIcon from 'public/icons/arrow-short.svg'

import { TOKENS_TO } from '@/constants/token'
import { EXPLORER } from '@/constants/explorer'

import { env } from 'env.mjs'

import type { AssetTransfersWithMetadataResult } from 'alchemy-sdk'
import BeepEth from 'public/icons/tokens/beep-eth.svg'

const BridgeHistory = ({ tbaAddress }: { tbaAddress: string }) => {
  const { data, isFetching, error } = useQuery<AssetTransfersWithMetadataResult[]>({
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-investment', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/investment-history`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const investmentData: AssetTransfersWithMetadataResult[] = await res.json()

      return investmentData || []
    },
  })

  const renderCell = (item: AssetTransfersWithMetadataResult, columnKey: Key) => {
    switch (columnKey) {
      case 'activity': {
        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex items-center justify-center bg-[#222325] rounded-full">
              <div className="h-3 w-3">
                <BeepEth />
              </div>
            </div>
            <div>Buy {item.asset || 'unknown'}</div>
          </div>
        )
      }
      case 'amount': {
        return (
          <div>
            {item.value?.toFixed(12)} {item.asset || 'unknown'}
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
        <TableColumn key="time">Time</TableColumn>
        <TableColumn key="status">Status</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isFetching}
        items={data || []}
      >
        {item => <TableRow key={item.uniqueId}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  )
}

export default BridgeHistory
