import { useContext, useState } from 'react'
import { ConnectModal } from '@suiet/wallet-kit'

import { SuiWalletModalContext } from '@/context/sui_wallet_modal_context'

type SuiWalletConnectModalProviderProps = {
  children: React.ReactNode | React.ReactNode[]
}

export const SuiWalletConnectModalProvider = ({
  children,
}: SuiWalletConnectModalProviderProps) => {
  const [open, setOpen] = useState(false)

  return (
    <SuiWalletModalContext.Provider value={{ open, setOpen }}>
      {children}
    </SuiWalletModalContext.Provider>
  )
}

export const SuiWalletConnectModal = () => {
  const { open, setOpen } = useContext(SuiWalletModalContext)

  return (
    <ConnectModal
      onConnectSuccess={() => setOpen(false)}
      onOpenChange={(open) => setOpen(open)}
      open={open}
    />
  )
}
