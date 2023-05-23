import { Meta, StoryObj } from '@storybook/react'
import { CheckBox } from '@/components'
import { useState } from 'react'

const meta: Meta<typeof CheckBox> = {
  title: 'Components/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof CheckBox>

export const UnChecked: Story = {
  args: {
    label: 'Check Box',
    selected: false,
  },
}

export const Checked: Story = {
  args: {
    label: 'Check Box',
    selected: true,
  },
}

export const Toggle: Story = {
  render: () => {
    const [selected, setSelected] = useState(false)
    return (
      <CheckBox
        label="Check Box"
        selected={selected}
        onChange={() => setSelected(!selected)}
      />
    )
  },
}
