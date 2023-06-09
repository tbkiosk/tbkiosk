import { useEffect } from 'react'
import { Transition } from '@headlessui/react'
import cx from 'classix'

import Portal from '../portal'

type ModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
  classNames?: string
}

export const Modal = ({ open, setOpen, children, classNames }: ModalProps) => {
  useEffect(() => {
    if (!open) return

    const onEscPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', e => onEscPress(e))

    return () => window.removeEventListener('keydown', e => onEscPress(e))
  }, [open])

  if (!open) return null

  return (
    <Portal>
      <Transition
        appear
        as="div"
        show={open}
        className={cx('fixed inset-0 bg-black/50 z-[1200]', classNames)}
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
