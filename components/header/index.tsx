'use client'

import Link from 'next/link'
import { AppShell, Container, Button, ActionIcon, Group, Box } from '@mantine/core'

import SearchBox from './components/search_box'
import LogoWithText from 'public/logo_with_text.svg'
import Logo from 'public/logo.svg'

import classes from './styles.module.css'

export default function Header() {
  return (
    <AppShell.Header
      withBorder={false}
      zIndex={1500}
    >
      <Container className={classes.container}>
        <Link
          className={classes['logo-container']}
          href="/"
        >
          <Box
            className={classes['logo-wrapper']}
            visibleFrom="sm"
          >
            <LogoWithText />
          </Box>
          <Box
            className={classes['logo-wrapper']}
            hiddenFrom="sm"
          >
            <Logo />
          </Box>
        </Link>
        <SearchBox />
        <Group className={classes['links-container']}>
          <Button
            aria-label="list-project"
            color="gray"
            component="a"
            href="https://creator.tbkiosk.xyz"
            radius="md"
            rel="noreferrer"
            size="sm"
            target="_blank"
            variant="default"
          >
            List a Project
          </Button>
          <ActionIcon
            aria-label="x-link"
            color="gray"
            component="a"
            href="https://twitter.com/tbkiosk"
            radius="md"
            rel="noreferrer"
            size={36}
            target="_blank"
            variant="default"
            visibleFrom="sm"
          >
            <i className="fa-brands fa-x-twitter" />
          </ActionIcon>
        </Group>
      </Container>
    </AppShell.Header>
  )
}
