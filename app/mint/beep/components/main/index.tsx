'use client'

import Link from 'next/link'
import { AppShell, Box, Image, Text, Title, Button, Group } from '@mantine/core'
import { cx } from 'classix'

import classes from './styles.module.css'

export default function Main() {
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
            <Group>
              <Box className={classes['address-row']}>
                <i className="fa-brands fa-hashnode" />
                <Text fw={500}>0x31...45iE</Text>
              </Box>
            </Group>
            <Box className={classes['name-row']}>
              <Title className={classes.name}>BEEP BOT</Title>
            </Box>
            <Box className={classes['mint-status-row']}>Available to mint</Box>
            <Box className={classes['mint-info-row']}>
              <Box className={classes['mint-price-col']}>
                <Text className={classes.lable}>Mint Price</Text>
                <Box className={classes['mint-price-row']}>
                  <Box className={classes['coin-box']}>
                    <i className={cx('fa-brands fa-ethereum', classes.coin)} />
                  </Box>
                  <Text className={classes['mint-price']}>Free</Text>
                </Box>
              </Box>
            </Box>
            <Box>
              <Button
                className={cx(classes.button)}
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
              <Title className={classes.about}>Supply</Title>
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
            <Box
              className={classes.desc}
              fw={500}
            >
              <Text>
                Beep is your personal trading companion and a new take on what&apos;s possible with ERC 6551 smart NFTs. Brought to you by
                Kiosk, Beep is a revolutionary experiment that combines the power of NFTs, DeFi, and smart account into one seamless
                experience.
              </Text>
              <Text mt={'md'}>
                Beep is an automated trading bot designed to Dollar Cost Averaging (DCA) stable coins into WETH (Wrapped ETH). DCA is a
                time-tested investment approach that involves making regular purchases over time, smoothing out the impact of price
                volatility.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppShell.Main>
  )
}
