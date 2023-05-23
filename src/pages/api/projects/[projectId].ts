import { NextApiRequest, NextApiResponse } from 'next'
import { EventProject, GovernanceVoteProject, ProjectDetail } from '@/types/project'
import { ResponseError } from '@/types/response'

/**mock data, to be replaced*/
const project1: GovernanceVoteProject = {
  id: '1',
  name: 'NounsDAO voting',
  description: 'Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  type: 'governance-vote',
  date: '6 hours left to vote',
  logos: ['https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025'],
  link: 'https://example.com',
  voteAgainstPercentage: 5,
  voteForPercentage: 70,
}

const project2: EventProject = {
  id: '2',
  name: 'WeAreSG',
  description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  type: 'event',
  date: 'Happening on 15 May 2023 • 8pm till late (SGT)',
  logos: ['https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025'],
  link: 'https://example.com',
  eligibilities: ['Have at least 1 WeAreSG NFT in wallet', 'Following wearesg on Instagram', 'In wearesg on Discord'],
}

const project3: EventProject = {
  id: '3',
  name: 'WeAreSG',
  description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  type: 'event',
  date: 'Happening on 15 May 2023 • 8pm till late (SGT)',
  logos: [
    'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025',
    'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025',
    'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025',
  ],
  link: 'https://example.com',
  eligibilities: ['Have at least 1 WeAreSG NFT in wallet', 'Following wearesg on Instagram', 'In wearesg on Discord'],
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseError | ProjectDetail>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { projectId } = req.query
  if (projectId === '1') return res.status(200).json(project1)
  if (projectId === '2') return res.status(200).json(project2)
  if (projectId === '3') return res.status(200).json(project3)

  return res.status(404).json({ message: 'Not Found' })
}
