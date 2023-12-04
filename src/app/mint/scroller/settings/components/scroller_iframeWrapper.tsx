import useTbaScrollerUser from '@/hooks/useTbaScrollerUser'
import ScrollerIframe from './scroller_iframe'

const ScrollerIframeWrapper = ({ tokenId }: { tokenId: string }) => {
  const { tba, isLoading } = useTbaScrollerUser(+tokenId)

  return (
    <ScrollerIframe
      tokenId={tokenId}
      tba={tba}
      isLoading={isLoading}
    />
  )
}

export default ScrollerIframeWrapper
