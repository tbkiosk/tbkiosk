import { useRouter } from 'next/router'
import useSWR from 'swr'
import { formatAddress } from '@mysten/sui.js'

import { Modal, Button } from '@/components'

import request from '@/utils/request'

import { ApplicantStatus } from '@/schemas/allowlist'

import type { Applicant } from '@/schemas/allowlist'
import type { ResponseBase } from '@/types/response'

type AllowlistApplicationDialogProps = {
  open: boolean
  setOpen: (nextOpen: boolean) => void
}

export const AllowlistApplicationDialog = ({ open, setOpen }: AllowlistApplicationDialogProps) => {
  const router = useRouter()

  const { data: { data: applicants } = {} } = useSWR<ResponseBase<Applicant[]>>(
    router.query.projectId && open ? `/api/project/${router.query.projectId}/allowlist/${router.query.allowlist}/applicants` : null
  )

  return (
    <Modal
      isOpen={open}
      setOpen={setOpen}
    >
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="w-[28rem] max-w-[28rem] flex flex-col p-8 bg-white rounded">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-xl">Allowlist Applications</span>
            <span
              className="transition-opacity cursor-pointer hover:opacity-50"
              onClick={() => setOpen(false)}
            >
              Close
            </span>
          </div>
          <p className="mb-6">Total: {applicants?.length ?? 0} application(s)</p>
          <p className="text-center">
            <Button
              className="!h-9 !w-auto !px-8 mr-4"
              variant="contained"
            >
              Approval all
            </Button>
            <Button
              className="!h-9 !w-auto !px-8"
              variant="outlined"
            >
              Reject all
            </Button>
          </p>
          <hr className="-mx-8 my-8" />
          <div className="flex flex-col gap-4">
            {applicants?.map(_applicant => (
              <ApplicantCard
                applicant={_applicant}
                key={_applicant.address}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

const ApplicantCard = ({ applicant }: { applicant: Applicant }) => {
  const onApprove = async () => {}

  const onReject = async () => {}

  return (
    <div className="flex items-center">
      <div className="flex flex-1 items-center gap-2">
        <img className="inline w-[2.25rem] h-[2.25rem] bg-gray-300 rounded-full" />
        <span className="max-w-[10rem] truncate">{formatAddress(applicant.address)}</span>
      </div>
      {applicant.status === ApplicantStatus.PENDING ? (
        <div>
          <i className="fa-solid fa-check mr-4 cursor-pointer transition-opacity hover:opacity-50" />
          <i className="fa-solid fa-xmark cursor-pointer transition-opacity hover:opacity-50" />
        </div>
      ) : (
        <div>
          {applicant.status === ApplicantStatus.APPROVED && <span className="text-green-300">Approved</span>}
          {applicant.status === ApplicantStatus.REJECTED && <span className="text-red-300">Rejected</span>}
        </div>
      )}
    </div>
  )
}
