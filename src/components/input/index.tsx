import { forwardRef } from 'react'
import cl from 'classnames'

type InputProps = {
  className?: string
  type?: React.HTMLInputTypeAttribute
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, disabled, type = 'text', ...restProps }, ref) => (
  <input
    autoComplete="off"
    className={cl([
      'block w-full px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-black rounded-md shadow-sm',
      disabled && 'cursor-not-allowed',
      className,
    ])}
    disabled={disabled}
    type={type}
    ref={ref}
    {...restProps}
  />
))

type TextAreaProps = {
  className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...restProps }, ref) => (
  <textarea
    autoComplete="off"
    className={cl([
      'block w-full px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-black rounded-md shadow-sm resize-none',
      className,
    ])}
    ref={ref}
    {...restProps}
  />
))

Input.displayName = 'Input'
TextArea.displayName = 'TextArea'
