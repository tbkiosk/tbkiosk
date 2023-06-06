import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useWallet } from '@suiet/wallet-kit'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'

import { Modal, Button } from '@/components'
import { useSuiWalletModal } from '@/context/sui_wallet_modal_context'

import request from '@/utils/request'
import { ellipsisMiddle } from '@/utils/address'

import type { User } from '@/schemas/users'

type WalletConnectModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const WalletConnectModal = ({ open, setOpen }: WalletConnectModalProps) => {
  const router = useRouter()

  const { address: ethAddress = '', isConnected: ethIsConnected } = useAccount()
  const { connected: suiConnected, address: suiAddress = '' } = useWallet()
  const { open: ethOpen } = useWeb3Modal()
  const { setOpen: setSuiModalOpen } = useSuiWalletModal()

  const onConnect = async () => {
    const res = await request<User>({
      url: '/api/user',
      method: 'POST',
      data: {
        addresses: [
          ...(ethAddress ? [{ chain: 'ETH', address: ethAddress }] : []),
          ...(suiAddress ? [{ chain: 'SUI', address: suiAddress }] : []),
        ],
      },
    })

    if (!res.data) {
      toast.error(res.message || 'Failed to update user, please try to connect wallet again')
    }
  }

  useEffect(() => {
    onConnect()
  }, [ethIsConnected, suiConnected])

  return (
    <Modal
      classNames="!z-[1]"
      open={open}
      setOpen={setOpen}
    >
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="h-[768px] w-[600px] flex flex-col items-center py-[108px] rounded-[24px] bg-white">
          <Image
            alt="artwork_4"
            className="mb-6"
            height={40}
            src="/icons/logo_with_text.svg"
            width={160}
          />
          <div className="mb-6 text-[28px]">Create an account to find perks</div>
          <Image
            alt="artwork_4"
            className="mb-6"
            height={156}
            src="/images/artwork_4.png"
            width={274}
          />
          <Button
            className="!w-[304px] flex justify-center items-center gap-2 mb-2 border-[#e0e0e9]"
            onClick={() => ethOpen()}
            variant="outlined"
          >
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 6.50032V3.00097C14 2.16923 14 1.75336 13.8248 1.49779C13.6717 1.2745 13.4346 1.12281 13.1678 1.0774C12.8623 1.02542 12.4847 1.19969 11.7295 1.54824L2.85901 5.64231C2.18551 5.95316 1.84875 6.10858 1.60211 6.34963C1.38406 6.56273 1.21762 6.82287 1.1155 7.11015C1 7.4351 1 7.806 1 8.54778V13.5003M14.5 13.0003H14.51M1 9.70032L1 16.3003C1 17.4204 1 17.9805 1.21799 18.4083C1.40973 18.7846 1.71569 19.0906 2.09202 19.2823C2.51984 19.5003 3.07989 19.5003 4.2 19.5003H15.8C16.9201 19.5003 17.4802 19.5003 17.908 19.2823C18.2843 19.0906 18.5903 18.7846 18.782 18.4083C19 17.9805 19 17.4204 19 16.3003V9.70032C19 8.58021 19 8.02016 18.782 7.59234C18.5903 7.21601 18.2843 6.91005 17.908 6.7183C17.4802 6.50032 16.9201 6.50032 15.8 6.50032L4.2 6.50032C3.0799 6.50032 2.51984 6.50032 2.09202 6.7183C1.7157 6.91005 1.40973 7.21601 1.21799 7.59234C1 8.02016 1 8.58021 1 9.70032ZM15 13.0003C15 13.2765 14.7761 13.5003 14.5 13.5003C14.2239 13.5003 14 13.2765 14 13.0003C14 12.7242 14.2239 12.5003 14.5 12.5003C14.7761 12.5003 15 12.7242 15 13.0003Z"
                stroke="#718096"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {ethIsConnected ? `ETH: ${ellipsisMiddle(ethAddress)}` : 'Ethereum Wallet'}
          </Button>
          <Button
            className="!w-[304px] flex justify-center items-center gap-2 mb-2 border-[#e0e0e9]"
            onClick={() => setSuiModalOpen(true)}
            variant="outlined"
          >
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 6.50032V3.00097C14 2.16923 14 1.75336 13.8248 1.49779C13.6717 1.2745 13.4346 1.12281 13.1678 1.0774C12.8623 1.02542 12.4847 1.19969 11.7295 1.54824L2.85901 5.64231C2.18551 5.95316 1.84875 6.10858 1.60211 6.34963C1.38406 6.56273 1.21762 6.82287 1.1155 7.11015C1 7.4351 1 7.806 1 8.54778V13.5003M14.5 13.0003H14.51M1 9.70032L1 16.3003C1 17.4204 1 17.9805 1.21799 18.4083C1.40973 18.7846 1.71569 19.0906 2.09202 19.2823C2.51984 19.5003 3.07989 19.5003 4.2 19.5003H15.8C16.9201 19.5003 17.4802 19.5003 17.908 19.2823C18.2843 19.0906 18.5903 18.7846 18.782 18.4083C19 17.9805 19 17.4204 19 16.3003V9.70032C19 8.58021 19 8.02016 18.782 7.59234C18.5903 7.21601 18.2843 6.91005 17.908 6.7183C17.4802 6.50032 16.9201 6.50032 15.8 6.50032L4.2 6.50032C3.0799 6.50032 2.51984 6.50032 2.09202 6.7183C1.7157 6.91005 1.40973 7.21601 1.21799 7.59234C1 8.02016 1 8.58021 1 9.70032ZM15 13.0003C15 13.2765 14.7761 13.5003 14.5 13.5003C14.2239 13.5003 14 13.2765 14 13.0003C14 12.7242 14.2239 12.5003 14.5 12.5003C14.7761 12.5003 15 12.7242 15 13.0003Z"
                stroke="#718096"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {suiConnected ? `SUI: ${ellipsisMiddle(suiAddress)}` : 'Sui Wallet'}
          </Button>
          <Button
            className="!w-[304px] flex justify-center items-center gap-2 mb-2 border-[#e0e0e9]"
            variant="outlined"
          >
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 6.50032V3.00097C14 2.16923 14 1.75336 13.8248 1.49779C13.6717 1.2745 13.4346 1.12281 13.1678 1.0774C12.8623 1.02542 12.4847 1.19969 11.7295 1.54824L2.85901 5.64231C2.18551 5.95316 1.84875 6.10858 1.60211 6.34963C1.38406 6.56273 1.21762 6.82287 1.1155 7.11015C1 7.4351 1 7.806 1 8.54778V13.5003M14.5 13.0003H14.51M1 9.70032L1 16.3003C1 17.4204 1 17.9805 1.21799 18.4083C1.40973 18.7846 1.71569 19.0906 2.09202 19.2823C2.51984 19.5003 3.07989 19.5003 4.2 19.5003H15.8C16.9201 19.5003 17.4802 19.5003 17.908 19.2823C18.2843 19.0906 18.5903 18.7846 18.782 18.4083C19 17.9805 19 17.4204 19 16.3003V9.70032C19 8.58021 19 8.02016 18.782 7.59234C18.5903 7.21601 18.2843 6.91005 17.908 6.7183C17.4802 6.50032 16.9201 6.50032 15.8 6.50032L4.2 6.50032C3.0799 6.50032 2.51984 6.50032 2.09202 6.7183C1.7157 6.91005 1.40973 7.21601 1.21799 7.59234C1 8.02016 1 8.58021 1 9.70032ZM15 13.0003C15 13.2765 14.7761 13.5003 14.5 13.5003C14.2239 13.5003 14 13.2765 14 13.0003C14 12.7242 14.2239 12.5003 14.5 12.5003C14.7761 12.5003 15 12.7242 15 13.0003Z"
                stroke="#718096"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Solana Wallet
          </Button>
          <Button
            className="!w-[304px]"
            disabled={!ethAddress && !suiAddress}
            onClick={() => router.push('discover')}
            variant="contained"
          >
            Login
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default WalletConnectModal
