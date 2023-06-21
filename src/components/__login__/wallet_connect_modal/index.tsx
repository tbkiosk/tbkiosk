import Image from 'next/image'
import Link from 'next/link'

import { Modal, Button } from '@/components'
import EthButton from './eth_button'
import SuiButton from './sui_button'

type WalletConnectModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const WalletConnectModal = ({ open, setOpen }: WalletConnectModalProps) => {
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
          <EthButton />
          <SuiButton />
          <Button
            className="!w-[304px] flex items-center gap-5 mb-2 pl-[52px] !border-[#e0e0e9] font-normal !text-lg"
            variant="outlined"
          >
            <Image
              alt="sol"
              height={24}
              src="/icons/chains/solana.svg"
              width={24}
            />
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
