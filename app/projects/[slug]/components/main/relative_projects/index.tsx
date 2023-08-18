'use client'

import { useState, useEffect } from 'react'
import { notifications } from '@mantine/notifications'

import ProjectsGrid from 'components/projects/projects_grid'

import type { Project } from '@prisma/client'

export default function RelativeProjects({ slug }: { slug: string }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const getProjects = async () => {
    try {
      const res = await fetch(`/api/projects/${slug}/relatives`)

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

  return (
    <ProjectsGrid
      projects={projects}
      loading={loading}
    />
  )
}
