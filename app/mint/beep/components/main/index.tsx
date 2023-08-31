'use client'

import Link from 'next/link'
import { AppShell, Box, Image, Text, Title, Button, Group, Loader } from '@mantine/core'
import { cx } from 'classix'

import classes from './styles.module.css'
import { match } from 'ts-pattern'
import { BeepContractAddress, BeepTbaImplementationAddress } from '../../../../../constants/beep'
import { chain, explorer } from '../../../../../constants/chain'
import { useEffect, useState } from 'react'
import { TokenboundClient } from '@tokenbound/sdk'
import {
  ConnectWallet,
  useAddress,
  useChain,
  useConnectionStatus,
  useContract,
  useOwnedNFTs,
  useSigner,
  useSwitchChain,
  useTotalCirculatingSupply,
  useTotalCount,
  Web3Button,
} from '@thirdweb-dev/react'
import { notifications } from '@mantine/notifications'

const CONTRACT_ADDRESS = BeepContractAddress[chain.chainId]
const IMPLEMENTATION_ADDRESS = BeepTbaImplementationAddress[chain.chainId]

type ButtonStatus = 'Loading' | 'Deployed' | 'NotDeployed' | 'Error' | 'NoToken'

const useLastOwnedBeepTbaDeployedStatus = () => {
  const address = useAddress()
  const signer = useSigner()
  const { contract } = useContract(CONTRACT_ADDRESS)
  const { data, isLoading } = useOwnedNFTs(contract, address)
  const ownedNFTs = data?.map(nft => nft.metadata.id)
  const lastOwnedNFT = ownedNFTs?.[ownedNFTs.length - 1]
  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })
  const [accountDeployedStatus, setAccountDeployedStatus] = useState<ButtonStatus>('Loading')

  const checkAccountDeployment = async (tokenId: string) => {
    const tokenBoundAccount = tokenboundClient.getAccount({
      tokenContract: CONTRACT_ADDRESS,
      tokenId: tokenId,
      implementationAddress: IMPLEMENTATION_ADDRESS,
    })

    if (signer?.provider) {
      const contractByteCode = await signer.provider.getCode(tokenBoundAccount)
      if (contractByteCode === '0x') {
        setAccountDeployedStatus('NotDeployed')
      } else {
        setAccountDeployedStatus('Deployed')
      }
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (lastOwnedNFT) {
      checkAccountDeployment(lastOwnedNFT.toString()).catch(e => {
        console.error(e)
        setAccountDeployedStatus('Error')
      })
    } else {
      setAccountDeployedStatus('NoToken')
    }
  }, [lastOwnedNFT, isLoading])

  return {
    status: accountDeployedStatus,
    lastOwnedNFT,
    setAccountDeployedStatus,
  }
}

type ThirdWebError = {
  reason: string
}

