import { Meta, StoryObj } from '@storybook/react'
import { Filter } from '@/components'
import { useState } from 'react'

const meta: Meta<typeof Filter> = {
  title: 'Components/Filter',
  component: Filter,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Filter>

export const Default: Story = {
  render: () => {
    const [filters, setFilters] = useState([
      {
        label: 'Filter 1',
        value: 'filter-1',
        selected: false,
      },
      {
        label: 'Filter 2',
        value: 'filter-2',
        selected: false,
      },
      {
        label: 'Filter 3',
        value: 'filter-3',
        selected: true,
      },
    ])
    const onChange = (filterIndex: number) => {
      const newFilters = filters.map((filter, index) => {
        if (index === filterIndex) {
          return {
            ...filter,
            selected: !filter.selected,
          }
        }
        return filter
      })
      setFilters(newFilters)
    }

    return (
      <div style={{ width: '400px' }}>
        <Filter
          title="Example Filter"
          filters={filters}
          onChange={onChange}
        />
      </div>
    )
  },
}
