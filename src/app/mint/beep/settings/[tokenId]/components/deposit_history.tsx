'use client'

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import EtherscanLink from '@/app/mint/beep/settings/[tokenId]/components/etherscan_link'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@nextui-org/spinner'
import dayjs from 'dayjs'
import { TransferTransaction } from '@/app/api/beep/profile/[tokenBoundAccount]/asset-transactions/route'

type Props = {
  tbaAddress: string
}

export const DepositHistory = ({ tbaAddress }: Props) => {
  const columns = ['Activity', 'Amount', 'Time', 'Status']
  const { data, status } = useQuery<TransferTransaction[]>({
    queryKey: ['investment-history', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/asset-transactions`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return await res.json()
    },
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!tbaAddress,
  })

  if (status === 'loading') {
    return <Spinner color="default" />
  }

  if (data === null || data === undefined) {
    return <div>No Data</div>
  }

  const tableData = data.map(item => {
    const date = dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')
    return {
      hash: item.hash,
      value: item.value,
      date,
      type: item.type,
    }
  })

  return (
    <Table
      aria-label="Token bound transaction history"
      removeWrapper
    >
      <TableHeader className="p-0">
        {columns.map((column, index) => (
          <TableColumn
            key={index}
            className={`bg-transparent text-[#808080] ${index === columns.length - 1 ? 'text-right' : ''}`}
          >
            {column}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent={'No Data'}>
        {tableData.map(item => (
          <TableRow
            key={item.hash}
            className={'text-[#F5F5F5]'}
          >
            <TableCell className="font-medium py-5">{item.type}</TableCell>
            <TableCell className="font-medium">{item.value} USDT</TableCell>
            <TableCell className="font-medium">{item.date}</TableCell>
            <TableCell className="font-medium text-right">
              <EtherscanLink
                txhash={item.hash}
                isSuccessful={true}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
