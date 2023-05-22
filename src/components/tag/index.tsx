import cl from 'classnames'

export type TagProps = {
  children: string
  color?: 'yellow' | 'purple'
}


export const Tag = ({ children, color }: TagProps) => {

  return <div className={
    cl(['py-1 px-6 inline-block text-sm text-center rounded-3xl',
      color === 'yellow' && 'text-yellow-500 bg-yellow-100',
      color === 'purple' && 'text-purple-500 bg-purple-100'
    ]) }>
    { children }
  </div>
}
