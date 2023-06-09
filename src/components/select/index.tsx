import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import cx from 'classix'

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
  showArrow?: boolean
}

// export const Select = forwardRef<HTMLSelectElement, SelectProps>()

export const Select = ({ options, value, onChange, className, buttonClassName, showArrow }: SelectProps) => {
  return (
    <Listbox
      value={options.find(_option => _option.id === value)}
      onChange={onChange}
    >
      {({ open }) => (
        <div className={cx('relative w-full', className)}>
          <Listbox.Button
            className={cx(
              'block w-full px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-black rounded-md truncate shadow-sm',
              'transition-colors hover:bg-neutral-100',
              buttonClassName,
              showArrow && 'relative pr-8'
            )}
          >
            {value}
            {showArrow && (
              <span className={cx('absolute inset-y-0 right-4 flex flex-col justify-center transition-transform', open && 'rotate-180')}>
                <i className="fa-solid fa-chevron-up" />
              </span>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className={cx('absolute max-h-60 w-full mt-1 py-1 overflow-auto bg-white rounded-md shadow-lg')}>
              {options.map(_option => (
                <Listbox.Option
                  className={({ active }) =>
                    cx('relative cursor-pointer select-none py-2 px-2 text-sm', active ? 'bg-neutral-200 text-amber-900' : 'text-gray-900')
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
      )}
    </Listbox>
  )
}

Select.displayName = 'Select'
