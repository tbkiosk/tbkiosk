'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'

import CopyButton from '@/components/copy_button'

import { maskAddress } from '@/utils/address'

const DepositButton = ({ tokenId, tbaAddresss }: { tokenId: string; tbaAddresss: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button
        className="w-[172px] px-8 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1]"
        onClick={onOpen}
      >
        Deposit
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
      >
        <ModalContent className="bg-black text-white">
          {() => (
            <>
              <ModalHeader className="justify-center text-2xl">Deposit to your Beep account</ModalHeader>
              <ModalBody className="px-8 pb-8">
                <div className="flex justify-center">
                  <svg
                    width="99"
                    height="99"
                    viewBox="0 0 99 99"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M41.5 4.6188C46.4504 1.76068 52.5496 1.76068 57.5 4.6188L84.3683 20.1312C89.3187 22.9893 92.3683 28.2714 92.3683 33.9876V65.0124C92.3683 70.7286 89.3187 76.0107 84.3683 78.8688L57.5 94.3812C52.5496 97.2393 46.4504 97.2393 41.5 94.3812L14.6317 78.8688C9.68132 76.0107 6.63174 70.7286 6.63174 65.0124V33.9876C6.63174 28.2714 9.68133 22.9893 14.6317 20.1312L41.5 4.6188Z"
                      fill="#E4FDF3"
                    />
                    <path
                      d="M44.8462 24.5391H45.6923V32.1544H44.8462V24.5391Z"
                      fill="#6A868E"
                    />
                    <path
                      d="M44.8461 69.3855H27.3202C25.319 69.3855 23.6923 67.8316 23.6923 65.9069V34.7873C23.6923 32.8684 25.3129 31.3086 27.3202 31.3086H44.8461V69.3855Z"
                      fill="#57A5AA"
                    />
                    <path
                      d="M44.8462 31.3086H62.3721C64.3733 31.3086 66 32.8625 66 34.7873V65.9069C66 67.8257 64.3794 69.3855 62.3721 69.3855H44.8462V31.3086Z"
                      fill="#368F9C"
                    />
                    <path
                      d="M49.0769 44.4225C49.0769 45.2079 49.4335 45.9612 50.0682 46.5166C50.703 47.072 51.5639 47.384 52.4615 47.384C53.3592 47.384 54.2201 47.072 54.8548 46.5166C55.4895 45.9612 55.8461 45.2079 55.8461 44.4225C55.8461 43.637 55.4895 42.8837 54.8548 42.3284C54.2201 41.773 53.3592 41.4609 52.4615 41.4609C51.5639 41.4609 50.703 41.773 50.0682 42.3284C49.4335 42.8837 49.0769 43.637 49.0769 44.4225Z"
                      fill="white"
                    />
                    <path
                      d="M33.8462 44.4225C33.8462 45.2079 34.2028 45.9612 34.8375 46.5166C35.4723 47.072 36.3332 47.384 37.2308 47.384C38.1285 47.384 38.9894 47.072 39.6241 46.5166C40.2588 45.9612 40.6154 45.2079 40.6154 44.4225C40.6154 43.637 40.2588 42.8837 39.6241 42.3284C38.9894 41.773 38.1285 41.4609 37.2308 41.4609C36.3332 41.4609 35.4723 41.773 34.8375 42.3284C34.2028 42.8837 33.8462 43.637 33.8462 44.4225Z"
                      fill="white"
                    />
                    <path
                      d="M42.3077 24.1139C42.3077 24.8993 42.6198 25.6526 43.1752 26.208C43.7306 26.7634 44.4838 27.0754 45.2693 27.0754C46.0547 27.0754 46.808 26.7634 47.3634 26.208C47.9188 25.6526 48.2308 24.8993 48.2308 24.1139C48.2308 23.3284 47.9188 22.5752 47.3634 22.0198C46.808 21.4644 46.0547 21.1523 45.2693 21.1523C44.4838 21.1523 43.7306 21.4644 43.1752 22.0198C42.6198 22.5752 42.3077 23.3284 42.3077 24.1139Z"
                      fill="#6A868E"
                    />
                    <path
                      d="M23.5973 54.1523L20.3077 52.5583V44.9222L23.5973 43.2109V54.1523ZM65.249 43.1523L68.5385 44.7522V52.3825L65.249 54.0937V43.1523Z"
                      fill="#506F78"
                    />
                    <g clipPath="url(#clip0_4437_5265)">
                      <path
                        d="M65.5769 52.4609C69.0553 52.4609 72.3913 53.8427 74.8509 56.3023C77.3105 58.762 78.6923 62.0979 78.6923 65.5763C78.6923 69.0547 77.3105 72.3907 74.8509 74.8503C72.3913 77.3099 69.0553 78.6917 65.5769 78.6917C62.0985 78.6917 58.7626 77.3099 56.303 74.8503C53.8433 72.3907 52.4615 69.0547 52.4615 65.5763C52.4615 62.0979 53.8433 58.762 56.303 56.3023C58.7626 53.8427 62.0985 52.4609 65.5769 52.4609Z"
                        fill="white"
                      />
                      <path
                        opacity="0.9"
                        d="M65.5769 55.0859C68.3596 55.0859 71.0284 56.1914 72.9961 58.1591C74.9638 60.1268 76.0692 62.7955 76.0692 65.5782C76.0692 68.361 74.9638 71.0297 72.9961 72.9974C71.0284 74.9651 68.3596 76.0706 65.5769 76.0706C62.7942 76.0706 60.1254 74.9651 58.1577 72.9974C56.19 71.0297 55.0846 68.361 55.0846 65.5782C55.0846 62.7955 56.19 60.1268 58.1577 58.1591C60.1254 56.1914 62.7942 55.0859 65.5769 55.0859Z"
                        fill="#07EA7D"
                      />
                      <path
                        d="M71.916 63.1543L64.6845 69.8983L64.4706 70.0838L64.2566 69.8983L59.7759 65.7282L61.2369 64.3682L64.4706 67.3749L70.4795 61.7773L71.916 63.1543Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4437_5265">
                        <rect
                          width="26.2308"
                          height="26.2308"
                          fill="white"
                          transform="translate(52.4615 52.4609)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="my-2 font-medium text-xl text-center">
                  The wallet address for Beep #{tokenId} is <span className="text-[#a6a9ae]">{maskAddress(tbaAddresss)}</span>
                </p>
                <p className="font-medium text-xl text-center">Make sure you deposit USDC on Polygon network only</p>
              </ModalBody>
              <ModalFooter className="justify-center mb-4">
                <CopyButton
                  className="px-8 py-1 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1] hover:text-black"
                  copyText={tbaAddresss}
                >
                  Copy Beep address
                </CopyButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default DepositButton
