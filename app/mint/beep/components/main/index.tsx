'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AppShell, Box, Image, Text, Title, Button } from '@mantine/core'
import { useConnectionStatus } from '@thirdweb-dev/react'
import { cx } from 'classix'
import dayjs, { type Dayjs } from 'dayjs'

import classes from './styles.module.css'

const mintTime = +dayjs().add(2, 'day')

export default function Main() {
  const [now, setNow] = useState(+new Date())
  const [minted, setMinted] = useState<null | Dayjs>(null)

  const connectionStatus = useConnectionStatus()

  useEffect(() => {
    const interval = setInterval(() => {
      if (+new Date() > mintTime) {
        setNow(mintTime)
        clearInterval(interval)
        return
      }

      setNow(+new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const diffDay = useMemo(() => `0${dayjs(mintTime).diff(now, 'hours')}`.slice(-2), [now])
  const diffMin = useMemo(() => `0${dayjs(mintTime).diff(now, 'minutes') % 24}`.slice(-2), [now])
  const diffSec = useMemo(() => `0${dayjs(mintTime).diff(now, 'seconds') % 60}`.slice(-2), [now])

  const onMint = () => {
    if (connectionStatus !== 'connected') return
    setMinted(dayjs())
  }

  return (
    <AppShell.Main className={classes.main}>
      <Box className={classes.container}>
        <Link
          className={classes.link}
          href="/projects"
        >
          <i className={cx('fa-solid fa-chevron-left', classes['back-icon'])} />
          Back to home page
        </Link>
        <Box className={classes['mint-container']}>
          <Image
            alt="beep"
            className={classes['beep-image']}
            src="/beep.jpg"
          />
          <Box className={classes['mint-info-container']}>
            <Box className={classes['address-row']}>
              <i className="fa-brands fa-hashnode" />
              <Text fw={500}>0x31...45iE</Text>
            </Box>
            <Box className={classes['name-row']}>
              <Title className={classes.name}>BEEP BOT #666</Title>
            </Box>
            <Box className={classes['mint-status-row']}>
              {minted ? `Minted ${minted.format('MMM DD YYYY, HH:ss')}` : 'Available to mint'}
            </Box>
            <Box className={classes['mint-info-row']}>
              <Box className={classes['mint-price-col']}>
                <Text className={classes.lable}>Mint Price</Text>
                <Box className={classes['mint-price-row']}>
                  <Box className={classes['coin-box']}>
                    <i className={cx('fa-brands fa-ethereum', classes.coin)} />
                  </Box>
                  <Text className={classes['mint-price']}>0.01 ETH</Text>
                </Box>
                <Text className={classes.lable}>12.3547 USD</Text>
              </Box>
              <Box className={classes['mint-time-col']}>
                <Text className={classes.lable}>Time Remaining</Text>
                <Box className={classes['mint-time-row']}>
                  <span>{diffDay}</span>
                  <span>:</span>
                  <span>{diffMin}</span>
                  <span>:</span>
                  <span>{diffSec}</span>
                </Box>
                <Text className={cx(classes.lable, classes['time-label'])}>
                  <span>Hour</span>
                  <span>Min</span>
                  <span>Sec</span>
                </Text>
              </Box>
            </Box>
            <Box>
              <Button
                className={cx(classes.button, connectionStatus !== 'connected' && classes['button__disabled'])}
                disabled={connectionStatus !== 'connected'}
                onClick={() => onMint()}
                radius="xl"
                size="sm"
              >
                Mint
              </Button>
            </Box>
          </Box>
        </Box>
        <Box className={classes['detail-container']}>
          <Box className={classes['details-col']}>
            <Box className={classes['about-row']}>
              <Title className={classes.about}>ABOUT BEEP BOT #666</Title>
            </Box>
            <Box className={classes['tag-row']}>
              <Box className={classes.tag}>Image</Box>
              <Box className={classes.tag}>Interactive</Box>
              <Box className={classes.tag}>Responsive</Box>
            </Box>
            <Box className={classes['attr-row']}>
              <Box className={classes['label-col']}>
                <Text className={classes['attr-label']}>Growth Pattern</Text>
                <Text className={classes['attr-label']}>Fractal Depth</Text>
                <Text className={classes['attr-label']}>Fragmentation</Text>
                <Text className={classes['attr-label']}>Completeness</Text>
                <Text className={classes['attr-label']}>Background</Text>
                <Text className={classes['attr-label']}>Scale</Text>
                <Text className={classes['attr-label']}>Paper Color</Text>
              </Box>
              <Box className={classes['value-col']}>
                <Text className={classes.value}>cluster</Text>
                <Text className={classes.value}>medium</Text>
                <Text className={classes.value}>none</Text>
                <Text className={classes.value}>complete</Text>
                <Text className={classes.value}>blank</Text>
                <Text className={classes.value}>fit</Text>
                <Text className={classes.value}>warm</Text>
              </Box>
            </Box>
            <Box className={classes['num-row']}>
              <Text>
                <i className={cx('fa-solid fa-table-list', classes['num-icon'])} />
                <span>666 of 5,000</span>
              </Text>
            </Box>
          </Box>
          <Box className={classes['desc-col']}>
            <Box className={classes['beep']}>
              <Image
                alt="beep"
                className={classes['beep-logo']}
                src="/beep-logo.jpg"
              />
              <Text fw={500}>BEEP BOT</Text>
            </Box>
            <Text
              className={classes.desc}
              fw={500}
            >
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consectetur eleifend sapien eget pharetra. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Aenean consectetur eleifend sapien eget pharetra.
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consectetur eleifend sapien eget pharetra. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Aenean consectetur eleifend sapien eget pharetra.
              </Text>
            </Text>
          </Box>
        </Box>
      </Box>
    </AppShell.Main>
  )
}
