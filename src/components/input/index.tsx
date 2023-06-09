import { forwardRef } from 'react'
import cx from 'classix'

type InputProps = {
  className?: string
  isError?: boolean
  type?: React.HTMLInputTypeAttribute
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, isError, disabled, type = 'text', ...restProps }, ref) => (
  <input
    autoComplete="off"
    className={cx(
      'block w-full px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-black rounded-md shadow-sm',
      isError && 'border border-red-600 outline-red-600 ring-red-600',
      disabled && 'cursor-not-allowed',
      className
    )}
    disabled={disabled}
    type={type}
    ref={ref}
    {...restProps}
  />
))

type TextAreaProps = {
  className?: string
  isError?: boolean
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, isError, ...restProps }, ref) => (
  <textarea
    autoComplete="off"
    className={cx(
      'block w-full px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-black rounded-md shadow-sm resize-none',
      isError && 'border border-red-600 outline-red-600 ring-red-600',
      className
    )}
    ref={ref}
    {...restProps}
  />
))

Input.displayName = 'Input'
TextArea.displayName = 'TextArea'
