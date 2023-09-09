import { useState } from 'react'
import { Box, Text, Button, Image, Select, TextInput } from '@mantine/core'
// import { useQuery } from '@tanstack/react-query'
import { cx } from 'classix'

import classes from './styles.module.css'
import { notifications } from '@mantine/notifications'

export default function Deployed({ isActivated }: { isActivated: boolean }) {
  const [defaultAmount, setDefaultAmount] = useState<string>('0')
  const [amount, setAmount] = useState<string>(defaultAmount)
  const [defaultFrequency, setDefaultFrequency] = useState<string>('1')
  const [frequency, setFrequency] = useState<string>(defaultFrequency)
  const [saving, setSaving] = useState(false)

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) {
      setAmount('0')
      return
    }

    if (!/^[1-9]\d*$/.test(e.currentTarget.value)) return

    setAmount(e.currentTarget.value)
  }

  const onSave = async () => {
    setSaving(true)
    await new Promise(res => {
      setTimeout(() => {
        res(null)
      }, 1000)
    })
    setDefaultAmount(amount)
    setDefaultFrequency(frequency)
    setSaving(false)

    notifications.show({
      title: 'Success',
      message: 'Successfully updated the account',
      color: 'green',
    })
  }

  const onReset = () => {
    setAmount(defaultAmount)
    setFrequency(defaultFrequency)
  }

  return (
    <Box className={classes.container}>
      <Box className={classes['settings-container']}>
        <Box className={classes['settings-row']}>
          <Box className={classes['item-container']}>
            <Text className={classes.label}>Buy</Text>
            <Select
              classNames={{
                root: classes['select-root'],
              }}
              data={['ETH']}
              defaultValue="ETH"
              disabled={!isActivated}
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
              classNames={{
                root: classes['select-root'],
              }}
              data={[
                { value: '1', label: '1 day' },
                { value: '3', label: '3 day' },
                { value: '7', label: '1 week' },
              ]}
              disabled={!isActivated}
              onChange={v => setFrequency(v || '1')}
              radius="xl"
              rightSection={<i className="fa-solid fa-caret-down" />}
              value={frequency}
            />
          </Box>
        </Box>
        <Box className={classes['amount-row']}>
          <Box className={classes['amount-input-container']}>
            <TextInput
              classNames={{
                input: classes['amount-input'],
              }}
              disabled={!isActivated}
              maw={360}
              onChange={e => onAmountChange(e)}
              value={amount}
              w={360}
            />
          </Box>
          <Select
            classNames={{
              root: classes['select-root'],
              dropdown: classes['usdc-dropdown-container'],
            }}
            data={['USDC']}
            defaultValue="USDC"
            disabled={!isActivated}
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
          disabled={!isActivated}
          onClick={() => onReset()}
          radius="xl"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          color="rgba(0, 0, 0, 1)"
          disabled={!isActivated}
          loading={saving}
          onClick={() => onSave()}
          radius="xl"
          variant="white"
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}
