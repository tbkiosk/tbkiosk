import { forwardRef } from 'react'
import cl from 'classnames'

type SelectProps = {
  className?: string
  options: OptionProps[]
} & React.SelectHTMLAttributes<HTMLSelectElement>

type OptionProps = {
  key: string
  text: string
  classname?: string
} & React.OptionHTMLAttributes<HTMLOptionElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, options, ...restProps }, ref) => (
  <select
    className={cl([
      'block w-full px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-black rounded-md shadow-sm',
      className,
    ])}
    ref={ref}
    {...restProps}
  >
    {options.map(({ key, text, className, ...restOptionProps }) => (
      <option
        className={cl([className])}
        key={key}
        {...restOptionProps}
      >
        {text}
      </option>
    ))}
  </select>
))

Select.displayName = 'Select'
