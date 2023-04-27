import { CriteriaKeys, type Criteria } from '@/schemas/allowlist'

type CriteriaListProps = {
  criteria: Criteria
  projectName?: string
}

export const CriteriaList = ({ criteria, projectName = '' }: CriteriaListProps) => {
  if (
    !criteria[CriteriaKeys.PROJECT_DISCORD_JOINED] &&
    !criteria[CriteriaKeys.PROJECT_TWITTER_FOLLOWED] &&
    !criteria[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]?.length
  ) {
    return <div className="text-gray-300">No criteria</div>
  }

  return (
    <div>
      {!!criteria[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]?.length && (
        <div>
          {criteria[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS].map((_tokenAndAddress, i) => (
            <p key={i}>{`Hold at least ${_tokenAndAddress.number} NFT/token(s) from ${_tokenAndAddress.contractAddress}`}</p>
          ))}
        </div>
      )}
      {criteria[CriteriaKeys.PROJECT_DISCORD_JOINED] && <p>Join Discord server</p>}
      {criteria[CriteriaKeys.PROJECT_TWITTER_FOLLOWED] && <p>Follow @{projectName} Twitter</p>}
    </div>
  )
}
