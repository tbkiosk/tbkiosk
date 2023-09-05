'use client'

import Link from 'next/link'
import { AppShell, Container, Box, Image, Text, Switch, CopyButton, Button, LoadingOverlay } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'classix'

import { useOwnedBeepTbaDeployedStatus } from 'hooks/use_owned_beep_tba_deployed_status'

import classes from './styles.module.css'

export default function BeepSettingsByTokenId({ params }: { params: { tokenId: string } }) {
  const { data: meta, isLoading } = useQuery<{ name: string; description: string; image: string }>({
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

  useOwnedBeepTbaDeployedStatus({ tokenId: params.tokenId })

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
                <Switch
                  className={classes.switch}
                  color="rgba(0, 231, 166, 1)"
                  size="lg"
                />
              </Box>
              <Box className={classes['description-row']}>
                <Text className={classes.no}>{meta.name}</Text>
                <CopyButton value="https://mantine.dev">
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
                      0x12346...09822
                    </Button>
                  )}
                </CopyButton>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </AppShell.Main>
  )
}
