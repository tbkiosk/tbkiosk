import Image from 'next/image'

const MOCK_TWITTER_USERS = [
  {
    id: '0',
    displayName: 'Gary Lenterman (Free,Own)',
    userName: 'garylenterman',
    avatar:
      'https://pbs.twimg.com/profile_images/1623643466852073472/bSE_78_2_reasonably_small.jpg',
  },
  {
    id: '1',
    displayName: 'Ethereum Foundation',
    userName: 'ethereum',
    avatar:
      'https://pbs.twimg.com/profile_images/1627642622645878784/TP1GH9TM_x96.jpg',
  },
]

const TWITTER_LINK_BASE_URL = 'https://twitter.com/'

const Connections = () => {
  return (
    <div className="flex flex-col px-[30px] py-[36px] shadow-[0_4px_10px_rgba(216,216,216,0.25)]">
      <p className="mb-4 font-bold text-3xl">My connections</p>
      <div className="flex flex-col gap-9">
        {MOCK_TWITTER_USERS.map((user) => (
          <div
            className="flex items-center gap-6 overflow-hidden"
            key={user.id}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={user.displayName}
              className="rounded-full"
              height={68}
              src={user.avatar}
              width={68}
            />
            <span className="truncate">{user.displayName}</span>
            <a
              className='shrink-0'
              href={`${TWITTER_LINK_BASE_URL}${user.userName}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt="twitter"
                height={36}
                src="/icons/twitter-circle.svg"
                width={36}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Connections
