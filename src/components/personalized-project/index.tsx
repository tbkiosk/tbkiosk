import { Avatar, AvatarGroup, Drawer, Event, GovernanceVote, Spinner, Tag, TagColor } from '@/components'
import { useState } from 'react'
import { PersonalizedProjectType, ProjectType } from '@/types/project'
import useSWR from 'swr'
import { ResponseBase } from '@/types/response'
import request from '@/utils/request'
import { ProjectDetail as ProjectDetailType } from '@/types/project'

const EligibleMessage = () => {
  return (
    <div className="flex items-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="10"
          cy="14"
          r="7"
          fill="#82FFAC"
        />
        <path
          d="M6 13L9.21391 15.4104C9.65027 15.7377 10.2684 15.6549 10.6033 15.2244L17 7"
          stroke="#222222"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <p className="ml-2 text-lg text-[#9A9696]">You’re eligible for the event</p>
    </div>
  )
}

const IneligibleMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <circle
          cx="10"
          cy="14"
          r="7"
          fill="#FFA082"
        />
        <rect
          x="5"
          y="5"
          width="13"
          height="13"
          fill="url(#pattern0)"
        />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              xlinkHref="#image0_1144_6489"
              transform="scale(0.01)"
            />
          </pattern>
          <image
            id="image0_1144_6489"
            width="100"
            height="100"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACQklEQVR4nO3dwUrcUBiG4W9p0d5DhUK9kVKwXdVa1OX8nE3vqtKV9tKKXkGTEkggiLXJOFO/85/3hez/k8dMhkxMJCIiIiIiIiIiIiIiIlrTW0lnkk4lHSXeda8lfRzXOqzZrleSfkjqJPXjdifpQvm6knQ/W+dvSdeSDmTU9WzA+TYAFeWpPPijm2/fZdLxE0NmQikL1vlGBn15YsgsKOUfGNP2WQZ9WDBozShlIcawvZfJCf0uKUpZgfHL6cR+tmLwWlDKyjVZfFzN24xfAZcu4Jt8iyxryYASCdaQBiUqnj0dSlQ4c1qUqGjW9ChRwYzNoITxbM2hhOFMzaKE0SxqHSUMZrDqJVECDB+UAMMHJcDwQQkwfFACDB+UAMMHJcDwQQkwfFACDB+UAMPrJoMu2U0W1R8pPdem6kLpWrhQWAtKB4YPSgeGD0oHxn4LQOrF6DlK/DB6UPwwelD8MHpQnl/h0olPscWFQodbjFIWz9ixoBhhTIGyo2KHHzmgGGFMgbJl+/ylb8OJ3gdjCpSF/c/fwDccKT4YU6D8pZe8O2TDkeKDMQWKEcZU8yhOGGodxRGjWRRnjOZQasBoBqUmjPQoNWKkRakZIx1KBow0KF8T/n9GWbmmc5l09OBZ6BkwtkEZHpV7KIM+JcXYBmV4Y4LF2wKyYqxFuZRBJ8kx1qAM+8Kin8kxlqDcyOyNM7ePnORsvnnssPNHnnV/M+4Du96N55RTl28ce+pwXOPVuGYiIiIiIiIiIiIiIiLSsv4AKlKC3nWiOysAAAAASUVORK5CYII="
          />
        </defs>
      </svg>
      <p className="ml-2 text-lg text-[#9A9696]">{message}</p>
    </div>
  )
}

const ProjectDetail = ({ projectId }: { projectId: string }) => {
  const { data, isLoading, error } = useSWR<ResponseBase<ProjectDetailType>>(`project${projectId}`, () =>
    request({
      url: `/api/projects/${projectId}`,
      method: 'GET',
    })
  )

  if (error) {
    return <p className="text-2xl">Oops, something went wrong</p>
  }

  if (isLoading) {
    return <Spinner />
  }

  if (data?.data?.type === 'governance-vote') {
    return <GovernanceVote {...data.data} />
  }

  if (data?.data?.type === 'event') {
    return <Event {...data.data} />
  }

  return <div>WIP</div>
}

export const PersonalizedProject = ({ name, description, date, logos, type, id, isEligible }: PersonalizedProjectType) => {
  const [showDrawer, setShowDrawer] = useState(false)
  const eventConfig: Record<
    ProjectType,
    {
      tagColor: TagColor
      tagText: string
      buttonText: string
    }
  > = {
    'governance-vote': {
      tagColor: 'yellow',
      tagText: 'Governance vote',
      buttonText: 'View voting details',
    },
    event: {
      tagColor: 'purple',
      tagText: 'Event',
      buttonText: 'View event details',
    },
    claim: {
      tagColor: 'orange',
      tagText: 'Claim',
      buttonText: 'View claim details',
    },
    mint: {
      tagColor: 'violet',
      tagText: 'Mint',
      buttonText: 'View mint details',
    },
    news: {
      tagColor: 'orange',
      tagText: 'News',
      buttonText: 'View news details',
    },
    airdrop: {
      tagColor: 'purple',
      tagText: 'Airdrop',
      buttonText: 'View airdrop details',
    },
  }

  const singleLogo = logos.length === 1

  return (
    <div className="p-10 rounded-3xl shadow-[0px_4px_10px_rgba(222,222,222,0.44)]">
      <div className="flex items-center">
        {singleLogo && (
          <Avatar
            src={logos[0]}
            alt={name}
            size={'medium'}
            className="mr-4"
          />
        )}
        <p className="text-2xl font-bold mr-4">{name}</p>
        <Tag color={eventConfig[type].tagColor}>{eventConfig[type].tagText}</Tag>
        <p className="text-[#FF6746] text-lg ml-auto">{date}</p>
      </div>
      {!singleLogo && (
        <div className="mt-2">
          <AvatarGroup>
            {logos.map((url, index) => (
              <Avatar
                key={index}
                src={url}
                alt={name}
                size={'small'}
              />
            ))}
          </AvatarGroup>
        </div>
      )}
      <p className="text-xl mb-10 mt-6">{description}</p>
      <div className="flex items-center justify-between">
        {isEligible ? <EligibleMessage /> : <IneligibleMessage message="Fulfil 3 more requirements to claim" />}
        <button
          onClick={() => setShowDrawer(true)}
          className="py-3 px-12 border border-black rounded-3xl font-semibold"
        >
          {eventConfig[type].buttonText}
        </button>
      </div>
      <Drawer
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
      >
        {showDrawer && <ProjectDetail projectId={id} />}
      </Drawer>
    </div>
  )
}
