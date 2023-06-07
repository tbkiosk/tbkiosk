import { Meta, StoryObj } from '@storybook/react'
import { Card } from '@/components'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Card>
        <h1>Title</h1>
        <h2>Subtitle</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta illo magni maxime molestias nemo, neque obcaecati perspiciatis
          velit! Atque consectetur distinctio esse eum hic molestias numquam officia optio quidem totam.
        </p>
      </Card>
    </div>
  ),
}
