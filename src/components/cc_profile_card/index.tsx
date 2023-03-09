import Image from 'next/image'
import cl from 'classnames'

import { Button } from '@/components'

import st from './styles.module.css'

export type Profile = {
  handle: string
  avatar: string
  metadata: string
  profileID: number
  isSubscribedByMe: boolean
}

type CCProfileCardProps = Profile & {
  classNames?: string
}

export const CCProfileCard = ({ handle, avatar, isSubscribedByMe }: CCProfileCardProps) => {
  return (
    <div className="h-96 px-16 py-12 flex flex-col items-center gap-6">
      <div className="h-16 w-16 flex items-center justify-center bg-[#fff3ec] rounded-full overflow-hidden">
        {avatar?.startsWith('http') && (
          <Image
            alt="avatar"
            height={64}
            src={avatar}
            width={64}
          />
        )}
      </div>
      <p>@{handle}</p>
      <Button
        className={cl(['!w-32 !text-white !border-none', !isSubscribedByMe && st.button])}
        variant="outlined"
      >
        {isSubscribedByMe ? 'Followed' : 'Follow'}
      </Button>
    </div>
  )
}
