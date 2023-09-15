import { useEffect, useState } from 'react'
import { Box, Text, Button, Image, Select, NumberInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'classix'

import classes from './styles.module.css'
import { notifications } from '@mantine/notifications'

import type { Profile } from 'types/profile'

export default function Deployed({ tbaAddresss }: { tbaAddresss: string }) {
  const {
    data: profile,
    isFetching: isProfileLoading,
    error: profileError,
    refetch,
  } = useQuery<Profile | { status: number; message: string }>({
    enabled: !!tbaAddresss,
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

  const [amount, setAmount] = useState<string>('0')
  const [frequency, setFrequency] = useState<string>('1')
  const [isAccountUpdating, setIsAccountUpdating] = useState(false)

  useEffect(() => {
    if (profile && 'user' in profile) {
      setAmount(String(profile.user.AMOUNT))
      setFrequency(String(profile.user.FREQUENCY))
    }
  }, [profile])

  useEffect(() => {
    if (profileError) {
      notifications.show({
        title: 'Error',
        message: (profileError as Error)?.message || 'Failed to load account profile',
        color: 'red',
      })
    }
  }, [profileError])

  const onUpdateSettings = async () => {
    setIsAccountUpdating(true)

    try {
      const res = await fetch(`/api/beep/profile/${tbaAddresss}`, {
        method: 'PUT',
        body: JSON.stringify({
          ID: tbaAddresss,
          AMOUNT: amount,
          FREQUENCY: frequency,
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
        message: (err as Error)?.message || 'Failed to update account',
        color: 'red',
      })
    } finally {
      setIsAccountUpdating(false)
    }
  }

  const onReset = () => {
    if (profile && 'user' in profile) {
      setAmount(String(profile.user.AMOUNT))
      setFrequency(String(profile.user.FREQUENCY))
    }
  }

  if (!profile || isProfileLoading) return null

  if ('message' in profile && profile.message === 'USER_NOT_FOUND') {
    return (
      <CreateAccountButton
        refetch={refetch}
        tbaAddresss={tbaAddresss}
      />
    )
  }

  return (
    <Box className={classes.container}>
      <Box className={classes['settings-container']}>
        <Box className={classes['settings-row']}>
          <Box className={classes['item-container']}>
            <Text className={classes.label}>Buy</Text>
            <Select
              allowDeselect={false}
              classNames={{
                root: classes['select-root'],
              }}
              data={['ETH']}
              value="ETH"
              leftSection={
                <Image
                  alt="eth"
                  className={classes['select-icon']}
                  src="/icons/tokens/ethereum.svg"
                />
              }
              radius="xl"
              rightSection={<></>}
              rightSectionWidth={0}
            />
          </Box>
          <Box className={classes['item-container']}>
            <Text className={classes.label}>every</Text>
            <Select
              allowDeselect={false}
              classNames={{
                root: classes['select-root'],
              }}
              data={[
                { value: '1', label: '1 day' },
                { value: '3', label: '3 day' },
                { value: '7', label: '1 week' },
              ]}
              onChange={v => setFrequency(v || '1')}
              radius="xl"
              rightSection={<i className="fa-solid fa-caret-down" />}
              value={frequency}
            />
          </Box>
        </Box>
        <Box className={classes['amount-row']}>
          <Box className={classes['amount-input-container']}>
            <NumberInput
              allowDecimal={false}
              allowNegative={false}
              classNames={{
                input: classes['amount-input'],
              }}
              hideControls
              maw={360}
              onChange={value => setAmount(String(value))}
              value={amount}
              w={360}
            />
          </Box>
          <Select
            allowDeselect={false}
            classNames={{
              root: classes['select-root'],
              dropdown: classes['usdc-dropdown-container'],
            }}
            data={['USDC']}
            defaultValue="USDC"
            leftSection={
              <Image
                alt="usdc"
                className={classes['select-icon']}
                src="/icons/tokens/usdc.svg"
              />
            }
            radius="xl"
            rightSection={<></>}
            rightSectionWidth={0}
            w={80}
          />
        </Box>
      </Box>
      <Text className={classes.tip}>
        <i className={cx('fa-solid fa-clock-rotate-left', classes['tip-icon'])} />
        Your auto-invest cycle will begin as soon as it is created
      </Text>
      <Box className={classes['button-row']}>
        <Button
          className={classes.button}
          color="rgba(255, 255, 255, 1)"
          onClick={() => onReset()}
          radius="xl"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          color="rgba(0, 0, 0, 1)"
          loading={isAccountUpdating}
          onClick={() => onUpdateSettings()}
          radius="xl"
          variant="white"
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

function CreateAccountButton({ tbaAddresss, refetch }: { tbaAddresss: string; refetch: () => Promise<unknown> }) {
  const [creating, setCreating] = useState(false)

  const onCreateAccount = async () => {
    try {
      setCreating(true)

      const res = await fetch(`/api/beep/profile/${tbaAddresss}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: null,
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      refetch()
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: (error as Error)?.message || 'Failed to create account',
        color: 'red',
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Button
      color="rgba(255, 255, 255, 1)"
      loading={creating}
      onClick={() => onCreateAccount()}
      radius="xl"
      variant="outline"
    >
      Create account
    </Button>
  )
}
