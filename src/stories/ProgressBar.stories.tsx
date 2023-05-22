import {
  Meta,
  StoryObj
} from "@storybook/react";
import { ProgressBar } from "@/components";

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ProgressBar>

export const Single: Story = {
  args: {
    progresses: [
      {
        color: '#5AFE57',
        value: 85,
      },
    ]
  },
};

export const Multi: Story = {
  args: {
    progresses: [
      {
        color: '#5AFE57',
        value: 60,
      },
      {
        color: '#FE6157',
        value: 30,
      }
    ]
  },
};
