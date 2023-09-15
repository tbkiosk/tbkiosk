import { Box, Image, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Web3Button } from '@thirdweb-dev/react'
import { erc6551RegistryAbi } from '@tokenbound/sdk'

import { CONTRACT_ADDRESS, IMPLEMENTATION_ADDRESS, REGISTRY_ADDRESS } from 'constants/beep'
import { chain } from 'constants/chain'

import { useOwnedBeepTbaDeployedStatus } from 'hooks/use_owned_beep_tba_deployed_status'

import classes from './styles.module.css'

import type { ThirdWebError } from 'types'

export default function Undeployed({ tokenId, tbaAddresss }: { tokenId: string; tbaAddresss: string }) {
  const { setAccountDeployedStatus } = useOwnedBeepTbaDeployedStatus({ tokenId })

  const createAccount = async () => {
    try {
      const res = await fetch(`/api/beep/profile/${tbaAddresss}`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create user account',
        color: 'red',
      })
    }
  }

  return (
    <Box className={classes.container}>
      <Image
        alt="not-deployed"
        className={classes['not-deployed-icon']}
        src="/icons/not-deployed.svg"
      />
      <Text className={classes.tip}>
        {`You haven't deployed your token bound account yet. So you will not be able to use auto-invest function now.`}
      </Text>
      <Web3Button
        contractAddress={REGISTRY_ADDRESS}
        theme="dark"
        contractAbi={erc6551RegistryAbi}
        className={classes.button}
        action={async contract => {
          await contract.call('createAccount', [IMPLEMENTATION_ADDRESS, chain.chainId, CONTRACT_ADDRESS, tokenId ?? '', 0, '0x'])
        }}
        onSuccess={() => {
          setAccountDeployedStatus('Deployed')
          createAccount()
        }}
        onError={e => {
          notifications.show({
            title: 'Error',
            message: (e as unknown as ThirdWebError).reason ?? 'Failed to deploy',
            color: 'red',
          })
        }}
      >
        Deploy Token Bound Account
      </Web3Button>
    </Box>
  )
}
