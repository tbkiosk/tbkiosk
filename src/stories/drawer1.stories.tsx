import { Meta, StoryObj } from '@storybook/react'
import { Drawer } from '@/components/drawer'
import { useState } from 'react'

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: { onClose: { action: 'closed' } },
}

export default meta

type Story = StoryObj<typeof Drawer>

export const OpenDrawer: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <button onClick={() => setOpen(true)}>Open Drawer</button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          usePortal
        >
          Drawer children
        </Drawer>
      </>
    )
  },
}
