import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { cx } from 'classix'

import { Button } from '@/components'

import { request } from '@/utils/request'

import type { Account } from '@prisma/client'
import type { AccountDeleteReq } from '@/pages/api/user/account'

type DisconnectButtonProps = {
  account: Account
  onRefresh: () => void
}

const DisconnectButton = ({ account, onRefresh }: DisconnectButtonProps) => {
  const { isLoading, mutate } = useMutation({
    mutationFn: async (args: AccountDeleteReq) => {
      const { error, data } = await request<Account>({
        url: '/api/user/account',
        method: 'DELETE',
        params: {
          id: args.id,
        },
      })

      if (error) {
        throw new Error(error as string)
      }

      return data
    },
    onSuccess: account => {
      toast.success(`Successfully disconnected ${account?.providerAccountId}`)
      onRefresh()
    },
    onError: error => {
      toast.error((error as Error)?.message || 'Failed to connect new Ethereum address')
    },
  })

  return (
    <Button
      className={cx('text-[#0062FF] !w-auto !h-6 !border-0 !bg-white', account.isPrimary && 'text-[#B5B5BE]')}
      disabled={!!account.isPrimary}
      loading={isLoading}
      onClick={() => !account.isPrimary && mutate({ id: account.id })}
      variant="outlined"
    >
      Disconnect
    </Button>
  )
}

export default DisconnectButton
