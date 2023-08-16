'use client'

import Link from 'next/link'
import { AppShell, Container, Button, ActionIcon, Select, Group } from '@mantine/core'
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
          >
            <i className="fa-brands fa-x-twitter" />
          </ActionIcon>
        </Group>
      </Container>
    </AppShell.Header>
  )
}
