import { useState, useEffect } from 'react'
import { notifications } from '@mantine/notifications'

import type { Project } from '@prisma/client'

type useProjectsOptions =
  | {
      disabled?: boolean
      search?: string
    }
  | undefined

export default function useProjects({ disabled, search }: useProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const getProjects = async () => {
    try {
      if (disabled) {
        setLoading(false)
        return
      }

      const res = await fetch(`/api/projects?${search ? `search=${search}` : ''}`)

      if (!res.ok) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: res.statusText,
        })
      }

      const projects = await res.json()
      setProjects(projects)
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: (error as Error)?.message,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjects()
  }, [search, disabled])

  return { projects, loading }
}
