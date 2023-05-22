import {
  Meta,
  StoryObj
} from "@storybook/react";
import {
  Tag
} from "@/components";

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Tag>

export const Purple: Story = {
  args: {
    children: 'Event',
    color: 'purple',
  },
};

export const Yellow: Story = {
  args: {
    children: 'Governance vote',
    color: 'yellow',
  },
};
