import Image from 'next/image'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import cl from 'classnames'

import { Modal, Input, Button } from '@/components'

import request from '@/utils/request'

import { TENCENT_COS_DEV_BUCKET, TENCENT_COS_BUCKET, TENCENT_COS_CDN_DOMAIN } from '@/constants/cos'
import { AllocationMethod } from '@/schemas/allowlist'

import type { ProjectData } from '@/schemas/project'
import type { AllowlistForm } from '@/schemas/allowlist'
import type { WithObjectId } from '@/types/schema'
import type { ResponseBase } from '@/types/response'

type AllowlistDialogProps = {
  open: boolean
  project: WithObjectId<ProjectData> | null
  setOpen: (open: boolean) => void
  onRefresh: () => void
}

export const AllowlistDialog = ({ open, project, setOpen, onRefresh }: AllowlistDialogProps) => {
  const { control, handleSubmit, formState } = useForm<AllowlistForm>({
    defaultValues: {
      amount: '',
      criteria: {},
      allocationMethod: AllocationMethod.FCFS,
    },
  })

  const onSubmit: SubmitHandler<AllowlistForm> = async formData => {
    const { data } = await request<ResponseBase<boolean>>(`/api/project/${(project as WithObjectId<ProjectData>)._id}/allowlist`, {
      method: 'POST',
      body: JSON.stringify(formData),
    })

    if (data?.data) {
      toast.success(data?.message ?? 'Success')
      setOpen(false)
      onRefresh()
    } else {
      toast.error(data?.message ?? 'Failed to create allowlist')
    }
  }

  return (
    <Modal
      isOpen={open}
      setOpen={setOpen}
    >
      {project && (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <form
            className="min-w-[28rem] flex flex-col p-8 bg-white rounded"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-xl">Create a new allowlist</span>
              <span
                className="transition-opacity cursor-pointer hover:opacity-50"
                onClick={() => setOpen(false)}
              >
                Close
              </span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Image
                alt="logo"
                className="h-[2.5rem] rounded-lg aspect-square object-contain"
                height={40}
                loader={({ src }) => src}
                src={`https://${
                  process.env.NODE_ENV === 'production' ? TENCENT_COS_BUCKET : TENCENT_COS_DEV_BUCKET
                }.${TENCENT_COS_CDN_DOMAIN}/${project.profileImage}`}
                unoptimized
                width={40}
              />
              <div>
                <span className="font-bold">{project.projectName}</span>
              </div>
            </div>
            <Controller
              control={control}
              name="amount"
              render={({ field, fieldState }) => (
                <div className="relative">
                  <span className="absolute text-xs right-4 top-[11px]">WL</span>
                  <Input
                    className={cl(['pr-12 text-right', fieldState.error && 'text-red-700 border-red-700 outline-red-700'])}
                    placeholder="Amount of allowlist"
                    {...field}
                  />
                </div>
              )}
              rules={{ required: true, min: 1, validate: value => !isNaN(+value) }}
            />
            <hr className="-mx-8 my-6 border-[#e6e6e9]" />
            <p className="font-bold">Criteria</p>
            <hr className="-mx-8 my-6 border-[#e6e6e9]" />
            <p className="mb-4 font-bold">Allocation method</p>
            <Controller
              control={control}
              name="allocationMethod"
              render={({ field }) => (
                <div className="mb-8">
                  <div className="mb-2">
                    <input
                      checked={field.value === AllocationMethod.FCFS}
                      className="mr-4 cursor-pointer accent-black"
                      id={AllocationMethod.FCFS}
                      onChange={field.onChange}
                      type="radio"
                      value={AllocationMethod.FCFS}
                    />
                    <label
                      className="cursor-pointer"
                      htmlFor={AllocationMethod.FCFS}
                    >
                      First come, first serve
                    </label>
                  </div>
                  <input
                    checked={field.value === AllocationMethod.Raffle}
                    className="mr-4 cursor-pointer accent-black"
                    id={AllocationMethod.Raffle}
                    onChange={field.onChange}
                    type="radio"
                    value={AllocationMethod.Raffle}
                  />
                  <label
                    className="cursor-pointer"
                    htmlFor={AllocationMethod.Raffle}
                  >
                    Raffle
                  </label>
                </div>
              )}
            />
            <Button
              className="!h-10"
              loading={formState.isLoading}
              variant="colored"
            >
              Create Whitelist
            </Button>
          </form>
        </div>
      )}
    </Modal>
  )
}
