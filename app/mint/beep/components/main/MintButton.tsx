import { ConnectWallet, useConnectionStatus, Web3Button } from '@thirdweb-dev/react'
import { useOwnedBeepTbaDeployedStatus } from 'hooks/use_owned_beep_tba_deployed_status'
import { cx } from 'classix'
import classes from 'app/mint/beep/components/main/styles.module.css'
import { notifications } from '@mantine/notifications'
import { ThirdWebError } from '../../../../../types'
import { Box, Text } from '@mantine/core'
import { match } from 'ts-pattern'

import { CONTRACT_ADDRESS } from 'constants/beep'

type MintButtonProps = {
  onSuccess: (tokenId: string) => void
}

export const MintButton = ({ onSuccess }: MintButtonProps) => {
  const connectionStatus = useConnectionStatus()
  const { status } = useOwnedBeepTbaDeployedStatus({ lastOwned: true })

  const claimNftButton = (
    <Web3Button
      contractAddress={CONTRACT_ADDRESS}
      action={contract => contract.erc721.claim(1)}
      theme="dark"
      className={cx(classes.button)}
      onSuccess={data => {
        const tokenId = data[0].id.toNumber()
        onSuccess(tokenId.toString())
      }}
      onError={e => {
        notifications.show({
          title: 'Error',
          message: (e as unknown as ThirdWebError).reason,
          color: 'red',
        })
      }}
    >
      Mint now
    </Web3Button>
  )

  if (connectionStatus !== 'connected') {
    return (
      <ConnectWallet
        theme="light"
        className={cx(classes.button)}
      />
    )
  }

  return (
    <Box>
      {match(status)
        .with('Loading', () => claimNftButton)
        .with('Deployed', () => claimNftButton)
        .with('NotDeployed', () => claimNftButton)
        .with('Error', () => <Text>Something Went wrong while trying to fetch data</Text>)
        .with('NoToken', () => claimNftButton)
        .exhaustive()}
    </Box>
  )
}
