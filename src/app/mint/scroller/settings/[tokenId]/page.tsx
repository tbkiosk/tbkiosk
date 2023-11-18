import Link from 'next/link'

import TBAContainer from './components/tba_container'

import ChevronRight from 'public/icons/chevron-right.svg'

import type { Metadata } from 'next'

const ScrollerSettingsByTokenId = ({ params }: { params: { tokenId: string } }) => {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-2 pt-16 text-white">
      <div className="flex">
        <Link
          className="flex items-center gap-2"
          href="/mint/scroller/settings"
        >
          <span className="h-3 w-3 rotate-180">
            <ChevronRight />
          </span>
          Back
        </Link>
      </div>
      <TBAContainer tokenId={params.tokenId} />
    </main>
  )
}

export const generateMetadata = async ({ params }: { params: { tokenId: string } }): Promise<Metadata> => ({
  title: `Kiosk - Scroller Pass Settings #${params.tokenId}`,
})

export default ScrollerSettingsByTokenId
