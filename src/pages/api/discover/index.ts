import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { PersonalizedProjectType } from '@/types/project'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<PersonalizedProjectType[]>>) => {
  if (req.method === 'GET') {
    return res.status(405).json({
      data: [
        {
          id: '1',
          name: 'Nounsdao',
          description: 'Discussion: Let’s introduce new mechanics to the Nouns universe ',
          type: 'governance-vote',
          date: '6 hours left to vote',
          logos: ['https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025'],
          isEligible: true,
        },
        {
          id: '2',
          name: 'WeAreSG',
          description:
            'Singapore Meetup at on May 15th, before future proof. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum lacus diam, vitae congue ante.',
          type: 'event',
          date: 'Starts in 5 days',
          logos: ['https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025'],
          isEligible: false,
        },
        {
          id: '3',
          name: 'Co-working space for all at Token2049',
          description: 'All NFT holders are invited to this co-working space this Token2049!',
          type: 'event',
          date: 'Starting 4 Sept',
          logos: [
            'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025',
            'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025',
            'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025',
          ],
          isEligible: true,
        },
      ],
    })
  }

  return res.status(405).json({
    message: 'Method Not Allowed',
  })
}

export default handler
