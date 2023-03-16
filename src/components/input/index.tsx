import cl from 'classnames'

type InputProps = {
  classNames?: string
} & React.HTMLAttributes<HTMLInputElement>

const Input = ({ classNames, ...restProps }: InputProps) => {
  return (
    <input
      autoComplete="off"
      className={cl([
        'block w-full rounded-md border-0 px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm',
        'outline-0 ring-1 ring-inset ring-black focus:ring-1 focus:ring-inset focus:ring-indigo-600',
        classNames,
      ])}
      type="text"
      {...restProps}
    />
  )
}

export default Input
