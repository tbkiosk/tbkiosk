import { forwardRef } from 'react'
import cl from 'classnames'

type TooltipProps = {
  children?: React.ReactNode
  tip?: string
  classNames?: string
  position?: 'top' | 'bottom'
}

const Tooltip = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<TooltipProps>
>(({ tip, children, classNames, position = 'top' }, ref) => (
  <div className={cl(['group relative', classNames])} ref={ref}>
    {tip && (
      <span
        className={cl([
          'px-4 py-2 text-sm text-center whitespace-nowrap text-gray-100 rounded-md absolute left-1/2 bg-gray-800 invisible z-[1100] opacity-0 transition-opacity',
          'group-hover:visible group-hover:opacity-90 -translate-x-1/2 -translate-y-[120%]',
          position === 'bottom' && 'translate-y-[150%]',
        ])}
      >
        {tip}
      </span>
    )}
    {children}
  </div>
))

Tooltip.displayName = 'Tooltip'

export default Tooltip
