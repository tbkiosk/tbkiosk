import classNames from "classnames";

export type AvatarProps = {
  src: string;
  alt: string;
  size: 'small' | 'medium' | 'large';
  className?: string;
}

export const Avatar = ({ src, alt, size, className }: AvatarProps) => {
  const avatarClass = classNames({
    'w-10 h-10': size === 'small',
    'w-12 h-12': size === 'medium',
    'w-16 h-16': size === 'large',
  }, `rounded-full object-cover ${className ?? ''}`);

  return (
    <img className={ avatarClass } src={ src } alt={ alt }/>
  );
}