const ActionButton = () => {
  const connectionStatus = useConnectionStatus()
  const [tokenId, setTokenId] = useState<null | string>(null)
  const signer = useSigner()
  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })
  const { status, lastOwnedNFT, setAccountDeployedStatus } = useLastOwnedBeepTbaDeployedStatus()
  const [isDeploying, setIsDeploying] = useState(false)
  const currentChain = useChain()
  const switchChain = useSwitchChain()

  const submit = async () => {
    if (currentChain?.chainId !== chain.chainId) {
      notifications.show({
        title: 'Error',
        message: `Please switch to ${chain.name} network`,
        color: 'red',
      })
      return switchChain(chain.chainId)
    }
    setIsDeploying(true)
    try {
      const tokenID = tokenId ?? lastOwnedNFT
      const tbaTransaction = await tokenboundClient.prepareCreateAccount({
        tokenContract: CONTRACT_ADDRESS,
        tokenId: tokenID ?? '',
        implementationAddress: IMPLEMENTATION_ADDRESS,
      })
      if (signer) {
        const tx = await signer.sendTransaction({
          data: tbaTransaction.data,
          value: tbaTransaction.value,
          to: tbaTransaction.to,
        })
        await tx.wait()
        setAccountDeployedStatus('Deployed')
        notifications.show({
          title: 'Success',
          message: `You have deployed token bound account for Beep #${tokenID}`,
          color: 'green',
        })
      }
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: (e as unknown as ThirdWebError)?.reason ?? 'Failed to deploy',
        color: 'red',
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const claimNftButton = (
    <Web3Button
      contractAddress={CONTRACT_ADDRESS}
      action={contract => contract.erc721.claim(1)}
      theme="dark"
      className={cx(classes.button)}
      onSuccess={data => {
        const tokenId = data[0].id.toNumber()
        setTokenId(tokenId.toString())
        setAccountDeployedStatus('NotDeployed')
        notifications.show({
          title: 'Success',
          message: `You have successfully minted Beep #${tokenId}`,
          color: 'green',
        })
      }}
      onError={e => {
        notifications.show({
          title: 'Error',
          message: (e as unknown as ThirdWebError).reason,
          color: 'red',
        })
      }}
    >
      Mint
    </Web3Button>
  )

  if (connectionStatus !== 'connected') {
    return (
      <ConnectWallet
        theme="light"
        btnTitle="Connect to Mint"
        className={cx(classes.button)}
      />
    )
  }

  return (
    <Box mt={10}>
      {match(status)
        .with('Loading', () => (
          <Button
            className={cx(classes.button, classes.button__hide_loading_overlay)}
            loading={true}
          />
        ))
        .with('Deployed', () => claimNftButton)
        .with('NotDeployed', () => (
          <Button
            onClick={submit}
            className={cx(classes.button, classes.button__hide_loading_overlay)}
            loading={isDeploying}
          >
            Deploy Token Bound Account
          </Button>
        ))
        .with('Error', () => <div>Something Went wrong while trying to fetch data</div>)
        .with('NoToken', () => claimNftButton)
        .exhaustive()}
    </Box>
  )
}

const SupplyInfo = () => {
  const { contract } = useContract(CONTRACT_ADDRESS)
  const { data: totalCirculatingSupply, isLoading: isTotalCirculatingSupplyLoading } = useTotalCirculatingSupply(contract)
  const { data: totalCount, isLoading: isTotalCountLoading } = useTotalCount(contract)

  if (isTotalCirculatingSupplyLoading || isTotalCountLoading)
    return (
      <Loader
        type="bars"
        color={'dark'}
        size={'sm'}
      />
    )

  return (
    <Text>
      <i className={cx('fa-solid fa-table-list', classes['num-icon'])} />
      <span>
        {totalCirculatingSupply?.toString()} of {totalCount?.toString()}
      </span>
    </Text>
  )
}

const maskAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const openContractInExplorer = (address: string) => {
  const explorerBase = explorer[chain.chainId]
  window.open(`${explorerBase}/address/${address}`, '_blank')
}

export default function Main() {
  return (
    <AppShell.Main className={classes.main}>
      <Box className={classes.container}>
        <Link
          className={classes.link}
          href="/projects"
        >
          <i className={cx('fa-solid fa-chevron-left', classes['back-icon'])} />
          Back to home page
        </Link>
        <Box className={classes['mint-container']}>
          <Image
            alt="beep"
            className={classes['beep-image']}
            src="/beep.jpg"
          />
          <Box className={classes['mint-info-container']}>
            <Group>
              <Box
                className={classes['address-row']}
                onClick={() => openContractInExplorer(CONTRACT_ADDRESS)}
              >
                <i className="fa-brands fa-hashnode" />
                <Text fw={500}>{maskAddress(CONTRACT_ADDRESS)}</Text>
              </Box>
            </Group>
            <Box className={classes['name-row']}>
              <Title className={classes.name}>BEEP BOT</Title>
            </Box>
            <Box className={classes['mint-status-row']}>Available to mint</Box>
            <Box className={classes['mint-info-row']}>
              <Box className={classes['mint-price-col']}>
                <Text className={classes.lable}>Mint Price</Text>
                <Box className={classes['mint-price-row']}>
                  <Box className={classes['coin-box']}>
                    <i className={cx('fa-brands fa-ethereum', classes.coin)} />
                  </Box>
                  <Text className={classes['mint-price']}>Free</Text>
                </Box>
              </Box>
            </Box>
            <ActionButton />
          </Box>
        </Box>
        <Box className={classes['detail-container']}>
          <Box className={classes['details-col']}>
            <Box className={classes['about-row']}>
              <Title className={classes.about}>Supply</Title>
            </Box>
            <Box className={classes['num-row']}>
              <SupplyInfo />
            </Box>
          </Box>
          <Box className={classes['desc-col']}>
            <Box className={classes['beep']}>
              <Image
                alt="beep"
                className={classes['beep-logo']}
                src="/beep-logo.jpg"
              />
              <Text fw={500}>BEEP BOT</Text>
            </Box>
            <Box
              className={classes.desc}
              fw={500}
            >
              <Text>
                Beep is your personal trading companion and a new take on what&apos;s possible with ERC 6551 smart NFTs. Brought to you by
                Kiosk, Beep is a revolutionary experiment that combines the power of NFTs, DeFi, and smart account into one seamless
                experience.
              </Text>
              <Text mt={'md'}>
                Beep is an automated trading bot designed to Dollar Cost Averaging (DCA) stable coins into WETH (Wrapped ETH). DCA is a
                time-tested investment approach that involves making regular purchases over time, smoothing out the impact of price
                volatility.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppShell.Main>
  )
}
