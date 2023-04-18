import Image from 'next/image'
import cl from 'classnames'

import { Modal, Input, Button, Dropdown } from '@/components'

import request from '@/utils/request'

import type { ProjectData } from '@/schemas/project'
import type { WithObjectId } from '@/types/schema'

type AllowlistDialogProps = {
  open: boolean
  project: WithObjectId<ProjectData> | null
  setOpen: (open: boolean) => void
}

export const AllowlistApplicationDialog = ({ open, project, setOpen }: AllowlistDialogProps) => {
  return (
    <Modal
      isOpen={open}
      setOpen={setOpen}
    >
      {project && <div className="h-full w-full flex flex-col items-center justify-center"></div>}
    </Modal>
  )
}
