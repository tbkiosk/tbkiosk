import { useEffect, useMemo } from 'react'
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'
import Image from 'next/image'
import cl from 'classnames'

import { Modal, Input, Button, Dropdown } from '@/components'

import request from '@/utils/request'

import { TENCENT_COS_DEV_BUCKET, TENCENT_COS_BUCKET, TENCENT_COS_CDN_DOMAIN } from '@/constants/cos'
import { AllocationMethod, CriteriaKeys, CRITERIA_DEFAULT_VALUE, criteriaDisplayText, MAX_NFT_HOLD_CONDITIONS } from '@/schemas/allowlist'

import type { ProjectData } from '@/schemas/project'
import type { AllowlistForm } from '@/schemas/allowlist'
import type { WithObjectId } from '@/types/schema'
import type { ResponseBase } from '@/types/response'

type AllowlistDialogProps = {
  open: boolean
  setOpen: (nextOpen: boolean) => void
  onClose?: () => void
  onRefresh?: () => void
  project: WithObjectId<ProjectData> | null
}

const DEFAULT_VALUES = {
  amount: '',
  criteria: {},
  allocationMethod: AllocationMethod.FCFS,
}

export const AllowlistDialog = ({ open, setOpen, project, onRefresh, onClose }: AllowlistDialogProps) => {
  const { control, handleSubmit, formState, getValues, setValue, watch, reset } = useForm<AllowlistForm>({
    defaultValues: DEFAULT_VALUES,
  })
  const { append, remove, fields } = useFieldArray({
    control,
    name: 'criteria.MINIMUN_TOKEN_AND_ADDRESS',
  })

  const onSubmit: SubmitHandler<AllowlistForm> = async formData => {
    const { data, message } = await request<ResponseBase<boolean>>(`/api/project/${(project as WithObjectId<ProjectData>)._id}/allowlist`, {
      method: 'POST',
      body: JSON.stringify(formData),
    })

    if (data?.data) {
      toast.success(data?.message || 'Success')
      setOpen(false)
      onRefresh?.()
    } else {
      toast.error(message || 'Failed to create allowlist')
    }
  }

  const criteriaValue = useMemo(() => getValues('criteria'), [watch('criteria')])

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES)
    } else {
      onClose?.()
    }
  }, [open])

  return (
    <Modal
      isOpen={open}
      setOpen={setOpen}
    >
      {project && (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <form
            className="w-[28rem] max-w-[28rem] max-h-[720px] flex flex-col p-8 bg-white rounded overflow-y-auto"
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
                  <span className="absolute text-[10px] left-2 top-[2px]">Amount</span>
                  <Input
                    className="!px-12 border-gray-200 text-right"
                    isError={fieldState.invalid}
                    {...field}
                  />
                </div>
              )}
              rules={{ required: true, min: 1, validate: value => Number.isInteger(Number(value)) }}
            />
            <hr className="-mx-8 my-6 border-[#e6e6e9]" />
            <p className="mb-4 font-bold">Criteria</p>
            <div className="flex flex-col gap-2">
              {fields.map((_field, index) => (
                <div key={_field.id}>
                  <label className="flex justify-between items-center mb-2">
                    {criteriaDisplayText[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]} {index + 1}
                    <i
                      className="fa-solid fa-xmark text-sm cursor-pointer hover:opacity-50"
                      onClick={() => remove(index)}
                    />
                  </label>
                  <Controller
                    control={control}
                    name={`criteria.MINIMUN_TOKEN_AND_ADDRESS.${index}.contractAddress`}
                    render={({ field, fieldState }) => (
                      <Input
                        className="border-gray-200 mb-2"
                        isError={fieldState.invalid}
                        placeholder="Enter NFT/Token contract address"
                        {...field}
                      />
                    )}
                    rules={{ required: true, pattern: /0x[a-fA-F0-9]+$/ }}
                  />
                  <Controller
                    control={control}
                    name={`criteria.MINIMUN_TOKEN_AND_ADDRESS.${index}.number`}
                    render={({ field, fieldState }) => (
                      <Input
                        className="border-gray-200 mb-2"
                        isError={fieldState.invalid}
                        placeholder="Enter number of tokens"
                        {...field}
                      />
                    )}
                    rules={{ required: true, min: 1, validate: value => Number.isInteger(+value) }}
                  />
                </div>
              ))}
              <Controller
                control={control}
                name="criteria.PROJECT_DISCORD_JOINED"
                render={({ field }) =>
                  field.value && (
                    <p className="flex justify-between items-center mb-2">
                      <span>Join Discord server</span>
                      <i
                        className="fa-solid fa-xmark text-sm cursor-pointer hover:opacity-50"
                        onClick={() =>
                          setValue('criteria', {
                            ...criteriaValue,
                            [CriteriaKeys.PROJECT_DISCORD_JOINED]: undefined,
                          })
                        }
                      />
                    </p>
                  )
                }
              />
              <Controller
                control={control}
                name="criteria.PROJECT_TWITTER_FOLLOWED"
                render={({ field }) =>
                  field.value && (
                    <p className="flex justify-between items-center mb-2">
                      <span className="truncate">Follow @{project.projectName} Twitter</span>
                      <i
                        className="fa-solid fa-xmark text-sm cursor-pointer hover:opacity-50"
                        onClick={() =>
                          setValue('criteria', {
                            ...criteriaValue,
                            [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: undefined,
                          })
                        }
                      />
                    </p>
                  )
                }
              />
            </div>
            <Dropdown
              buttonClassName="!justify-start !bg-white !text-black !border !border-gray-200 !outline-none !ring-0 !ring-offset-0 !rounded-md"
              renderButton={() => (
                <span>
                  <i className="fa-solid fa-plus fa-sm mr-2" />
                  Add new
                </span>
              )}
            >
              <Dropdown.Items
                className={cl([
                  'w-full absolute top-full right-0 pb-2 z-10 border border-t-0 border-gray-200 rounded-md overflow-hidden',
                  'bg-white focus:outline-none',
                ])}
              >
                <Dropdown.Item disabled={fields.length >= MAX_NFT_HOLD_CONDITIONS}> 
                  <div
                    className={cl([
                      'px-4 py-2 cursor-pointer hover:bg-gray-100',
                      fields.length >= MAX_NFT_HOLD_CONDITIONS && 'text-gray-300 !cursor-not-allowed',
                    ])}
                    onClick={() => fields.length < MAX_NFT_HOLD_CONDITIONS && append({ contractAddress: '', number: '' })}
                  >
                    {criteriaDisplayText[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item disabled={!!criteriaValue.PROJECT_DISCORD_JOINED}>
                  <div
                    className={cl([
                      'px-4 py-2 cursor-pointer hover:bg-gray-100',
                      criteriaValue.PROJECT_DISCORD_JOINED && 'text-gray-300 !cursor-not-allowed',
                    ])}
                    onClick={() =>
                      setValue('criteria', {
                        ...criteriaValue,
                        [CriteriaKeys.PROJECT_DISCORD_JOINED]: CRITERIA_DEFAULT_VALUE[CriteriaKeys.PROJECT_DISCORD_JOINED],
                      })
                    }
                  >
                    {criteriaDisplayText[CriteriaKeys.PROJECT_DISCORD_JOINED]}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item disabled={!!criteriaValue.PROJECT_TWITTER_FOLLOWED}>
                  <div
                    className={cl([
                      'px-4 py-2 cursor-pointer hover:bg-gray-100',
                      criteriaValue.PROJECT_TWITTER_FOLLOWED && 'text-gray-300 !cursor-not-allowed',
                    ])}
                    onClick={() =>
                      setValue('criteria', {
                        ...criteriaValue,
                        [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: CRITERIA_DEFAULT_VALUE[CriteriaKeys.PROJECT_TWITTER_FOLLOWED],
                      })
                    }
                  >
                    {criteriaDisplayText[CriteriaKeys.PROJECT_TWITTER_FOLLOWED]}
                  </div>
                </Dropdown.Item>
              </Dropdown.Items>
            </Dropdown>
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
              className="!h-10 shrink-0"
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
