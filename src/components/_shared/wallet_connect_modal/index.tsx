import Image from 'next/image'

import { Modal, Button } from '@/components'

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
            className="!w-[304px] flex justify-center items-center gap-2 mb-2 !border-[#e0e0e9]"
            variant="outlined"
          >
            Ethereum Wallet
          </Button>
          <Button
            className="!w-[304px] flex justify-center items-center gap-2 mb-2 !border-[#e0e0e9]"
            variant="outlined"
          >
            Sui Wallet
          </Button>
          <Button
            className="!w-[304px] flex justify-center items-center gap-2 mb-2 !border-[#e0e0e9]"
            variant="outlined"
          >
            Solana Wallet
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default WalletConnectModal
