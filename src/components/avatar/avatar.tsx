import Image from 'next/image'
import cx from 'classix'

export type AvatarProps = {
  src: string
  alt: string
  size: 'small' | 'medium' | 'large'
  className?: string
}

export const Avatar = ({ src, alt, size, className }: AvatarProps) => {
  const avatarClass = cx(
    size === 'small' && 'w-10 h-10',
    size === 'medium' && 'w-12 h-12',
    size === 'large' && 'w-16 h-16',
    'rounded-full object-cover',
    className
  )

  return (
    <Image
      alt={alt}
      className={avatarClass}
      height={64}
      src={src}
      width={64}
    />
  )
}
