'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppShell, Box, Image, Text, Title, Button, Group, Center, SimpleGrid, Loader } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { TokenboundClient } from '@tokenbound/sdk'
import {
  ConnectWallet,
  useChain,
  useConnectionStatus,
  useContract,
  useSigner,
  useSwitchChain,
  useTotalCirculatingSupply,
  Web3Button,
} from '@thirdweb-dev/react'
import { match } from 'ts-pattern'
import { cx } from 'classix'

import { CONTRACT_ADDRESS, IMPLEMENTATION_ADDRESS } from 'constants/beep'
import { chain } from 'constants/chain'

import { maskAddress } from 'utils/address'
import { useOwnedBeepTbaDeployedStatus } from 'hooks/use_owned_beep_tba_deployed_status'

import classes from './styles.module.css'

const ArrowRight = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_4001_3311)">
      <path
        d="M8.78047 8.50048L5.48047 5.20048L6.42314 4.25781L10.6658 8.50048L6.42314 12.7431L5.48047 11.8005L8.78047 8.50048Z"
        fill="#09121F"
      />
    </g>
    <defs>
      <clipPath id="clip0_4001_3311">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
)

type ThirdWebError = {
  reason: string
}

const ActionButton = () => {
  const connectionStatus = useConnectionStatus()
  const [tokenId, setTokenId] = useState<null | string>(null)
  const signer = useSigner()
  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })
  const { status, nft: lastOwnedNFT, setAccountDeployedStatus } = useOwnedBeepTbaDeployedStatus({ lastOwned: true })
  const [isDeploying, setIsDeploying] = useState(false)
  const currentChain = useChain()
  const switchChain = useSwitchChain()

  const submit = async () => {
    if (currentChain?.chainId !== chain.chainId) {
      notifications.show({
        title: 'Error',
        message: `Please switch to ${chain.name} network`,
        color: 'red',
      })
      return switchChain(chain.chainId)
    }
    setIsDeploying(true)
    try {
      const tokenID = tokenId ?? lastOwnedNFT
      const tbaTransaction = await tokenboundClient.prepareCreateAccount({
        tokenContract: CONTRACT_ADDRESS,
        tokenId: tokenID ?? '',
        implementationAddress: IMPLEMENTATION_ADDRESS,
      })
      if (signer) {
        const tx = await signer.sendTransaction({
          data: tbaTransaction.data,
          value: tbaTransaction.value,
          to: tbaTransaction.to,
        })
        await tx.wait()
        setAccountDeployedStatus('Deployed')
        notifications.show({
          title: 'Success',
          message: `You have deployed token bound account for Beep #${tokenID}`,
          color: 'green',
        })
      }
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: (e as unknown as ThirdWebError)?.reason ?? 'Failed to deploy',
        color: 'red',
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const claimNftButton = (
    <Web3Button
      contractAddress={CONTRACT_ADDRESS}
      action={contract => contract.erc721.claim(1)}
      theme="dark"
      className={cx(classes.button)}
      onSuccess={data => {
        const tokenId = data[0].id.toNumber()
        setTokenId(tokenId.toString())
        setAccountDeployedStatus('NotDeployed')
        notifications.show({
          title: 'Success',
          message: `You have successfully minted Beep #${tokenId}`,
          color: 'green',
        })
      }}
      onError={e => {
        notifications.show({
          title: 'Error',
          message: (e as unknown as ThirdWebError).reason,
          color: 'red',
        })
      }}
    >
      Mint
    </Web3Button>
  )

  if (connectionStatus !== 'connected') {
    return (
      <ConnectWallet
        theme="light"
        btnTitle="Connect to Mint"
        className={cx(classes.button)}
      />
    )
  }

  return (
    <Box mt={10}>
      {match(status)
        .with('Loading', () => (
          <Button
            className={cx(classes.button, classes.button__hide_loading_overlay)}
            loading={true}
          />
        ))
        .with('Deployed', () => claimNftButton)
        .with('NotDeployed', () => (
          <Button
            onClick={submit}
            className={cx(classes.button, classes.button__hide_loading_overlay)}
            loading={isDeploying}
          >
            Deploy Token Bound Account
          </Button>
        ))
        .with('Error', () => <div>Something Went wrong while trying to fetch data</div>)
        .with('NoToken', () => claimNftButton)
        .exhaustive()}
    </Box>
  )
}

const Category = ({ label }: { label: string }) => <Box className={classes.category}>{label}</Box>

const MintedCount = () => {
  const { contract } = useContract(CONTRACT_ADDRESS)
  const { data, isLoading } = useTotalCirculatingSupply(contract)

  if (isLoading) {
    return (
      <Loader
        color="dark"
        type="bars"
        size={'xs'}
      />
    )
  }
  return <Text fw={500}>{data?.toString()} minted</Text>
}

export default function Main() {
  const clipboard = useClipboard()

  const copyContractAddress = () => {
    clipboard.copy(CONTRACT_ADDRESS)
    notifications.show({
      title: 'Copied',
      message: 'Contract address copied to clipboard',
      color: 'green',
    })
  }

  return (
    <AppShell.Main className={classes.main}>
      <Box className={classes.container}>
        <Box className={classes['mint-box']}>
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
              <Group gap={8}>
                <Text
                  fw={500}
                  fz={16}
                >
                  Created by
                </Text>
                <svg
                  width="50"
                  height="11"
                  viewBox="0 0 50 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 0.498047H1.6076V4.47492C1.6076 4.60898 1.70871 4.71009 1.84277 4.71009H4.06111C4.19517 4.71009 4.29629 4.60898 4.29629 4.47492V3.71675C4.29629 3.48577 4.47598 3.30608 4.70696 3.30608H5.49321C5.62727 3.30608 5.72838 3.20496 5.72838 3.07091V2.31274C5.72838 2.08175 5.90807 1.90206 6.13906 1.90206H6.92531C7.05936 1.90206 7.16048 1.80095 7.16048 1.66689V0.908721C7.16048 0.677736 7.34017 0.498047 7.57115 0.498047H8.3574C8.58839 0.498047 8.76807 0.677736 8.76807 0.908721V1.66689C8.76807 1.89787 8.58839 2.07756 8.3574 2.07756H7.58519C7.4462 2.07756 7.33598 2.18347 7.33598 2.31274V3.07091C7.33598 3.30189 7.15629 3.48158 6.92531 3.48158H6.1531C6.0141 3.48158 5.90388 3.58749 5.90388 3.71675V4.47492C5.90388 4.7059 5.7242 4.88559 5.49321 4.88559H4.70696C4.5729 4.88559 4.47179 4.98671 4.47179 5.12077V5.87894C4.47179 6.01299 4.5729 6.11411 4.70696 6.11411H5.49321C5.7242 6.11411 5.90388 6.2938 5.90388 6.52478V7.28295C5.90388 7.41222 6.0141 7.51812 6.1531 7.51812H6.92531C7.15629 7.51812 7.33598 7.69781 7.33598 7.9288V8.68696C7.33598 8.81623 7.4462 8.92214 7.58519 8.92214H8.3574C8.58839 8.92214 8.76807 9.10183 8.76807 9.33281V10.091C8.76807 10.322 8.58839 10.5017 8.3574 10.5017H7.57115C7.34017 10.5017 7.16048 10.322 7.16048 10.091V9.33281C7.16048 9.19875 7.05936 9.09764 6.92531 9.09764H6.13906C5.90807 9.09764 5.72838 8.91795 5.72838 8.68696V7.9288C5.72838 7.79474 5.62727 7.69362 5.49321 7.69362H4.70696C4.47598 7.69362 4.29629 7.51393 4.29629 7.28295V6.52478C4.29629 6.39072 4.19517 6.28961 4.06111 6.28961H1.84277C1.70871 6.28961 1.6076 6.39072 1.6076 6.52478V10.5017H0V6.52478C0 6.2938 0.179689 6.11411 0.410674 6.11411H1.19692C1.33098 6.11411 1.4321 6.01299 1.4321 5.87894V5.12077C1.4321 4.98671 1.33098 4.88559 1.19692 4.88559H0.410674C0.179689 4.88559 0 4.70591 0 4.47492V0.498047ZM10.8564 10.5017V8.92214H13.1046C13.2387 8.92214 13.3398 8.82102 13.3398 8.68696V2.31274C13.3398 2.17868 13.2387 2.07756 13.1046 2.07756H10.8564V0.498047H13.1046C13.3356 0.498047 13.5153 0.677735 13.5153 0.908721V1.66689C13.5153 1.80095 13.6164 1.90206 13.7505 1.90206H14.5367C14.6708 1.90206 14.7719 1.80095 14.7719 1.66689V0.908721C14.7719 0.677735 14.9516 0.498047 15.1825 0.498047H17.4307V2.07756H15.1825C15.0485 2.07756 14.9474 2.17868 14.9474 2.31274V8.68696C14.9474 8.82102 15.0485 8.92214 15.1825 8.92214H17.4307V10.5017H15.1825C14.9516 10.5017 14.7719 10.322 14.7719 10.091V9.33281C14.7719 9.19875 14.6708 9.09764 14.5367 9.09764H13.7505C13.6164 9.09764 13.5153 9.19875 13.5153 9.33281V10.091C13.5153 10.322 13.3356 10.5017 13.1046 10.5017H10.8564ZM39.1436 3.48158H37.536V2.31274C37.536 2.17868 37.4349 2.07756 37.3008 2.07756H32.2183C32.0842 2.07756 31.9831 2.17868 31.9831 2.31274V4.47492C31.9831 4.60898 32.0842 4.71009 32.2183 4.71009H37.3008C37.5318 4.71009 37.7115 4.88978 37.7115 5.12077V5.87894C37.7115 6.01299 37.8126 6.11411 37.9467 6.11411H38.7329C38.9639 6.11411 39.1436 6.2938 39.1436 6.52478V8.68696C39.1436 8.91795 38.9639 9.09764 38.7329 9.09764H37.9467C37.8126 9.09764 37.7115 9.19875 37.7115 9.33281V10.091C37.7115 10.322 37.5318 10.5017 37.3008 10.5017H32.2183C31.9873 10.5017 31.8076 10.322 31.8076 10.091V9.33281C31.8076 9.19875 31.7065 9.09764 31.5724 9.09764H30.7862C30.5552 9.09764 30.3755 8.91795 30.3755 8.68696V7.51812H31.9831V8.68696C31.9831 8.82102 32.0842 8.92214 32.2183 8.92214H37.3008C37.4349 8.92214 37.536 8.82102 37.536 8.68696V6.52478C37.536 6.39072 37.4349 6.28961 37.3008 6.28961H32.2183C31.9873 6.28961 31.8076 6.10992 31.8076 5.87894V5.12077C31.8076 4.98671 31.7065 4.88559 31.5724 4.88559H30.7862C30.5552 4.88559 30.3755 4.7059 30.3755 4.47492V2.31274C30.3755 2.08175 30.5552 1.90206 30.7862 1.90206H31.5724C31.7065 1.90206 31.8076 1.80095 31.8076 1.66689V0.908721C31.8076 0.677736 31.9873 0.498047 32.2183 0.498047H37.3008C37.5318 0.498047 37.7115 0.677736 37.7115 0.908721V1.66689C37.7115 1.80095 37.8126 1.90206 37.9467 1.90206H38.7329C38.9639 1.90206 39.1436 2.08175 39.1436 2.31274V3.48158ZM41.2319 0.498047H42.8395V4.47492C42.8395 4.60898 42.9406 4.71009 43.0747 4.71009H45.293C45.4271 4.71009 45.5282 4.60898 45.5282 4.47492V3.71675C45.5282 3.48577 45.7079 3.30608 45.9389 3.30608H46.7251C46.8592 3.30608 46.9603 3.20496 46.9603 3.07091V2.31274C46.9603 2.08175 47.14 1.90206 47.371 1.90206H48.1572C48.2913 1.90206 48.3924 1.80095 48.3924 1.66689V0.908721C48.3924 0.677736 48.5721 0.498047 48.8031 0.498047H49.5893C49.8203 0.498047 50 0.677736 50 0.908721V1.66689C50 1.89787 49.8203 2.07756 49.5893 2.07756H48.8171C48.6781 2.07756 48.5679 2.18347 48.5679 2.31274V3.07091C48.5679 3.30189 48.3882 3.48158 48.1572 3.48158H47.385C47.246 3.48158 47.1358 3.58749 47.1358 3.71675V4.47492C47.1358 4.7059 46.9561 4.88559 46.7251 4.88559H45.9389C45.8048 4.88559 45.7037 4.98671 45.7037 5.12077V5.87894C45.7037 6.01299 45.8048 6.11411 45.9389 6.11411H46.7251C46.9561 6.11411 47.1358 6.2938 47.1358 6.52478V7.28295C47.1358 7.41221 47.246 7.51812 47.385 7.51812H48.1572C48.3882 7.51812 48.5679 7.69781 48.5679 7.9288V8.68696C48.5679 8.81623 48.6781 8.92214 48.8171 8.92214H49.5893C49.8203 8.92214 50 9.10183 50 9.33281V10.091C50 10.322 49.8203 10.5017 49.5893 10.5017H48.8031C48.5721 10.5017 48.3924 10.322 48.3924 10.091V9.33281C48.3924 9.19875 48.2913 9.09764 48.1572 9.09764H47.371C47.14 9.09764 46.9603 8.91795 46.9603 8.68696V7.9288C46.9603 7.79474 46.8592 7.69362 46.7251 7.69362H45.9389C45.7079 7.69362 45.5282 7.51393 45.5282 7.28295V6.52478C45.5282 6.39072 45.4271 6.28961 45.293 6.28961H43.0747C42.9406 6.28961 42.8395 6.39072 42.8395 6.52478V10.5017H41.2319V6.52478C41.2319 6.2938 41.4116 6.11411 41.6426 6.11411H42.4288C42.5629 6.11411 42.664 6.01299 42.664 5.87894V5.12077C42.664 4.98671 42.5629 4.88559 42.4288 4.88559H41.6426C41.4116 4.88559 41.2319 4.7059 41.2319 4.47492V0.498047ZM21.3618 10.5017C21.1309 10.5017 20.9512 10.322 20.9512 10.091V9.33281C20.9512 9.19875 20.8501 9.09764 20.716 9.09764H19.9297C19.6988 9.09764 19.5191 8.91795 19.5191 8.68696V2.31274C19.5191 2.08175 19.6988 1.90206 19.9297 1.90206H20.716C20.8501 1.90206 20.9512 1.80095 20.9512 1.66689V0.908721C20.9512 0.677736 21.1309 0.498047 21.3618 0.498047H26.4444C26.6754 0.498047 26.8551 0.677736 26.8551 0.908721V1.66689C26.8551 1.80095 26.9562 1.90206 27.0902 1.90206H27.8765C28.1075 1.90206 28.2871 2.08175 28.2871 2.31274V8.68696C28.2871 8.91795 28.1075 9.09764 27.8765 9.09764H27.0902C26.9562 9.09764 26.8551 9.19875 26.8551 9.33281V10.091C26.8551 10.322 26.6754 10.5017 26.4444 10.5017H21.3618ZM21.1267 8.68696C21.1267 8.82102 21.2278 8.92214 21.3618 8.92214H26.4444C26.5784 8.92214 26.6796 8.82102 26.6796 8.68696V2.31274C26.6796 2.17868 26.5784 2.07756 26.4444 2.07756H21.3618C21.2278 2.07756 21.1267 2.17868 21.1267 2.31274V8.68696Z"
                    fill="#ED3733"
                  />
                </svg>
              </Group>
              <Box className={classes['name-row']}>
                <Title className={classes.name}>BEEP BOT</Title>
              </Box>
              <Box className={classes['mint-status-row']}>Mint starts on: Aug 18 2023, 13:45 GMT+8</Box>
              <Group gap={12}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="#8247E5"
                  />
                  <g clipPath="url(#clip0_4001_6230)">
                    <path
                      d="M15.2231 9.58633C14.9928 9.45813 14.6968 9.45813 14.4336 9.58633L12.5915 10.644L11.3415 11.317L9.53228 12.3747C9.30201 12.5029 9.00596 12.5029 8.7428 12.3747L7.32833 11.5414C7.09807 11.4132 6.93359 11.1568 6.93359 10.8683V9.26583C6.93359 9.00943 7.06517 8.75303 7.32833 8.59278L8.7428 7.79152C8.97307 7.66332 9.26912 7.66332 9.53228 7.79152L10.9468 8.62483C11.177 8.75303 11.3415 9.00943 11.3415 9.29788V10.3555L12.5915 9.65044V8.56073C12.5915 8.30432 12.4599 8.04792 12.1968 7.88767L9.56517 6.38131C9.33491 6.25311 9.03886 6.25311 8.7757 6.38131L6.07833 7.91972C5.81517 8.04792 5.68359 8.30432 5.68359 8.56073V11.5735C5.68359 11.8299 5.81517 12.0863 6.07833 12.2465L8.7428 13.7529C8.97307 13.8811 9.26912 13.8811 9.53228 13.7529L11.3415 12.7273L12.5915 12.0222L14.4007 10.9965C14.631 10.8683 14.927 10.8683 15.1902 10.9965L16.6046 11.7978C16.8349 11.926 16.9994 12.1824 16.9994 12.4709V14.0734C16.9994 14.3298 16.8678 14.5862 16.6046 14.7464L15.2231 15.5477C14.9928 15.6759 14.6968 15.6759 14.4336 15.5477L13.0191 14.7464C12.7889 14.6182 12.6244 14.3618 12.6244 14.0734V13.0478L11.3744 13.7529V14.8105C11.3744 15.0669 11.506 15.3233 11.7691 15.4836L14.4336 16.9899C14.6639 17.1181 14.9599 17.1181 15.2231 16.9899L17.8875 15.4836C18.1178 15.3554 18.2823 15.099 18.2823 14.8105V11.7658C18.2823 11.5094 18.1507 11.2529 17.8875 11.0927L15.2231 9.58633Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4001_6230">
                      <rect
                        width="12.6316"
                        height="10.7368"
                        fill="white"
                        transform="translate(5.68359 6.31641)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <Text>On Polygon</Text>
              </Group>
              <Text
                fw={500}
                fz={14}
                mt={32}
              >
                Beep is a DCA (Dollar-cost averaging) bot with a token-bound account.
              </Text>
              <Box className={classes['mint-info-row']}>
                <Box className={classes['mint-price-col']}>
                  <Text className={classes.lable}>Mint Price</Text>
                  <Box className={classes['mint-price-row']}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                        fill="black"
                      />
                      <path
                        d="M12 4.9082V10.1507L16.362 12.1307L12 4.9082Z"
                        fill="white"
                        fillOpacity="0.602"
                      />
                      <path
                        d="M11.9993 4.9082L7.63672 12.1307L11.9993 10.1507V4.9082Z"
                        fill="white"
                      />
                      <path
                        d="M12 15.5273V19.0895L16.3649 12.9551L12 15.5273Z"
                        fill="white"
                        fillOpacity="0.602"
                      />
                      <path
                        d="M11.9993 19.0895V15.5267L7.63672 12.9551L11.9993 19.0895Z"
                        fill="white"
                      />
                      <path
                        d="M12 14.704L16.362 12.1312L12 10.1523V14.704Z"
                        fill="white"
                        fillOpacity="0.2"
                      />
                      <path
                        d="M7.63672 12.1312L11.9993 14.704V10.1523L7.63672 12.1312Z"
                        fill="white"
                        fillOpacity="0.602"
                      />
                    </svg>
                    <Text className={classes['mint-price']}>0.00 ETH</Text>
                  </Box>
                  <Text className={classes['mint-price-usd']}>0.00 USD</Text>
                </Box>
              </Box>
              <ActionButton />
              <Center mt={4}>
                <MintedCount />
              </Center>
            </Box>
          </Box>
          <Box className={classes['detail-container']}>
            <Box className={classes['details-col']}>
              <Box className={classes['about-row']}>
                <Title className={classes.about}>ABOUT BEEP BOT</Title>
              </Box>
              <Group gap={8}>
                <Category label={'DeFi'} />
                <Category label={'Smart NFT'} />
                <Category label={'Bot'} />
              </Group>
              <Box
                mt={48}
                className={classes['contract-info']}
              >
                <Group className={classes['contract-info-item']}>
                  <Text className={classes['contract-info-label']}>Contract address</Text>
                  <Group
                    gap={4}
                    style={{ cursor: 'pointer' }}
                    onClick={copyContractAddress}
                  >
                    <Text className={classes['contract-info-value']}>{maskAddress(CONTRACT_ADDRESS)}</Text>
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4001_6273)">
                        <path
                          d="M4.08333 3.99935V2.24935C4.08333 2.09464 4.14479 1.94627 4.25419 1.83687C4.36358 1.72747 4.51196 1.66602 4.66667 1.66602H11.6667C11.8214 1.66602 11.9697 1.72747 12.0791 1.83687C12.1885 1.94627 12.25 2.09464 12.25 2.24935V10.416C12.25 10.5707 12.1885 10.7191 12.0791 10.8285C11.9697 10.9379 11.8214 10.9993 11.6667 10.9993H9.91667V12.7493C9.91667 13.0713 9.65417 13.3327 9.32925 13.3327H2.33742C2.26049 13.3331 2.18423 13.3184 2.11302 13.2893C2.04181 13.2602 1.97705 13.2173 1.92247 13.1631C1.86788 13.1089 1.82455 13.0444 1.79495 12.9734C1.76535 12.9024 1.75008 12.8263 1.75 12.7493L1.75175 4.58268C1.75175 4.26068 2.01425 3.99935 2.33917 3.99935H4.08333ZM2.91842 5.16602L2.91667 12.166H8.75V5.16602H2.91842ZM5.25 3.99935H9.91667V9.83268H11.0833V2.83268H5.25V3.99935Z"
                          fill="black"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4001_6273">
                          <rect
                            width="14"
                            height="14"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </Group>
                </Group>
                <Group className={classes['contract-info-item']}>
                  <Text className={classes['contract-info-label']}>Blockchain</Text>
                  <Text className={classes['contract-info-value']}>Polygon</Text>
                </Group>
                <Group className={classes['contract-info-item']}>
                  <Text className={classes['contract-info-label']}>Token standard</Text>
                  <Text className={classes['contract-info-value']}>ERC-6551</Text>
                </Group>
                <Group className={classes['contract-info-item']}>
                  <Text className={classes['contract-info-label']}>Supply</Text>
                  <Text className={classes['contract-info-value']}>1,000</Text>
                </Group>
              </Box>
            </Box>
            <Box className={classes['desc-col']}>
              <Box className={classes['beep']}>
                <Image
                  alt="beep"
                  className={classes['beep-logo']}
                  src="/beep-avatar.jpg"
                />
                <Text fw={500}>BEEP BOT</Text>
              </Box>
              <Box className={classes.desc}>
                <Text>
                  Beep is Dollar-cost averaging (DCA) bot with a token-bound account. In a volatile market, Beep is your reliable companion,
                  helping you navigate fluctuations by strategically spreading your purchases across different price levels. Say goodbye to
                  emotional trading decisions and start accumulating with confidence.
                </Text>
                <Text mt={'md'}>Beep is a new take on what&apos;s possible with ERC 6551 smart NFTs. Brought to you by Kiosk.</Text>
              </Box>
              <SimpleGrid style={{ gap: '10px' }}>
                <Link href={'/mint/beep/settings'}>
                  <Group gap={8}>
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4001_3309)">
                        <path
                          d="M2.00065 2.5H14.0007C14.1775 2.5 14.347 2.57024 14.4721 2.69526C14.5971 2.82029 14.6673 2.98986 14.6673 3.16667V13.8333C14.6673 14.0101 14.5971 14.1797 14.4721 14.3047C14.347 14.4298 14.1775 14.5 14.0007 14.5H2.00065C1.82384 14.5 1.65427 14.4298 1.52925 14.3047C1.40422 14.1797 1.33398 14.0101 1.33398 13.8333V3.16667C1.33398 2.98986 1.40422 2.82029 1.52925 2.69526C1.65427 2.57024 1.82384 2.5 2.00065 2.5ZM2.66732 3.83333V13.1667H13.334V3.83333H2.66732ZM8.00065 10.5H12.0007V11.8333H8.00065V10.5ZM5.77865 8.5L3.89265 6.61467L4.83598 5.67133L7.66398 8.5L4.83598 11.3287L3.89265 10.3853L5.77865 8.5Z"
                          fill="#09121F"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4001_3309">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <Text className={classes['desc-label']}>Set up your beep</Text>
                    <ArrowRight />
                  </Group>
                </Link>
                <Link href={'/mint/beep/settings'}>
                  <Group gap={8}>
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4001_3313)">
                        <path
                          d="M8.00065 1.83398C11.6827 1.83398 14.6673 4.81865 14.6673 8.50065C14.6673 12.1827 11.6827 15.1673 8.00065 15.1673C4.31865 15.1673 1.33398 12.1827 1.33398 8.50065C1.33398 4.81865 4.31865 1.83398 8.00065 1.83398ZM8.00065 3.16732C6.58616 3.16732 5.22961 3.72922 4.22941 4.72941C3.22922 5.72961 2.66732 7.08616 2.66732 8.50065C2.66732 9.91514 3.22922 11.2717 4.22941 12.2719C5.22961 13.2721 6.58616 13.834 8.00065 13.834C9.41514 13.834 10.7717 13.2721 11.7719 12.2719C12.7721 11.2717 13.334 9.91514 13.334 8.50065C13.334 7.08616 12.7721 5.72961 11.7719 4.72941C10.7717 3.72922 9.41514 3.16732 8.00065 3.16732ZM8.00065 5.16732C8.70237 5.16758 9.38612 5.3893 9.95446 5.80088C10.5228 6.21246 10.9468 6.7929 11.166 7.45952C11.3851 8.12613 11.3883 8.84492 11.1751 9.51347C10.9619 10.182 10.5431 10.7662 9.9785 11.1829C9.41385 11.5995 8.73211 11.8273 8.03042 11.8338C7.32872 11.8404 6.64287 11.6253 6.07056 11.2192C5.49825 10.8132 5.06868 10.2369 4.84305 9.57241C4.61743 8.90795 4.60726 8.18923 4.81398 7.51865C4.96993 7.86713 5.24083 8.15147 5.58136 8.32409C5.92188 8.49672 6.31136 8.54715 6.68462 8.46696C7.05788 8.38676 7.39227 8.1808 7.63183 7.88354C7.8714 7.58628 8.0016 7.21576 8.00065 6.83398C8.00074 6.51296 7.90811 6.19875 7.73391 5.9291C7.55971 5.65946 7.31134 5.44586 7.01865 5.31398C7.32932 5.21865 7.65865 5.16732 8.00065 5.16732Z"
                          fill="#09121F"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4001_3313">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <Text className={classes['desc-label']}>View minted beeps</Text>
                    <ArrowRight />
                  </Group>
                </Link>
                <Group gap={8}>
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_4001_3317)">
                      <path
                        d="M2 11.834H14V13.1673H2V11.834ZM2 7.83398H4V9.83398H2V7.83398ZM5.33333 7.83398H7.33333V9.83398H5.33333V7.83398ZM2 3.83398H4V5.83398H2V3.83398ZM8.66667 3.83398H10.6667V5.83398H8.66667V3.83398ZM12 3.83398H14V5.83398H12V3.83398ZM8.66667 7.83398H10.6667V9.83398H8.66667V7.83398ZM12 7.83398H14V9.83398H12V7.83398ZM5.33333 3.83398H7.33333V5.83398H5.33333V3.83398Z"
                        fill="#09121F"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4001_3317">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <Text className={classes['desc-label']}>How does DCA work</Text>
                  <ArrowRight />
                </Group>
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppShell.Main>
  )
}
