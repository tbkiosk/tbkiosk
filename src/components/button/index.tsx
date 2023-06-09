import cx from 'classix'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'contained' | 'outlined' | 'colored'
  loading?: boolean
  startIcon?: React.ReactNode
}

const VARIANT_STYLES = {
  contained:
    'bg-[var(--primary-color)] text-[var(--primary-text-color)] hover:bg-[var(--primary-color--hover)] active:bg-[var(--primary-color--active)]',
  outlined:
    'bg-[var(--secondary-color)] text-[var(--secondary-text-color)] border border-[var(--secondary-border-color)] hover:bg-[var(--secondary-color--hover)] active:bg-[var(--secondary-color--active)]',
  colored: 'text-white button--colored',
}

const VARIANT_DISABLED_STYLES = {
  contained: 'disabled:bg-[var(--primary-color--disabled)] disabled:text-[var(--primary-text-color--disabled)]',
  outlined:
    'disabled:bg-[var(--secondary-color--disabled)] disabled:text-[var(--secondary-text-color--disabled)] disabled:border-[var(--secondary-border-color--disabled)]',
  colored: 'disabled:grayscale-[50%] disabled:hover:animate-none',
}

export const Button = ({ children, className, variant = 'contained', disabled, loading, startIcon, ...rest }: ButtonProps) => (
  <button
    className={cx(
      'w-full h-14 rounded-[1.75rem] px-4 relative font-medium text-sm truncate transition duration-100 ease-linear disabled:cursor-not-allowed',
      VARIANT_STYLES[variant],
      disabled && VARIANT_DISABLED_STYLES[variant],
      !!startIcon && 'relative',
      className
    )}
    disabled={disabled || loading}
    {...rest}
  >
    {startIcon && <div className="absolute inset-y-0 flex flex-rol items-center">{startIcon}</div>}
    {loading ? <i className="fa-solid fa-spin fa-circle-notch" /> : children}
  </button>
)
