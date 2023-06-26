import type { ReactNode } from 'react'

export type SingleNode = {
  children: ReactNode
}

export type MultiNode = {
  children: ReactNode | ReactNode[]
}
