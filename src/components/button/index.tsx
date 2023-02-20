import cl from 'classnames'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'contained' | 'outlined'
  loading?: boolean
  startIcon?: React.ReactNode
}

const VARIANT_STYLES = {
  contained: 'bg-black text-white hover:bg-[#2a2a2d] active:bg-[#4a4a4a]',
  outlined:
    'bg-white text-black border border-black hover:bg-[#e3e3e4] active:bg-[#d1d1d1]',
}

const VARIANT_DISABLED_STYLES = {
  contained: 'disabled:bg-[#c4c4c4]',
  outlined:
    'disabled:text-[#c4c4c4] disabled:border-[#c4c4c4] disabled:bg-white disabled:hover:bg-white',
}

const Button = ({
  children,
  className,
  variant = 'contained',
  disabled,
  loading,
  startIcon,
  ...rest
}: ButtonProps) => (
  <button
    className={cl([
      'w-full h-[54px] rounded-[28px] px-4 relative font-medium text-sm truncate transition duration-100 ease-linear disabled:cursor-not-allowed',
      VARIANT_STYLES[variant],
      disabled && VARIANT_DISABLED_STYLES[variant],
      startIcon && 'relative',
      className,
    ])}
    disabled={disabled || loading}
    {...rest}
  >
    {startIcon && (
      <div className="absolute inset-y-0 flex flex-col justify-center">
        {startIcon}
      </div>
    )}
    {loading ? <i className="fa-solid fa-spin fa-circle-notch" /> : children}
  </button>
)

export default Button
