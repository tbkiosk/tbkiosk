import { signIn } from 'next-auth/react'

import { Button, Loading } from '@/components'

import type { Account } from '@prisma/client'

type TwitterButtonProps = {
  twitterAccount: Account | undefined
}

export const TwitterButton = ({ twitterAccount }: TwitterButtonProps) => {
  if (!twitterAccount) {
    return (
      <Button
        className="!h-8 !w-auto"
        onClick={() => signIn('twitter', { callbackUrl: '/settings' })}
        variant="outlined"
      >
        Link Twitter
      </Button>
    )
  }

  return (
    <div>
      <Loading isLoading={true}>
        <>@</>
      </Loading>
    </div>
  )
}
