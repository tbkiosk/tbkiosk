import { forwardRef } from 'react'
import cx from 'classix'

type TooltipProps = {
  children?: React.ReactNode
  tip?: string
  classNames?: string
  position?: 'top' | 'bottom'
}

export const Tooltip = forwardRef<HTMLDivElement, React.PropsWithChildren<TooltipProps>>(
  ({ tip, children, classNames, position = 'top' }, ref) => (
    <div
      className={cx('group relative', classNames)}
      ref={ref}
    >
      {tip && (
        <span
          className={cx(
            'px-4 py-2 text-sm text-center whitespace-nowrap text-gray-100 rounded-md absolute left-1/2 -top-[120%] bg-gray-800 invisible z-[1100] opacity-0 transition-opacity',
            'group-hover:visible group-hover:opacity-90 -translate-x-1/2',
            position === 'bottom' && '!top-[120%]'
          )}
        >
          {tip}
        </span>
      )}
      {children}
    </div>
  )
)

Tooltip.displayName = 'Tooltip'
