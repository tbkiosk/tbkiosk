import { Avatar, Button, GradientText, ProgressBar } from '@/components'
import { GovernanceVoteProject } from '@/types/project'

export const GovernanceVote = ({
  link,
  description,
  date,
  voteForPercentage,
  name,
  voteAgainstPercentage,
  logos,
}: GovernanceVoteProject) => {
  const openLinkInNewTab = () => {
    window.open(link, '_blank')
  }

  return (
    <div>
      <div className="border-b border-[#D9D9D9] pt-10 px-16 pb-7">
        <div className="mb-2 flex items-center">
          <Avatar
            src={logos[0]}
            alt={name}
            size={'medium'}
            className="mr-4"
          />
          <p className="text-4xl">{name}</p>
        </div>
        <GradientText>{date}</GradientText>
        <div className="mt-14">
          <ProgressBar
            progresses={[
              {
                value: voteForPercentage,
                color: '#5AFE57',
              },
              {
                value: voteAgainstPercentage,
                color: '#FE6157',
              },
            ]}
          />
        </div>
        <p className="mt-2 text-lg font-medium">{voteForPercentage}% support</p>
      </div>
      <div className="pt-5 px-16 text-center">
        <p className="pb-12 text-left">{description}</p>
        <Button
          className="text-xl w-[20rem]"
          onClick={openLinkInNewTab}
        >
          Vote on snapshot
        </Button>
      </div>
    </div>
  )
}
