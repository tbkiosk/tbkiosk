'use client'

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import ExplorerLink from '@/app/mint/beep/settings/[tokenId]/components/etherscan_link'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@nextui-org/spinner'
import dayjs from 'dayjs'
import { SwapTransaction } from '@/app/api/beep/profile/[tokenBoundAccount]/investment-history/route'

type Props = {
  tbaAddress: string
}

const InvestmentHistory = ({ tbaAddress }: Props) => {
  const columns = ['Activity', 'Amount', 'Time', 'Status']
  const { data, status } = useQuery<SwapTransaction[]>({
    queryKey: ['deposit-history', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/investment-history`)

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
      isSuccess: item.isSuccess,
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
            <TableCell className="font-medium py-5">
              <div className="flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                    fill="#5065E4"
                  />
                  <path
                    d="M11.9985 4.91016V10.1527L16.3605 12.1327L11.9985 4.91016Z"
                    fill="white"
                    fillOpacity="0.602"
                  />
                  <path
                    d="M11.9988 4.91016L7.63623 12.1327L11.9988 10.1527V4.91016Z"
                    fill="white"
                  />
                  <path
                    d="M11.9985 15.5292V19.0915L16.3634 12.957L11.9985 15.5292Z"
                    fill="white"
                    fillOpacity="0.602"
                  />
                  <path
                    d="M11.9988 19.0915V15.5287L7.63623 12.957L11.9988 19.0915Z"
                    fill="white"
                  />
                  <path
                    d="M11.9985 14.704L16.3605 12.1312L11.9985 10.1523V14.704Z"
                    fill="white"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M7.63623 12.1312L11.9988 14.704V10.1523L7.63623 12.1312Z"
                    fill="white"
                    fillOpacity="0.602"
                  />
                </svg>
                <span>Buy ETH</span>
              </div>
            </TableCell>
            <TableCell className="font-medium">{item.value} USDT</TableCell>
            <TableCell className="font-medium">{item.date}</TableCell>
            <TableCell className="font-medium text-right">
              <ExplorerLink
                txhash={item.hash}
                isSuccessful={item.isSuccess}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default InvestmentHistory
