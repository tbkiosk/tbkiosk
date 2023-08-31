'use client'

import { useEffect } from 'react'
import { AppShell, Box, Container, Title, LoadingOverlay, Image } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useChainId, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'

import { BeepContractAddress } from 'constants/beep'

import classes from './styles.module.css'

export default function BeepSettingsMain() {
  const chainId = useChainId()

  return (
    <AppShell.Main className={classes.main}>
      <Container className={classes.container}>
        <Title className={classes.title}>My Beeps</Title>
        {chainId && <Beeps chainId={chainId} />}
      </Container>
    </AppShell.Main>
  )
}

function Beeps({ chainId }: { chainId: number }) {
  const address = useAddress()
  const { contract } = useContract(BeepContractAddress[chainId])
  const { data, isLoading, error } = useOwnedNFTs(contract, address)

  useEffect(() => {
    if (error) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: (error as Error)?.message || 'Failed to load NFTs',
      })
    }
  }, [error])

  return (
    <Box
      className={classes['beeps-container']}
      pos="relative"
    >
      <LoadingOverlay
        overlayProps={{ backgroundOpacity: 0 }}
        visible={isLoading}
      />
      {data?.map(_nft => (
        <Image
          alt={`${_nft.metadata.name}`}
          className={classes['nft-image']}
          key={_nft.metadata.id}
          src={_nft.metadata.image}
        />
      ))}
    </Box>
  )
}
