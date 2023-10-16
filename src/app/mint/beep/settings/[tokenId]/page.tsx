import TBAContainer from './components/tba_container'

import type { Metadata } from 'next'

const BeepSettingsByTokenId = ({ params }: { params: { tokenId: string } }) => {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-2 pt-16 text-white">
      <TBAContainer tokenId={params.tokenId} />
    </main>
  )
}

export const generateMetadata = async ({ params }: { params: { tokenId: string } }): Promise<Metadata> => ({
  title: `Kiosk - Beep Settings #${params.tokenId}`,
})

export default BeepSettingsByTokenId
