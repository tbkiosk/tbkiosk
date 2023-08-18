'use client'

import Link from 'next/link'
import { AppShell, Container, Button, ActionIcon, Select, Group, Burger } from '@mantine/core'
import Logo from 'public/logo_with_text.svg'

import classes from './index.module.css'

export default function Header() {
  return (
    <AppShell.Header withBorder={false}>
      <Container className={classes.container}>
        <Link
          className={classes.logo}
          href="/"
        >
          <Logo />
        </Link>
        <Select
          classNames={{
            root: classes['search-box-root'],
            input: classes['search-box-input'],
          }}
          data={['React', 'Angular', 'Vue', 'Svelte']}
          maw={480}
          placeholder="Search for collections, NFTs or users"
          rightSection={<i className="fa-solid fa-magnifying-glass" />}
          visibleFrom="sm"
          w={480}
          withCheckIcon={false}
        />
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
