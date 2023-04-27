import { formatAddress } from '@mysten/sui.js'

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
        <ul className="list-disc">
          {criteria[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS].map((_tokenAndAddress, i) => (
            <li key={i}>{`Hold at least ${_tokenAndAddress.number} NFT/token(s) from ${formatAddress(
              _tokenAndAddress.contractAddress
            )}`}</li>
          ))}
          {criteria[CriteriaKeys.PROJECT_DISCORD_JOINED] && <li>Join Discord server</li>}
          {criteria[CriteriaKeys.PROJECT_TWITTER_FOLLOWED] && <li>Follow @{projectName} Twitter</li>}
        </ul>
      )}
    </div>
  )
}
