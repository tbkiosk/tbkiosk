import cx from 'classix'

export type TagColor = 'yellow' | 'purple' | 'orange' | 'violet'

export type TagProps = {
  children: string
  color: TagColor
}

export const Tag = ({ children, color }: TagProps) => {
  return (
    <div
      className={cx(
        'py-1 px-6 inline-block text-sm text-center rounded-3xl',
        color === 'yellow' && 'text-yellow-500 bg-yellow-100',
        color === 'purple' && 'text-purple-500 bg-purple-100',
        color === 'orange' && 'text-orange-500 bg-orange-100',
        color === 'violet' && 'text-violet-500 bg-violet-100'
      )}
    >
      {children}
    </div>
  )
}
