'use client'

import { useEffect, type Key } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import BeepEth from 'public/icons/tokens/beep-eth.svg'
import ArrowIcon from 'public/icons/arrow-short.svg'
import DepositIcon from 'public/icons/deposit.svg'
import WithdrawIcon from 'public/icons/withdraw.svg'

import { EXPLORER } from '@/constants/explorer'
import { TransactionType } from '@/types/transactions'

import { env } from 'env.mjs'

import type { AssetTransfersWithMetadataResult } from 'alchemy-sdk'

type ScrollerTransferResult = AssetTransfersWithMetadataResult & { type: TransactionType }

const AssetHistory = ({ tbaAddress, tbaOwner }: { tbaAddress: string; tbaOwner: string }) => {
  const { data, isFetching, error } = useQuery<ScrollerTransferResult[]>({
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-transactions', tbaAddress],
    queryFn: async () => {
      const [depositRes] = await Promise.all([fetch(`/api/scroller/profile/${tbaAddress}/asset-transactions/deposit`)])

      const [withdrawalRes] = await Promise.all([
        fetch(`/api/scroller/profile/${tbaAddress}/asset-transactions/withdrawal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tokenBoundAccount: tbaAddress, tbaOwner: tbaOwner }),
        }),
      ])

      if (!depositRes.ok) {
        throw new Error(depositRes.statusText)
      }

      if (!withdrawalRes.ok) {
        throw new Error(withdrawalRes.statusText)
      }

      const [depositData, withdrawalData]: ScrollerTransferResult[][] = await Promise.all([depositRes.json(), withdrawalRes.json()])

      const transactions = [...depositData, ...withdrawalData] || []

      transactions.sort((a, b) => {
        const dateA = a.metadata?.blockTimestamp ? new Date(a.metadata.blockTimestamp).getTime() : 0
        const dateB = b.metadata?.blockTimestamp ? new Date(b.metadata.blockTimestamp).getTime() : 0
        return dateB - dateA
      })

      return transactions
    },
  })

  const renderCell = (item: ScrollerTransferResult, columnKey: Key) => {
    switch (columnKey) {
      case 'activity': {
        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex justify-center items-center bg-[#222325] rounded-full">
              <div className="h-3 w-3">
                {item.type === TransactionType.DEPOSIT && <DepositIcon />}
                {item.type === TransactionType.WITHDRAWAL && <WithdrawIcon />}
              </div>
            </div>
            <div>{item.type}</div>
          </div>
        )
      }
      case 'amount': {
        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex items-center justify-center bg-[#222325] rounded-full">
              <div className="h-3 w-3">
                <BeepEth />
              </div>
            </div>
            <div>
              {item.value} {item.asset || 'unknown'}
            </div>
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
      toast.error((error as Error)?.message || 'Failed to load deposit transactions')
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
      aria-label="TBA deposity history"
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

export default AssetHistory
