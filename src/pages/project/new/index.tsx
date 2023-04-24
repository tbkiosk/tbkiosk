import { useEffect, useMemo, forwardRef } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dayjs from 'dayjs'

import Layout from '@/layouts'
import { Button, Input, TextArea, Select, Upload } from '@/components'

import useRole from '@/hooks/useRole'

import request from '@/utils/request'

import { ROLES } from '@/constants/roles'

import type { ProjectForm } from '@/schemas/project'
import type { ResponseBase } from '@/types/response'

const DatePickerContainer = forwardRef<HTMLInputElement>((props, ref) => (
  <div className="relative">
    <i className="fa-solid fa-calendar absolute right-4 top-[11px]" />
    <Input
      {...props}
      className="pr-8"
      ref={ref}
    />
  </div>
))

DatePickerContainer.displayName = 'DatePickerContainer'

const NewProject = () => {
  const router = useRouter()

  const [role] = useRole()

  const tomorrow = useMemo(() => dayjs().add(1, 'day').toDate(), [])

  const { control, handleSubmit, formState } = useForm<ProjectForm>({
    defaultValues: {
      projectName: '',
      customURL: '',
      description: '',
      website: '',
      twitter: '',
      discord: '',
      mintDate: dayjs(tomorrow).format(),
      mintPrice: '',
      coinType: 'ETH',
      totalSupply: '',
      profileImage: '',
      bannerImage: '',
    },
  })

  const onSubmit: SubmitHandler<ProjectForm> = async formData => {
    const transformedData = {
      ...formData,
      mintPrice: !formData.mintPrice ? undefined : Number(formData.mintPrice),
      totalSupply: !formData.totalSupply ? undefined : Number(formData.totalSupply),
    }

    const { data, message } = await request<ResponseBase<boolean>>('/api/project', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    })

    if (data?.data) {
      router.push('/project').then(() => toast.success(data?.message || 'Success'))
    } else {
      toast.error(message || 'Failed to create project')
    }
  }

  useEffect(() => {
    if (role === ROLES.USER) {
      router.push('/profile')
    }
  }, [role])

  return (
    <Layout
      headerLeft={
        <Link
          className="flex items-center"
          href="/project"
        >
          <i className="fa-solid fa-arrow-left-long text-2xl mr-4 cursor-pointer transition hover:opacity-70 hover:scale-110" />
          <span>New project</span>
        </Link>
      }
    >
      <form
        className="flex flex-row gap-24 py-6 text-base"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-2/4">
          <p className="mb-4 font-bold text-lg">Create a new project</p>
          <p className="mb-4">Provide information about your project and criteria for the allow list.</p>
          <p className="mb-4 font-bold">Project information</p>
          <Controller
            name="projectName"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-6">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="projectName"
                >
                  Project name
                </label>
                <Input
                  isError={fieldState.invalid}
                  placeholder="Enter the name of your project here"
                  {...field}
                />
              </div>
            )}
            rules={{ required: true }}
          />
          <Controller
            name="customURL"
            control={control}
            render={({ field }) => (
              <div className="mb-6">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="customURL"
                >
                  Custom url
                  <span className="ml-2 font-normal text-gray-300">(optional)</span>
                </label>
                <Input
                  placeholder="your custom url"
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-6">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="description"
                >
                  Description
                </label>
                <TextArea
                  className="resize-none"
                  isError={fieldState.invalid}
                  {...field}
                />
              </div>
            )}
            rules={{ required: true }}
          />
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <div className="mb-6">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="website"
                >
                  Website
                  <span className="ml-2 font-normal text-gray-300">(optional)</span>
                </label>
                <Input
                  placeholder="Enter your website url"
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="twitter"
            control={control}
            render={({ field }) => (
              <div className="mb-6">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="twitter"
                >
                  Twitter
                  <span className="ml-2 font-normal text-gray-300">(optional)</span>
                </label>
                <Input
                  placeholder="Enter Twitter profile url"
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="discord"
            control={control}
            render={({ field }) => (
              <div className="mb-6">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="discord"
                >
                  Discord
                  <span className="ml-2 font-normal text-gray-300">(optional)</span>
                </label>
                <Input
                  placeholder="Enter Discord url"
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="profileImage"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mb-6">
                <label className="block mb-1 font-medium">Profile Image</label>
                <div className="flex items-center gap-4">
                  <span className="grow font-normal">
                    This image will be used as the profile image on your project homepage and any allow list pages. 350x350 recommended
                  </span>
                  <Upload
                    id="profileImage"
                    isError={fieldState.invalid}
                    onChange={(newValue: string) => field.onChange(newValue)}
                    ref={field.ref}
                    value={field.value}
                  />
                </div>
              </div>
            )}
            rules={{ required: true }}
          />
          <Controller
            name="bannerImage"
            control={control}
            render={({ field }) => (
              <div className="mb-6">
                <label className="block mb-1 font-medium">
                  Banner Image
                  <span className="ml-2 font-normal text-gray-300">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <span className="grow font-normal">1400x420 recommended</span>
                  <Upload
                    id="bannerImage"
                    maxSize={5 * 1024 * 1024}
                    onChange={(newValue: string) => field.onChange(newValue)}
                    ref={field.ref}
                    value={field.value}
                  />
                </div>
              </div>
            )}
          />
          <Button
            className="!h-12 button__colored button__submit"
            loading={formState.isSubmitting}
            type="submit"
            variant="colored"
          >
            Save
          </Button>
        </div>
        <div className="w-2/4">
          <div className="p-8 bg-[#f5f5f5] rounded-lg">
            <Controller
              name="mintDate"
              control={control}
              render={({ field }) => (
                <div className="mb-6">
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="mintDate"
                  >
                    Mint date
                  </label>
                  <div className="relative flex items-center">
                    <DatePicker
                      customInput={<DatePickerContainer />}
                      minDate={tomorrow}
                      onChange={newDate => field.onChange(dayjs(newDate).format())}
                      selected={dayjs(field.value).toDate()}
                    />
                    <span className="ml-4 font-bold text-base">GMT</span>
                  </div>
                </div>
              )}
            />
            <Controller
              name="mintPrice"
              control={control}
              render={({ field, fieldState }) => (
                <div className="mb-6">
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="mintPrice"
                  >
                    Mint price
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      className="grow"
                      isError={fieldState.invalid}
                      {...field}
                    />
                    <Controller
                      name="coinType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          buttonClassName="!rounded-[1.5rem]"
                          className="!w-[7rem]"
                          onChange={option => field.onChange(option.id)}
                          options={[
                            { id: 'ETH', name: 'ETH' },
                            { id: 'BTC', name: 'BTC' },
                          ]}
                          value={field.value}
                        />
                      )}
                    />
                  </div>
                </div>
              )}
              rules={{ pattern: /^\d+(\.\d+)?$/ }}
            />
            <Controller
              name="totalSupply"
              control={control}
              render={({ field, fieldState }) => (
                <div className="mb-6">
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="totalSupply"
                  >
                    Total supply
                  </label>
                  <Input
                    {...field}
                    isError={fieldState.invalid}
                  />
                </div>
              )}
              rules={{ pattern: /^[0-9]*$/ }}
            />
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default NewProject
