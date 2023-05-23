export type ProjectType = 'governance-vote' | 'event' | 'claim' | 'airdrop' | 'mint' | 'news'

export type PersonalizedProjectType = {
  name: string
  description: string
  type: ProjectType
  date: string
  isEligible: boolean
  id: string
  logos: string[]
}

export type ProjectDetailBase = {
  id: string
  name: string
  description: string
  date: string
  logos: string[]
  link: string
}

export type EventProject = ProjectDetailBase & {
  eligibilities: string[]
  type: 'event'
}

export type GovernanceVoteProject = ProjectDetailBase & {
  voteForPercentage: number
  voteAgainstPercentage: number
  type: 'governance-vote'
}

export type ProjectDetail = EventProject | GovernanceVoteProject
