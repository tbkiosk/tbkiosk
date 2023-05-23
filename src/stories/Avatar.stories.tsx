import { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarGroup } from '@/components'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Small: Story = {
  args: {
    size: 'small',
    src: 'https://bit.ly/dan-abramov',
    alt: 'Dan Abramov',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    src: 'https://bit.ly/ryan-florence',
    alt: 'Ryan Florence',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    src: 'https://bit.ly/code-beast',
    alt: 'Code Beast',
  },
}

export const Group: Story = {
  render: () => {
    return (
      <AvatarGroup>
        <Avatar
          size="medium"
          src="https://bit.ly/dan-abramov"
          alt="Dan Abramov"
        />
        <Avatar
          size="medium"
          src="https://bit.ly/ryan-florence"
          alt="Ryan Florence"
        />
        <Avatar
          size="medium"
          src="https://bit.ly/code-beast"
          alt="Code Beast"
        />
      </AvatarGroup>
    )
  },
}
