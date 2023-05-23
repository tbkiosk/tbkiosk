import { Avatar } from '@/components'

export const HandpickedProject = () => {
  return (
    <div className="py-8 px-10 rounded-3xl shadow-[0px_4px_10px_rgba(222,222,222,0.44)]">
      <div className="mb-1 flex items-center">
        <Avatar
          src={'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025'}
          alt={'logo'}
          size={'medium'}
          className="mr-4"
        />
        <p className="text-2xl font-bold">Loots</p>
      </div>
      <p className="text-lg text-[#9A9696] mb-10 font-medium">Because you hold Isekai Meta</p>
      <p className="text-xl">
        Doodles 2 lets anyone create a uniquely personalized and endlessly customizable character in the one-of-a-kind style from artist
        Burnt Toast.
      </p>
      <div className="mb-12 p-4 border border-[#d8dadc] rounded-xl mt-10">
        <p className="text opacity-50">
          Loot (for Adventurers) may be interesting for anyone who wants to join a unique group of NFT owners who value the community,
          creativity and excitement of growing an early-stage open-source project. The project’s pure simplicity and its element of
          nostalgia has excited the crypto space in a truly unique way.
        </p>
      </div>
      <button className="py-3 px-10 border border-black rounded-3xl font-semibold">View the community</button>
    </div>
  )
}
