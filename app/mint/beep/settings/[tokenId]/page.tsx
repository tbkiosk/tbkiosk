'use client'

import Link from 'next/link'
import { AppShell, Container, Box, Image, Text, Switch, CopyButton, Button } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'classix'

import classes from './styles.module.css'

export default function BeepSettingsByTokenId({ params }: { params: { tokenId: string } }) {
  useQuery<{ name: string; description: string; image: string }>({
    enabled: false,
    queryKey: ['token-meta'],
    queryFn: async () => {
      const res = await fetch(`https://unitba-249bfef801d8.herokuapp.com/api/meta/${params.tokenId}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const projects = await res.json()
      return projects
    },
  })

  return (
    <AppShell.Main className={classes.main}>
      <Container className={classes.container}>
        <Box className={classes['link-container']}>
          <Link
            className={classes.link}
            href="/mint/beep/settings"
          >
            <i className={cx('fa-solid fa-chevron-left', classes['back-icon'])} />
            Back
          </Link>
        </Box>
        <Box className={classes['content-container']}>
          <Image
            alt={`${params.tokenId}`}
            className={classes['nft-image']}
            src="https://a2dd426a5110548f73e8108c2ddfcd30.ipfscdn.io/ipfs/bafybeicrp3pe7b2xcxiiher6e4v5pl427yrsnmsn3a67aej73pwo63ymue/beep.png"
          />
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
              <Text className={classes.no}>Beep #123</Text>
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
      </Container>
    </AppShell.Main>
  )
}
