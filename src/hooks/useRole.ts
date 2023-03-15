import { useState, useEffect } from 'react'

import { ROLES } from '@/constants/roles'
import { LS_CHANGE_EVENT, LS_ROLE_KEY } from '@/constants/ls'

const useRole = (): [ROLES, (role: ROLES) => void] => {
  const [role, setRole] = useState<ROLES>(ROLES.USER)

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
    window.addEventListener(LS_CHANGE_EVENT, ((e: CustomEvent<ROLES>) => onLsChange(e.detail)) as EventListener)

    return () => window.removeEventListener(LS_CHANGE_EVENT, ((e: CustomEvent<ROLES>) => onLsChange(e.detail)) as EventListener)
  }, [])

  return [role, _setRole]
}

export default useRole
