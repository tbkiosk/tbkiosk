import { useContext, useMemo } from 'react'
import Head from 'next/head'
import { signIn } from 'next-auth/react'
import {
  AppShell,
  Container,
  Title,
  Grid,
  Flex,
  Card,
  Button,
  Text,
  Anchor,
  LoadingOverlay,
  Tooltip,
  Image,
  rem,
  useMantineColorScheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { cx } from 'classix'

import { UserProvider, UserContext } from '@/providers/user'

import { Header } from '@/components'

import { request } from '@/utils/request'
import { ellipsisMiddle } from '@/utils/address'

import type { Account } from '@prisma/client'
import type { AccountDeleteReq } from '@/pages/api/user/account'

const Settings = () => {
  const { colorScheme } = useMantineColorScheme()

  const { accounts, refetch } = useContext(UserContext)

  const { isLoading: isDisconnecting, mutate: disconnect } = useMutation({
    mutationFn: async (args: AccountDeleteReq) => {
      const { error, data } = await request<Account>({
        url: '/api/user/account',
        method: 'DELETE',
        params: {
          id: args.id,
        },
      })

      if (error) {
        throw new Error(error as string)
      }

      return data
    },
    onSuccess: account => {
      notifications.show({
        color: 'green',
        title: 'Success',
        message: `Successfully disconnected ${account?.providerAccountId}`,
      })
      refetch()
    },
    onError: error => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: (error as Error)?.message || 'Failed to connect new Ethereum address',
      })
    },
  })

  const walletAccounts = useMemo(() => accounts?.filter(_account => ['Ethereum', 'Sui'].includes(_account.provider)), [accounts])
  const twitterAccount = useMemo(() => accounts?.find(_account => _account.provider === 'twitter'), [accounts])
  const discordAccount = useMemo(() => accounts?.find(_account => _account.provider === 'discord'), [accounts])

  const onAddOrDisconnectDiscord = () => {
    if (discordAccount) {
      disconnect(discordAccount)
      return
    }

    signIn('discord', { callbackUrl: '/settings' })
  }

  const onAddOrDisconnectTwitter = () => {
    if (twitterAccount) {
      disconnect(twitterAccount)
      return
    }

    signIn('twitter', { callbackUrl: '/settings' })
  }

  return (
    <AppShell
      header={<Header />}
      padding="md"
    >
      <Container
        maw={rem(1440)}
        pt={rem(48)}
        px={rem(64)}
      >
        <Title order={4}>Manage your socials and wallets,</Title>
        <Title order={1}>Settings ⚙️</Title>
        <Grid
          gutter={rem(48)}
          mt={rem(48)}
        >
          <Grid.Col span={6}>
            <Card
              h="306px"
              mb={rem(48)}
              padding="xl"
              pos="relative"
              radius="lg"
              withBorder
            >
              <LoadingOverlay visible={isDisconnecting} />
              <Title
                mb={rem(40)}
                order={3}
              >
                Socials
              </Title>
              <Card
                mb={rem(32)}
                radius="lg"
                withBorder
              >
                <Flex align="center">
                  <i className="fa-brands fa-discord mr-4 text-xl text-[#7289da]" />
                  {discordAccount ? (
                    <Anchor
                      href="https://discord.com/app"
                      target="_blank"
                      truncate
                      w="100%"
                    >
                      @{discordAccount?.providerAccountName}
                    </Anchor>
                  ) : (
                    <Text
                      c="gray"
                      truncate
                      w="100%"
                    >
                      Add Discord
                    </Text>
                  )}
                  <Button
                    className="!bg-transparent"
                    onClick={() => onAddOrDisconnectDiscord()}
                    p={0}
                    variant="subtle"
                  >
                    {discordAccount ? 'Disconnect' : 'Add'}
                  </Button>
                </Flex>
              </Card>
              <Card
                radius="lg"
                withBorder
              >
                <Flex align="center">
                  <i className="fa-brands fa-x-twitter mr-4 text-xl text-[#1D9BF0]" />
                  {twitterAccount ? (
                    <Text
                      truncate
                      w="100%"
                    >
                      {twitterAccount?.providerAccountName}
                    </Text>
                  ) : (
                    <Text
                      c="gray"
                      truncate
                      w="100%"
                    >
                      Add Twitter
                    </Text>
                  )}
                  <Button
                    className="!bg-transparent"
                    onClick={() => onAddOrDisconnectTwitter()}
                    p={0}
                    variant="subtle"
                  >
                    {twitterAccount ? 'Disconnect' : 'Add'}
                  </Button>
                </Flex>
              </Card>
            </Card>
            <Card
              padding="xl"
              radius="lg"
              withBorder
            >
              <Title
                mb={rem(40)}
                order={3}
              >
                Connected wallets
              </Title>
              {walletAccounts?.map(_account => (
                <Card
                  key={_account.id}
                  mb={rem(32)}
                  radius="lg"
                  withBorder
                >
                  <Flex align="center">
                    <Image
                      alt={_account.provider}
                      className="shrink-0"
                      height={rem(24)}
                      mr={rem(16)}
                      radius="xl"
                      src={`/icons/chains/${_account.provider.toLocaleLowerCase()}.svg`}
                      width={rem(24)}
                    />
                    <Text
                      truncate
                      w="100%"
                    >
                      {ellipsisMiddle(_account.providerAccountId)}
                    </Text>
                    <Tooltip
                      disabled={!_account.isPrimary}
                      label="Primary wallet address cannot be disconnected"
                      position="top"
                      withArrow
                      withinPortal
                    >
                      <span>
                        <Button
                          className={cx('!bg-transparent', !!_account.isPrimary && colorScheme === 'dark' && '!text-gray-500')}
                          disabled={!!_account.isPrimary}
                          onClick={() => onAddOrDisconnectTwitter()}
                          p={0}
                          variant="subtle"
                        >
                          Disconnect
                        </Button>
                      </span>
                    </Tooltip>
                  </Flex>
                </Card>
              ))}
              <Button
                color={colorScheme === 'dark' ? 'pink.7' : 'pink.3'}
                fullWidth
                h={rem(48)}
                radius="md"
                variant="outline"
              >
                <Text
                  gradient={{ from: 'orange', to: 'pink', deg: 45 }}
                  variant="gradient"
                >
                  + Connect new wallet
                </Text>
              </Button>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card
              h="306px"
              padding="xl"
              radius="lg"
              withBorder
            >
              <Title
                mb={rem(40)}
                order={3}
              >
                Help centre 🚨
              </Title>
              <Text>Having trouble in Kiosk? Please contact us for more question.</Text>
              <Anchor href="">helpcenter@kiosk.xyz</Anchor>
              <Text size={rem(64)}>💌</Text>
              <Button
                h={rem(48)}
                radius="md"
                fullWidth
              >
                Contact us
              </Button>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </AppShell>
  )
}

const SettingsWrapper = () => {
  return (
    <>
      <Head>
        <title>Kiosk - Settings</title>
        <meta
          name="description"
          content="Kiosk settings"
        />
      </Head>
      <UserProvider>
        <Settings />
      </UserProvider>
    </>
  )
}

export default SettingsWrapper
