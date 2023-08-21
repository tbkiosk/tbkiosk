'use client'

import Link from 'next/link'
import { AppShell, Container, Button, ActionIcon, Group, Burger } from '@mantine/core'

import SearchBox from './components/search_box'
import Logo from 'public/logo_with_text.svg'

import classes from './styles.module.css'

export default function Header() {
  return (
    <AppShell.Header
      withBorder={false}
      zIndex={1500}
    >
      <Container className={classes.container}>
        <Link
          className={classes.logo}
          href="/"
        >
          <Logo />
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
            visibleFrom="sm"
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
          <Burger
            hiddenFrom="sm"
            size="sm"
          />
        </Group>
      </Container>
    </AppShell.Header>
  )
}
