import { Modal } from '@/components/modal'

import type { ProjectData } from '@/schemas/project'
import type { AllowlistForm } from '@/schemas/allowlist'
import type { WithObjectId } from '@/types/schema'
import type { ResponseBase } from '@/types/response'

type AllowlistApplicationDialogProps = {
  open: boolean
  setOpen: (nextOpen: boolean) => void
  onClose?: () => void
  onRefresh?: () => void
  project: WithObjectId<ProjectData> | null
}

export const AllowlistApplicationDialog = ({ open, setOpen }: AllowlistApplicationDialogProps) => {
  return (
    <Modal
      isOpen={open}
      setOpen={setOpen}
    >
      <div className="h-full w-full flex flex-col items-center justify-center"></div>
    </Modal>
  )
}
