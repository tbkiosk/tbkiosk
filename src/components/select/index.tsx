import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import cl from 'classnames'

export type Option = {
  id: string
  name: string
  disabled?: boolean
}

type SelectProps = {
  value: string | undefined
  onChange: (option: Option) => void
  options: Option[]
  className?: string
  buttonClassName?: string
}

// export const Select = forwardRef<HTMLSelectElement, SelectProps>()

export const Select = ({ options, value, onChange, className, buttonClassName }: SelectProps) => {
  return (
    <Listbox
      value={options.find(_option => _option.id === value)}
      onChange={onChange}
    >
      <div className={cl(['relative w-full', className])}>
        <Listbox.Button
          className={cl([
            'block w-full px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-black rounded-md truncate shadow-sm',
            'transition-colors hover:bg-neutral-100',
            buttonClassName,
          ])}
        >
          {value}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className={cl(['absolute max-h-60 w-full mt-1 py-1 overflow-auto bg-white rounded-md shadow-lg'])}>
            {options.map(_option => (
              <Listbox.Option
                className={({ active }) =>
                  cl(['relative cursor-default select-none py-2 px-2 text-sm', active ? 'bg-neutral-200 text-amber-900' : 'text-gray-900'])
                }
                key={_option.id}
                value={_option}
                disabled={_option.disabled ?? false}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{_option.name}</span>
                    {selected ? <span className="absolute px-2 inset-y-0 left-0 flex items-center text-amber-600"></span> : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

Select.displayName = 'Select'
