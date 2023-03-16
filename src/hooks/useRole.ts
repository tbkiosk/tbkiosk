import { useState, useEffect } from 'react'

import { ROLES } from '@/constants/roles'
import { LS_CHANGE_EVENT, LS_ROLE_KEY } from '@/constants/ls'

type UseRole = [ROLES | null, (role: ROLES) => void]

const useRole = (): UseRole => {
  const [role, setRole] = useState<ROLES | null>(null)

  const _setRole = (newValue: ROLES) => {
    localStorage.setItem(LS_ROLE_KEY, newValue)
    window.dispatchEvent(
      new CustomEvent(LS_CHANGE_EVENT, {
        detail: newValue,
      })
    )
  }

  const onLsChange = (newValue: ROLES) => {
    setRole(newValue)
  }

  useEffect(() => {
    setRole((localStorage.getItem(LS_ROLE_KEY) ?? ROLES.USER) as ROLES)
  }, [])

  useEffect(() => {
    window.addEventListener(LS_CHANGE_EVENT, e => onLsChange((<CustomEvent<ROLES>>e).detail))

    return () => window.removeEventListener(LS_CHANGE_EVENT, e => onLsChange((<CustomEvent<ROLES>>e).detail))
  }, [])

  return [role, _setRole]
}

export default useRole
