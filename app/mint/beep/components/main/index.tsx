'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell, Box, Image, Text, Title, Button, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
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
  Web3Button,
} from '@thirdweb-dev/react'
import { match } from 'ts-pattern'
import { cx } from 'classix'

import { BeepContractAddress, BeepTbaImplementationAddress } from 'constants/beep'
import { chain, explorer } from 'constants/chain'

import { maskAddress } from 'utils/address'

import classes from './styles.module.css'

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

const openContractInExplorer = (address: string) => {
  const explorerBase = explorer[chain.chainId]
  window.open(`${explorerBase}/address/${address}`, '_blank')
}

const Category = ({ label }: { label: string }) => <Box className={classes.category}>{label}</Box>

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
              <Title className={classes.about}>ABOUT BEEP BOT</Title>
            </Box>
            <Group gap={8}>
              <Category label={'DeFi'} />
              <Category label={'Smart NFT'} />
              <Category label={'Bot'} />
            </Group>
            <Box
              mt={48}
              className={classes['contract-info']}
            >
              <Group className={classes['contract-info-item']}>
                <Text className={classes['contract-info-label']}>Contract address</Text>
                <Group
                  gap={4}
                  style={{ cursor: 'pointer' }}
                >
                  <Text className={classes['contract-info-value']}>0x1234...0872</Text>
                  <svg
                    width="14"
                    height="15"
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_4001_6273)">
                      <path
                        d="M4.08333 3.99935V2.24935C4.08333 2.09464 4.14479 1.94627 4.25419 1.83687C4.36358 1.72747 4.51196 1.66602 4.66667 1.66602H11.6667C11.8214 1.66602 11.9697 1.72747 12.0791 1.83687C12.1885 1.94627 12.25 2.09464 12.25 2.24935V10.416C12.25 10.5707 12.1885 10.7191 12.0791 10.8285C11.9697 10.9379 11.8214 10.9993 11.6667 10.9993H9.91667V12.7493C9.91667 13.0713 9.65417 13.3327 9.32925 13.3327H2.33742C2.26049 13.3331 2.18423 13.3184 2.11302 13.2893C2.04181 13.2602 1.97705 13.2173 1.92247 13.1631C1.86788 13.1089 1.82455 13.0444 1.79495 12.9734C1.76535 12.9024 1.75008 12.8263 1.75 12.7493L1.75175 4.58268C1.75175 4.26068 2.01425 3.99935 2.33917 3.99935H4.08333ZM2.91842 5.16602L2.91667 12.166H8.75V5.16602H2.91842ZM5.25 3.99935H9.91667V9.83268H11.0833V2.83268H5.25V3.99935Z"
                        fill="black"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4001_6273">
                        <rect
                          width="14"
                          height="14"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </Group>
              </Group>
              <Group className={classes['contract-info-item']}>
                <Text className={classes['contract-info-label']}>Blockchain</Text>
                <Text className={classes['contract-info-value']}>Polygon</Text>
              </Group>
              <Group className={classes['contract-info-item']}>
                <Text className={classes['contract-info-label']}>Token standard</Text>
                <Text className={classes['contract-info-value']}>ERC-6551</Text>
              </Group>
              <Group className={classes['contract-info-item']}>
                <Text className={classes['contract-info-label']}>Supply</Text>
                <Text className={classes['contract-info-value']}>1,000</Text>
              </Group>
            </Box>
          </Box>
          <Box className={classes['desc-col']}>
            <Box className={classes['beep']}>
              <Image
                alt="beep"
                className={classes['beep-logo']}
                src="/beep-avatar.jpg"
              />
              <Text fw={500}>BEEP BOT</Text>
            </Box>
            <Box className={classes.desc}>
              <Text>
                Beep is Dollar-cost averaging (DCA) bot with a token-bound account. In a volatile market, Beep is your reliable companion,
                helping you navigate fluctuations by strategically spreading your purchases across different price levels. Say goodbye to
                emotional trading decisions and start accumulating with confidence.
              </Text>
              <Text mt={'md'}>Beep is a new take on what&apos;s possible with ERC 6551 smart NFTs. Brought to you by Kiosk.</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppShell.Main>
  )
}
