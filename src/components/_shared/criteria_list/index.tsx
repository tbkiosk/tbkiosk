import { CriteriaKeys, type Criteria } from '@/schemas/allowlist'

type CriteriaListProps = {
  criteria: Criteria
  projectName: string
}

export const CriteriaList = ({ criteria }: CriteriaListProps) => {
  return <div>{criteria[CriteriaKeys.PROJECT_DISCORD_JOINED] && <p>Join Discord server</p>}</div>
}
