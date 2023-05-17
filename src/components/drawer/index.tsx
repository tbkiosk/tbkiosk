import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

export type DrawerProps = {
  children: React.ReactNode
  onClose: () => void
  open: boolean
  /** Use React portal to render Drawer component at document level, SSR won't work if it's set to true*/
  usePortal?: boolean
}

export const Drawer = ({ children, onClose, open, usePortal }: DrawerProps) => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const drawerClasses = classNames(
    'fixed inset-y-0 right-0 w-full md:max-w-lg lg:max-w-2xl transform transition-transform duration-200 ease-in-out z-50',
    {
      'translate-x-0': open,
      'translate-x-full': !open,
    }
  )

  const maskClasses = classNames('fixed inset-0 bg-black transition-opacity duration-200 ease-in-out', {
    'opacity-50': open,
    'opacity-0 pointer-events-none': !open,
  })

  const drawerContent = (
    <div>
      <div
        className={maskClasses}
        onClick={onClose}
      />
      <div className={drawerClasses}>
        <div className="h-full overflow-y-auto bg-white shadow-lg">{children}</div>
      </div>
    </div>
  )

  // Only render portal on the client side
  if (isBrowser && usePortal) {
    return createPortal(drawerContent, document.body)
  } else {
    return drawerContent
  }
}
