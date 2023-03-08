import { ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type ReactPortalProps = {
  children: ReactNode
  wrapperId?: string
}

const Portal = ({ children, wrapperId = 'portal' }: ReactPortalProps) => {
  const [wrapper, setWrapper] = useState<Element | null>(null)

  useEffect(() => {
    let element = document.getElementById(wrapperId)
    let created = false
    if (!element) {
      const wrapper = document.createElement('div')
      wrapper.setAttribute('id', wrapperId)
      document.body.appendChild(wrapper)
      element = wrapper
      created = true
    }

    setWrapper(element)

    return () => {
      if (created && element?.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }, [wrapperId])

  if (wrapper === null) return null

  return createPortal(children, wrapper)
}

export default Portal
