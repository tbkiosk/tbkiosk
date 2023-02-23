import { useEffect } from 'react'

const defaultOptions = {
  root: null,
  rootMargin: '0px',
}

type UseInViewportOptions = {
  queryTarget: () => Element | HTMLElement | null // call query target after mounted, otherwise document is not defined
  callback: (entries: IntersectionObserverEntry[]) => unknown
  options?: IntersectionObserverInit
}

const useInViewport = ({
  queryTarget,
  callback,
  options = defaultOptions,
}: UseInViewportOptions) => {
  useEffect(() => {
    const target = queryTarget()
    if (!target) return

    const observer = new IntersectionObserver(callback, options)

    observer.observe(target)
  }, [])
}

export default useInViewport
