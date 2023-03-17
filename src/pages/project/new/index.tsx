import { useEffect } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'

import Layout from '@/layouts'
import { Button, Input, TextArea, Select } from '@/components'

import useRole from '@/hooks/useRole'

import { ROLES } from '@/constants/roles'

import type { Project } from '@/schemas/project'

const NewProject = () => {
  const router = useRouter()

  const [role] = useRole()

  const { control, handleSubmit } = useForm<Project>({
    defaultValues: {
      projectName: '',
      customURL: '',
      description: '',
      website: '',
      twitter: '',
      discord: '',
      mintDate: '',
      mintPrice: '',
      coinType: 'ETH',
      totalSupply: '',
    },
  })

  const onSubmit: SubmitHandler<Project> = data => data

  useEffect(() => {
    if (role === ROLES.USER) {
      router.push('/profile')
    }
  }, [role])

  return (
    <Layout>
      <form
        className="flex flex-row gap-24 grow py-6 text-base overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-2/4">
          <p className="mb-4 font-bold text-lg">Create a new project</p>
          <p className="mb-4">Provide information about your project and criteria for the allow list.</p>
          <p className="mb-4 font-bold">Project information</p>
          <Controller
            name="projectName"
            control={control}
            render={({ field }) => (
              <div className="mb-6">
                <label
                  className="block mb-1"
                  htmlFor="projectName"
                >
                  Project name
                </label>
                <Input
                  placeholder="Enter the name of your project here"
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="customURL"
            control={control}
            render={({ field }) => (
              <div className="mb-6">
                <label
                  className="block mb-1"
                  htmlFor="customURL"
                >
                  Custom url
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
            render={({ field }) => (
              <div className="mb-6">
                <label
                  className="block mb-1"
                  htmlFor="description"
                >
                  Description
                </label>
                <TextArea
                  className="resize-none"
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <div className="mb-6">
                <label
                  className="block mb-1"
                  htmlFor="website"
                >
                  Website
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
                  className="block mb-1"
                  htmlFor="twitter"
                >
                  Twitter
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
                  className="block mb-1"
                  htmlFor="discord"
                >
                  Discord
                </label>
                <Input
                  placeholder="Enter Discord url"
                  {...field}
                />
              </div>
            )}
          />
          <Button
            className="!h-12 button__colored button__submit"
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
                    className="block mb-1"
                    htmlFor="mintDate"
                  >
                    Mint date
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="date"
                      {...field}
                    />
                    <span className="font-bold text-base">GMT</span>
                  </div>
                </div>
              )}
            />
            <Controller
              name="mintPrice"
              control={control}
              render={({ field }) => (
                <div className="mb-6">
                  <label
                    className="block mb-1"
                    htmlFor="mintPrice"
                  >
                    Mint price
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      className="grow"
                      {...field}
                    />
                    <Controller
                      name="coinType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          buttonClassName="rounded-[1.5rem]"
                          className="w-[7rem]"
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
            />
            <Controller
              name="totalSupply"
              control={control}
              render={({ field }) => (
                <div className="mb-6">
                  <label
                    className="block mb-1"
                    htmlFor="totalSupply"
                  >
                    Total supply
                  </label>
                  <Input {...field} />
                </div>
              )}
            />
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default NewProject
