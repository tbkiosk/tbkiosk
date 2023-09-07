import { useState } from 'react'
import { Box, Text, Button, Image, Select, TextInput } from '@mantine/core'
import { cx } from 'classix'

import classes from './styles.module.css'

export default function Deployed() {
  const [amount, setAmount] = useState<string | number>('0')

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) {
      setAmount('0')
      return
    }

    if (!/^[1-9]\d*$/.test(e.currentTarget.value)) return

    setAmount(e.currentTarget.value)
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
              defaultValue="1"
              radius="xl"
              rightSection={<i className="fa-solid fa-caret-down" />}
            />
          </Box>
        </Box>
        <Box className={classes['amount-row']}>
          <Box className={classes['amount-input-container']}>
            <TextInput
              classNames={{
                input: classes['amount-input'],
              }}
              maw={360}
              onChange={e => onAmountChange(e)}
              rightSection="wei"
              value={amount}
              w={60 + String(amount).length * 14}
            />
          </Box>
          <Select
            classNames={{
              root: classes['select-root'],
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
          radius="xl"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          color="rgba(0, 0, 0, 1)"
          radius="xl"
          variant="white"
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}
