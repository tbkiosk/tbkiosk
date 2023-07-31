import { useEffect } from 'react'

export const useDebouncedEffect = (effect: () => unknown, deps: unknown[], delay = 500) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay)

    return () => clearTimeout(handler)
  }, [...(deps || []), delay])
}
