import { useEffect, useState } from 'react'
import { Box, Text, Button, Image, Select, NumberInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useSigner } from '@thirdweb-dev/react'
import { useBalance } from 'wagmi'
import { cx } from 'classix'

import classes from './styles.module.css'
import { notifications } from '@mantine/notifications'

import type { Profile } from 'types/profile'

export default function Deployed({ tbaAddresss }: { tbaAddresss: string }) {
  const signer = useSigner()

  const { data: usdcBalance, isLoading: isBalanceLoading } = useBalance({
    address: tbaAddresss as `0x${string}`,
    chainId: 5,
    token: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  })

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
  const [amountError, setAmountError] = useState<null | string>(null)
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
    if (isNaN(+amount) || +amount < 20) {
      setAmountError('Amount should be no less than 20')
      return
    }

    setIsAccountUpdating(true)

    try {
      await signer?.signMessage(
        JSON.stringify({
          ID: tbaAddresss,
          AMOUNT: amount,
          FREQUENCY: frequency,
        })
      )

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
      setAmountError(null)
      setFrequency(String(profile.user.FREQUENCY))
    }
  }

  if (!profile || isProfileLoading || isBalanceLoading) return null

  if ('message' in profile && profile.message === 'USER_NOT_FOUND') {
    return (
      <CreateAccountButton
        refetch={refetch}
        tbaAddresss={tbaAddresss}
      />
    )
  }

  const disabled = ('user' in profile && !profile.user.IS_ACTIVE) || !usdcBalance?.value

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
              data={['WETH']}
              disabled={disabled}
              value="WETH"
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
            <Text className={classes.label}>Every</Text>
            <Select
              allowDeselect={false}
              classNames={{
                root: classes['select-root'],
              }}
              data={[
                { value: '1', label: '1 day' },
                { value: '3', label: '3 days' },
                { value: '7', label: '1 week' },
              ]}
              disabled={disabled}
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
                error: classes['amount-error'],
              }}
              // disabled={disabled}
              error={amountError}
              hideControls
              maw={360}
              min={20}
              onChange={value => {
                setAmount(String(value))
                setAmountError(null)
              }}
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
            disabled={disabled}
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
        {`Your Beep Bot is now active and will Auto-Buy WETH Every ${
          'user' in profile && +profile.user.FREQUENCY > 0 ? profile.user.FREQUENCY : '-'
        } day(s)`}
      </Text>
      <Box className={classes['button-row']}>
        <Button
          className={classes.button}
          color="rgba(255, 255, 255, 1)"
          disabled={disabled}
          onClick={() => onReset()}
          radius="xl"
          variant="outline"
        >
          Reset
        </Button>
        <Button
          className={classes.button}
          color="rgba(0, 0, 0, 1)"
          // disabled={disabled}
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
