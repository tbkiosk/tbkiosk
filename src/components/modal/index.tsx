import { useEffect } from 'react'
import cl from 'classnames'
import { Transition } from '@headlessui/react'

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
      <Transition
        appear
        as="div"
        show={isOpen}
        className={cl(['fixed inset-0 bg-black/50 z-[1200]', classNames])}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {children}
      </Transition>
    </Portal>
  )
}
