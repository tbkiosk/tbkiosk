'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell, Box, Container, Title, LoadingOverlay } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useChainId, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { cx } from 'classix'

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
        loaderProps={{
          color: 'rgba(0, 231, 166, 1)',
        }}
        overlayProps={{ backgroundOpacity: 0 }}
        visible={isLoading}
      />
      {data?.map(_nft => (
        <div
          className={classes['nft-iframe-container']}
          key={_nft.metadata.id}
        >
          <Link
            className={classes['nft-link']}
            href={`/mint/beep/settings/${_nft.metadata.id}`}
          />
          <BeepIframe
            className={classes['beep-iframe']}
            src={`https://beep-iframe.vercel.app/${BeepContractAddress[chainId]}/${chainId}/${_nft.metadata.id}`}
          />
        </div>
      ))}
    </Box>
  )
}

export function BeepIframe({ src, className }: { src: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={classes['iframe-wrapper']}>
      <LoadingOverlay
        loaderProps={{
          color: 'rgba(0, 231, 166, 1)',
        }}
        overlayProps={{ backgroundOpacity: 0 }}
        visible={!loaded}
      />
      <iframe
        className={cx(classes.iframe, loaded && classes['iframe-loaded'], className)}
        onLoad={() => setLoaded(true)}
        src={src}
      />
    </div>
  )
}
