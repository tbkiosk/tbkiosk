'use client'

import { useEffect, type Key } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { checksumAddress } from 'viem'
import dayjs from 'dayjs'

import ArrowIcon from 'public/icons/arrow-short.svg'

import { TOKENS_FROM } from '@/constants/token'
import { explorer } from '@/constants/explorer'

import { env } from 'env.mjs'

import type { AssetTransfersResponse, AssetTransfersResult } from 'alchemy-sdk'

const DepositHistory = ({ tbaAddress }: { tbaAddress: string }) => {
  const { data, isFetching, error } = useQuery<AssetTransfersResult[]>({
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-deposit-transactions', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/asset-transactions/deposit`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const response: AssetTransfersResponse = await res.json()

      return response?.transfers || []
    },
  })

  const renderCell = (item: AssetTransfersResult, columnKey: Key) => {
    const value = getKeyValue(item, columnKey)

    if (!value) {
      return null
    }

    switch (columnKey) {
      case 'rawContract': {
        const token = value?.address ? TOKENS_FROM[checksumAddress(value.address)] : null

        return (
          <div className="flex items-center gap-2">
            {token && <div className="h-6 w-6">{token?.icon()}</div>}
            <div>{token?.name || 'Unknown'}</div>
          </div>
        )
      }
      case 'value': {
        return value
      }
      case 'hash': {
        return (
          <a
            className="flex items-center text-[#78edc1] hover:underline"
            href={`${explorer[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]}/tx/${value}`}
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
      case 'metadata': {
        return value?.blockTimestamp ? dayjs(value.blockTimestamp).format('YYYY-MM-DD HH:mm') : '-'
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
        <TableColumn key="rawContract">Asset</TableColumn>
        <TableColumn key="value">Amount</TableColumn>
        <TableColumn key="metadata">Time</TableColumn>
        <TableColumn key="hash">Status</TableColumn>
      </TableHeader>
      <TableBody
        isLoading
        items={data || []}
      >
        {item => <TableRow key={item.uniqueId}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  )
}

export default DepositHistory
