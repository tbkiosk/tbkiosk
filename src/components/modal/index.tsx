import { useEffect } from 'react'
import cl from 'classnames'

import Portal from '../portal'

type ModalProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
  classNames?: string
}

export const Modal = ({ isOpen, setOpen, children, classNames }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return

    const onEscPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', e => onEscPress(e))

    return () => window.removeEventListener('keydown', e => onEscPress(e))
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Portal>
      <div className={cl(['fixed inset-0 bg-black/50 z-[1200]', classNames])}>{children}</div>
    </Portal>
  )
}
