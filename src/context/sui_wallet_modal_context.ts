import { createContext, useContext } from 'react'

type SuiWalletModalValues = {
  open: boolean
  setOpen: (open: boolean) => void
}

const defaultValue: SuiWalletModalValues = {
  open: false,
  setOpen: () => void 0,
}

export const SuiWalletModalContext = createContext(defaultValue)

export const useSuiWalletModal = (): SuiWalletModalValues => {
  const { open, setOpen } = useContext(SuiWalletModalContext)

  return { open, setOpen }
}
