'use client'

import { useEffect, type Key } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { checksumAddress } from 'viem'
import dayjs from 'dayjs'

import ArrowIcon from 'public/icons/arrow-short.svg'
import DepositIcon from 'public/icons/deposit.svg'

import { TOKENS_FROM } from '@/constants/token'
import { explorer } from '@/constants/explorer'
import { TransactionType } from '@/constants/transactions'

import { env } from 'env.mjs'

import type { AssetTransfersWithMetadataResult } from 'alchemy-sdk'

type BeepTransferResult = AssetTransfersWithMetadataResult & { type: TransactionType }

const AssetHistory = ({ tbaAddress }: { tbaAddress: string }) => {
  const { data, isFetching, error } = useQuery<BeepTransferResult[]>({
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-transactions', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/asset-transactions/deposit`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const response: BeepTransferResult[] = await res.json()

      return response || []
    },
  })

  const renderCell = (item: BeepTransferResult, columnKey: Key) => {
    switch (columnKey) {
      case 'activity': {
        const token = TOKENS_FROM[checksumAddress((item?.rawContract?.address || '0x') as `0x${string}`)]

        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex justify-center items-center bg-[#222325] rounded-full">
              <div className="h-3 w-3">
                <DepositIcon />
              </div>
            </div>
            <div>Deposit {token ? token.name : 'unknown'}</div>
          </div>
        )
      }
      case 'amount': {
        const token = TOKENS_FROM[checksumAddress((item?.rawContract?.address || '0x') as `0x${string}`)]

        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[#222325] rounded-full">{token && token.icon()}</div>
            <div>
              {item.value} {token ? token.name : 'unknown'}
            </div>
          </div>
        )
      }
      case 'status': {
        return (
          <a
            className="flex items-center text-[#78edc1] hover:underline"
            href={`${explorer[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]}/tx/${item.hash}`}
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
      toast.error((error as Error)?.message || 'Failed to load deposit transactions')
    }
  }, [error])

  return (
    <Table
      aria-label="TBA deposity history"
      classNames={{
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

export default AssetHistory
