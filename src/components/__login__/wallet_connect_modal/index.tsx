import Image from 'next/image'
import Link from 'next/link'
import { getCsrfToken, signIn } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { toast } from 'react-toastify'

import { Modal, Button } from '@/components'

type WalletConnectModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const WalletConnectModal = ({ open, setOpen }: WalletConnectModalProps) => {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  const { openConnectModal } = useConnectModal()

  const handleConnectEth = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to Morphis Airdawg',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: true,
        signature,
        callbackUrl: '/discover',
      })
    } catch (error) {
      toast((error as Error)?.message || 'Failed to sign in')
    }
  }

  return (
    <Modal
      classNames="!z-[1]"
      open={open}
      setOpen={setOpen}
    >
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="w-[600px] flex flex-col items-center py-8 rounded-[24px] bg-white">
          <Image
            alt="artwork_4"
            className="mb-6"
            height={40}
            src="/icons/logo_with_text.svg"
            width={160}
          />
          <div className="mb-6 text-[28px] font-medium">Find web3 perks with AirDawg</div>
          <Image
            alt="artwork_4"
            className="mb-6"
            height={156}
            src="/images/login/artwork_4.png"
            width={274}
          />
          <Button
            className="!w-[304px] flex items-center gap-5 mb-2 pl-[52px] !border-[#e0e0e9] font-normal !text-lg"
            onClick={() => (isConnected ? handleConnectEth() : openConnectModal?.())}
            variant="outlined"
          >
            <WalletIcon />
            Ethereum Wallet
          </Button>
          <Button
            className="!w-[304px] flex items-center gap-5 mb-2 pl-[52px] !border-[#e0e0e9] font-normal !text-lg"
            variant="outlined"
          >
            <WalletIcon />
            Sui Wallet
          </Button>
          <Button
            className="!w-[304px] flex items-center gap-5 mb-2 pl-[52px] !border-[#e0e0e9] font-normal !text-lg"
            variant="outlined"
          >
            <WalletIcon />
            Solana Wallet
          </Button>
          <p className="mt-6 font-normal text-base">
            Have an account?{' '}
            <Link
              className="underline"
              href="/login?type=socials"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default WalletConnectModal

const WalletIcon = () => (
  <svg
    width="21"
    height="22"
    viewBox="0 0 21 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.979 7.17024V3.67089C14.979 2.83915 14.979 2.42328 14.8038 2.16771C14.6507 1.94442 14.4136 1.79273 14.1468 1.74732C13.8413 1.69534 13.4637 1.86961 12.7085 2.21816L3.83802 6.31223C3.16451 6.62308 2.82776 6.77851 2.58111 7.01956C2.36306 7.23266 2.19662 7.49279 2.09451 7.78007C1.979 8.10503 1.979 8.47592 1.979 9.2177V14.1702M15.479 13.6702H15.489M1.979 10.3702L1.979 16.9702C1.979 18.0903 1.979 18.6504 2.19699 19.0782C2.38874 19.4545 2.6947 19.7605 3.07102 19.9522C3.49885 20.1702 4.0589 20.1702 5.179 20.1702H16.779C17.8991 20.1702 18.4592 20.1702 18.887 19.9523C19.2633 19.7605 19.5693 19.4545 19.761 19.0782C19.979 18.6504 19.979 18.0903 19.979 16.9702V10.3702C19.979 9.25013 19.979 8.69008 19.761 8.26226C19.5693 7.88593 19.2633 7.57997 18.887 7.38823C18.4592 7.17024 17.8991 7.17024 16.779 7.17024L5.179 7.17024C4.0589 7.17024 3.49885 7.17024 3.07102 7.38823C2.6947 7.57997 2.38874 7.88593 2.19699 8.26226C1.979 8.69008 1.979 9.25013 1.979 10.3702ZM15.979 13.6702C15.979 13.9464 15.7551 14.1702 15.479 14.1702C15.2029 14.1702 14.979 13.9464 14.979 13.6702C14.979 13.3941 15.2029 13.1702 15.479 13.1702C15.7551 13.1702 15.979 13.3941 15.979 13.6702Z"
      stroke="#718096"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
