import { useState, useEffect } from 'react'
import { notifications } from '@mantine/notifications'

import type { Project } from '@prisma/client'

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const getProjects = async () => {
    try {
      const res = await fetch(`/api/projects`)

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
  }, [])

  return { projects, loading }
}
