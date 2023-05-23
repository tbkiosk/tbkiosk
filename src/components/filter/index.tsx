import { useState } from 'react'
import classNames from 'classnames'
import { CheckBox } from '@/components'

type Filter = {
  label: string
  selected: boolean
}

type FilterProps = {
  title: string
  filters: Filter[]
  isExpanded?: boolean
  onChange: (filterIndex: number) => void
}

export const Filter = ({ title, isExpanded = true, filters, onChange }: FilterProps) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(isExpanded)

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsFilterExpanded(value => !value)}
      >
        <p className="font-bold text-base text-black-100">{title}</p>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classNames('transition-transform', {
            'rotate-180': isFilterExpanded,
          })}
        >
          <path
            d="M16 13L12 9L8 13"
            stroke="#222325"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {isFilterExpanded && (
        <div className="mt-4 grid gap-4">
          {filters.map((filter, index) => (
            <CheckBox
              label={filter.label}
              selected={filter.selected}
              onChange={() => onChange(index)}
              key={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
