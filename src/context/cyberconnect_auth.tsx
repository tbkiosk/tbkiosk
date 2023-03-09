import { ReactNode, createContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Web3Provider, ExternalProvider } from '@ethersproject/providers'
import detectEthereumProvider from '@metamask/detect-provider'

type PrimaryProfile = {
  profileID: number
  handle: string
  avatar: string
  metadata: string
}

type CyberConnectAuthContextType = {
  address: string | undefined
  accessToken: string | undefined
  primaryProfile: PrimaryProfile | undefined
  setAddress: (address: string | undefined) => void
  setAccessToken: (accessToken: string | undefined) => void
  setPrimaryProfile: (primaryProfile: PrimaryProfile | undefined) => void
  connectWallet: () => Promise<Web3Provider>
  checkNetwork: (provider: Web3Provider) => Promise<void>
}

export const CyberConnectAuthContext = createContext<CyberConnectAuthContextType>({
  address: undefined,
  accessToken: undefined,
  primaryProfile: undefined,
  setAddress: () => undefined,
  setAccessToken: () => undefined,
  setPrimaryProfile: () => undefined,
  connectWallet: async () => new Promise(() => undefined),
  checkNetwork: async () => new Promise(() => undefined),
})

export const CyberConnectAuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<Web3Provider | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
  const [primaryProfile, setPrimaryProfile] = useState<PrimaryProfile | undefined>(undefined)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const address = localStorage.getItem('address')

    if (accessToken && address) {
      setAccessToken(accessToken)
      setAddress(address)
    }
  }, [])

  useEffect(() => {
    /* Check if the user connected with wallet */
    if (!(provider && address)) return

    try {
      /* Function to check if the network is the correct one */
      checkNetwork(provider)
    } catch (error) {
      /* Display error message */
      console.error((error as Error)?.message)
    }
  }, [provider, address])

  /* Function to connect with MetaMask wallet */
  const connectWallet = async () => {
    try {
      /* Function to detect most providers injected at window.ethereum */
      const detectedProvider = (await detectEthereumProvider()) as ExternalProvider

      /* Check if the Ethereum provider exists */
      if (!detectedProvider) {
        throw new Error('Please install MetaMask!')
      }

      /* Ethers Web3Provider wraps the standard Web3 provider injected by MetaMask */
      const web3Provider = new ethers.providers.Web3Provider(detectedProvider)

      /* Connect to Ethereum. MetaMask will ask permission to connect user accounts */
      await web3Provider.send('eth_requestAccounts', [])

      /* Get the signer from the provider */
      const signer = web3Provider.getSigner()

      /* Get the address of the connected wallet */
      const address = await signer.getAddress()

      /* Set the providers in the state variables */
      setProvider(web3Provider)

      /* Set the address in the state variable */
      setAddress(address)
      localStorage.setItem('address', address)

      return web3Provider
    } catch (error) {
      console.error(error)

      throw error
    }
  }

  /* Function to check if the network is the correct one */
  const checkNetwork = async (provider: Web3Provider) => {
    try {
      /* Get the network from the provider */
      const network = await provider.getNetwork()

      /* Check if the network is the correct one */
      if (network.chainId !== (Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 0)) {
        /* Switch network if the chain id doesn't correspond to Goerli Testnet Network */
        await provider.send('wallet_switchEthereumChain', [
          {
            chainId: '0x' + Number(process.env.NEXT_PUBLIC_CHAIN_ID)?.toString(16),
          },
        ])

        /* Trigger a page reload */
        window.location.reload()
      }
    } catch (error) {
      /* This error code indicates that the chain has not been added to MetaMask */
      if ((error as { code?: number })?.code === 4902) {
        await provider.send('wallet_addEthereumChain', [
          {
            chainId: '0x' + Number(process.env.NEXT_PUBLIC_CHAIN_ID)?.toString(16),
            rpcUrls: ['https://goerli.infura.io/v3/'],
          },
        ])

        window.location.reload()
      } else {
        /* Throw the error */
        throw error
      }
    }
  }

  return (
    <CyberConnectAuthContext.Provider
      value={{
        address,
        accessToken,
        primaryProfile,
        setAddress,
        setAccessToken,
        setPrimaryProfile,
        checkNetwork,
        connectWallet,
      }}
    >
      {children}
    </CyberConnectAuthContext.Provider>
  )
}
