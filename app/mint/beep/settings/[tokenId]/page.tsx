'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AppShell, Container, Box, Image, Text, Switch, CopyButton, Button, LoadingOverlay, Loader } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'
import { useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { match } from 'ts-pattern'
import { cx } from 'classix'

import Undeployed from './components/undeployed'
import Deployed from './components/deployed'

import { useOwnedBeepTbaDeployedStatus } from 'hooks/use_owned_beep_tba_deployed_status'
import { maskAddress } from 'utils/address'

import { CONTRACT_ADDRESS, IMPLEMENTATION_ADDRESS } from 'constants/beep'
import { chain } from 'constants/chain'

import classes from './styles.module.css'

import type { Profile } from 'types/profile'

export default function BeepSettingsByTokenId({ params }: { params: { tokenId: string } }) {
  const { status } = useOwnedBeepTbaDeployedStatus({ tokenId: params.tokenId })
  const [isAccountUpdating, setIsAccountUpdating] = useState(false)

  const {
    data: meta,
    isLoading,
    error,
  } = useQuery<{ name: string; description: string; image: string }>({
    enabled: !!params.tokenId,
    queryKey: ['token-meta'],
    queryFn: async () => {
      const res = await fetch(`/api/beep/${params.tokenId}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const projects = await res.json()
      return projects
    },
  })

  const signer = useSigner()

  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })

  const tbaAddresss = useMemo(() => {
    return tokenboundClient.getAccount({
      tokenContract: CONTRACT_ADDRESS,
      tokenId: params.tokenId ?? '',
      implementationAddress: IMPLEMENTATION_ADDRESS,
    })
  }, [params.tokenId])

  const {
    data: profile,
    isFetching: isProfileLoading,
    error: profileError,
    refetch,
  } = useQuery<Profile>({
    enabled: !!params.tokenId && status === 'Deployed',
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-profile'],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddresss}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const profile = await res.json()

      return profile
    },
  })

  const onUpdateStatus = async () => {
    setIsAccountUpdating(true)

    try {
      const res = await fetch(`/api/beep/profile/${tbaAddresss}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          ID: tbaAddresss,
          IS_ACTIVE: !profile?.user.IS_ACTIVE,
        }),
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const response = await res.json()
      if (response?.user) {
        notifications.show({
          title: 'Success',
          message: 'Successfully updated account',
          color: 'green',
        })

        refetch()
      }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: (error as Error)?.message || 'Failed to update account',
        color: 'red',
      })
    } finally {
      setIsAccountUpdating(false)
    }
  }

  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'Error',
        message: (error as Error)?.message || 'Failed to load NFT meta',
        color: 'red',
      })
    }

    if (profileError) {
      notifications.show({
        title: 'Error',
        message: (error as Error)?.message || 'Failed to load account profile',
        color: 'red',
      })
    }
  }, [error, profileError])

  return (
    <AppShell.Main className={classes.main}>
      <Container className={classes.container}>
        <LoadingOverlay
          overlayProps={{ backgroundOpacity: 0 }}
          visible={isLoading}
        />
        <Box className={classes['link-container']}>
          <Link
            className={classes.link}
            href="/mint/beep/settings"
          >
            <i className={cx('fa-solid fa-chevron-left', classes['back-icon'])} />
            Back
          </Link>
        </Box>
        {meta && (
          <Box className={classes['content-container']}>
            <Box className={classes['nft-image-container']}>
              <Image
                alt={`${meta.name}`}
                className={classes['nft-image']}
                src={meta.image}
              />
            </Box>
            <Box className={classes['settings-container']}>
              <Box className={classes['title-row']}>
                <Text
                  className={classes.title}
                  truncate
                >
                  Set up your Beep
                </Text>
                {status === 'Deployed' && tbaAddresss && profile && (
                  <Switch
                    className={classes.switch}
                    checked={profile.user.IS_ACTIVE}
                    color="rgba(0, 231, 166, 1)"
                    disabled={isAccountUpdating}
                    onChange={() => onUpdateStatus()}
                    size="lg"
                    thumbIcon={
                      isAccountUpdating || isProfileLoading ? (
                        <Loader
                          color="rgba(0, 231, 166, 1)"
                          size={10}
                        />
                      ) : null
                    }
                  />
                )}
              </Box>
              <Box className={classes['description-row']}>
                <Text className={classes.no}>{meta.name}</Text>
                {status === 'Deployed' && tbaAddresss && (
                  <CopyButton value={tbaAddresss}>
                    {({ copy, copied }) => (
                      <Button
                        className={classes['copy-button']}
                        color="rgba(166, 169, 174, 1)"
                        onClick={copy}
                        radius="xl"
                        rightSection={copied ? <i className="fa-solid fa-check" /> : <i className="fa-regular fa-copy" />}
                        size="xs"
                        variant="outline"
                      >
                        {maskAddress(tbaAddresss)}
                      </Button>
                    )}
                  </CopyButton>
                )}
              </Box>
              <Box className={classes['profile-container']}>
                <LoadingOverlay
                  overlayProps={{ backgroundOpacity: 0 }}
                  visible={isProfileLoading}
                />
                {match(status)
                  .with('Deployed', () => {
                    return <Deployed tbaAddresss={tbaAddresss} />
                  })
                  .with('NotDeployed', () => (
                    <Undeployed
                      tbaAddresss={tbaAddresss}
                      tokenId={params.tokenId}
                    />
                  ))
                  .with('Loading', () => (
                    <LoadingOverlay
                      overlayProps={{ backgroundOpacity: 0 }}
                      visible
                    />
                  ))
                  .otherwise(() => (
                    <h1>error</h1>
                  ))}
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </AppShell.Main>
  )
}

// function CreateAccountButton({ tbaAddresss, refetch }: { tbaAddresss: string; refetch: () => Promise<unknown> }) {
//   const [creating, setCreating] = useState(false)

//   const onCreateAccount = async () => {
//     try {
//       setCreating(true)

//       const res = await fetch(`/api/beep/profile/${tbaAddresss}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: null,
//       })

//       if (!res.ok) {
//         throw new Error(res.statusText)
//       }

//       refetch()
//     } catch (error) {
//       notifications.show({
//         title: 'Error',
//         message: (error as Error)?.message || 'Failed to create account',
//         color: 'red',
//       })
//     } finally {
//       setCreating(false)
//     }
//   }

//   return (
//     <Button
//       color="rgba(255, 255, 255, 1)"
//       loading={creating}
//       onClick={() => onCreateAccount()}
//       radius="xl"
//       variant="outline"
//     >
//       Create account
//     </Button>
//   )
// }
