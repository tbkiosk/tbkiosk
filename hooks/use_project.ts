import { useState, useEffect } from 'react'
import { notifications } from '@mantine/notifications'

import type { Project } from '@prisma/client'

export default function useProject(slug?: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  if (!slug) {
    return {
      project,
      loading,
    }
  }

  const getProject = async () => {
    try {
      const res = await fetch(`/api/projects/${slug}`)

      if (!res.ok) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: res.statusText,
        })
      }

      const project = await res.json()
      setProject(project)
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
    getProject()
  }, [])

  return { project, loading }
}
