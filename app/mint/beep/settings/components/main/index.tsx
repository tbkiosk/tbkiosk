'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AppShell, Box, Container, Title, LoadingOverlay, Image, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useChainId, useAddress, useContract, useOwnedNFTs, useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'classix'

import { BeepContractAddress, CONTRACT_ADDRESS } from 'constants/beep'
import { chain } from 'constants/chain'

import { useOwnedBeepTbaDeployedStatus } from 'hooks/use_owned_beep_tba_deployed_status'

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
        <Link
          className={classes['nft-image-container']}
          href={`/mint/beep/settings/${_nft.metadata.id}`}
          key={_nft.metadata.id}
        >
          <AccountInfo tokenId={_nft.metadata.id} />
          <Image
            alt={`${_nft.metadata.name}`}
            className={classes['nft-image']}
            src={_nft.metadata.image}
          />
        </Link>
      ))}
    </Box>
  )
}

function AccountInfo({ tokenId }: { tokenId: string }) {
  const { status } = useOwnedBeepTbaDeployedStatus({ tokenId })
  const signer = useSigner()

  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })

  if (status !== 'Deployed') return null

  const tokenBoundAccount = tokenboundClient.getAccount({
    tokenContract: CONTRACT_ADDRESS,
    tokenId,
  })

  return (
    <Box className={classes['account-info-container']}>
      <Text className={cx(classes['account-info-text'], classes.id)}>
        <Text component="span">#</Text>
        {tokenId}
      </Text>
      <AccountStatus tokenBoundAccount={tokenBoundAccount} />
    </Box>
  )
}

function AccountStatus({ tokenBoundAccount }: { tokenBoundAccount: string }) {
  const { data: profile, isLoading } = useQuery<{ name: string; description: string; image: string }>({
    enabled: false,
    queryKey: ['token-bound-account-profile'],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tokenBoundAccount}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const projects = await res.json()
      return projects
    },
  })

  if (isLoading) return null

  return (
    <Image
      alt="switch"
      className={classes['switch-icon']}
      src={profile ? '/icons/beep-bot-on.svg' : '/icons/beep-bot-off.svg'}
    />
  )
}
