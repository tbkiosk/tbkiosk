import { useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { formatAddress } from '@mysten/sui.js'

import { Modal, Button } from '@/components'

import request from '@/utils/request'

import { ApplicantStatus, type Applicant } from '@/schemas/applicant'

import type { ResponseBase } from '@/types/response'

type AllowlistApplicationDialogProps = {
  open: boolean
  setOpen: (nextOpen: boolean) => void
}

export const AllowlistApplicationDialog = ({ open, setOpen }: AllowlistApplicationDialogProps) => {
  const router = useRouter()

  const { data: { data: applicants } = {} } = useSWR<ResponseBase<Applicant[]>>(
    router.query.projectId && router.query.allowlistId && open
      ? `/api/project/${router.query.projectId}/allowlist/${router.query.allowlistId}/applicant`
      : null
  )

  const [isLoading, setIsLoading] = useState(false)

  if (typeof router.query.projectId !== 'string' || typeof router.query.allowlistId !== 'string') {
    return null
  }

  const projectId = router.query.projectId as string
  const allowlistId = router.query.allowlistId as string

  const onApproveAll = async () => {
    setIsLoading(true)

    // const res = await request(`/api/project/${projectId}/allowlist/${allowlistId}/applicants`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ operation: ApplicationOperations.APPROVE_ALL }),
    // })

    setIsLoading(false)
  }

  const onRejectAll = async () => {
    setIsLoading(true)

    // const res = await request(`/api/project/${projectId}/allowlist/${allowlistId}/applicants`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ operation: ApplicationOperations.REJECT_ALL }),
    // })

    setIsLoading(false)
  }

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
          <p className="mb-6">Total: {0} application(s)</p>
          <p className="text-center">
            <Button
              className="!h-9 !w-[8.75rem] mr-4"
              onClick={() => onApproveAll()}
              variant="contained"
            >
              Approval all
            </Button>
            <Button
              className="!h-9 !w-[8.75rem]"
              onClick={() => onRejectAll()}
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
                projectId={router.query.projectId as string}
                allowlistId={router.query.allowlistId as string}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

type ApplicantCardProps = {
  applicant: Applicant
  projectId: string
  allowlistId: string
}

const ApplicantCard = ({ applicant, projectId, allowlistId }: ApplicantCardProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const onApprove = async () => {
    setIsLoading(true)

    // const res = await request(`/api/project/${projectId}/allowlist/${allowlistId}/applicants`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ address: applicant.address, operation: ApplicationOperations.APPROVE }),
    // })

    setIsLoading(false)
  }

  const onReject = async () => {
    setIsLoading(true)

    // const res = await request(`/api/project/${projectId}/allowlist/${allowlistId}/applicants`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ address: applicant.address, operation: ApplicationOperations.REJECT }),
    // })

    setIsLoading(false)
  }

  return (
    <div className="flex items-center">
      <div className="flex flex-1 items-center gap-2">
        <img className="inline w-[2.25rem] h-[2.25rem] bg-gray-300 rounded-full" />
        <span className="max-w-[10rem] truncate">{formatAddress(applicant.address)}</span>
      </div>
      {applicant.status === ApplicantStatus.PENDING ? (
        <div>
          <i
            className="fa-solid fa-check mr-4 cursor-pointer transition-opacity hover:opacity-50"
            onClick={() => onApprove()}
          />
          <i
            className="fa-solid fa-xmark cursor-pointer transition-opacity hover:opacity-50"
            onClick={() => onReject()}
          />
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
