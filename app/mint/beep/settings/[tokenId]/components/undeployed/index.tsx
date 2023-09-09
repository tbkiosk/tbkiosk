import { Box, Image, Text, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useChain, useSwitchChain, useContract, useContractWrite } from '@thirdweb-dev/react'

import { CONTRACT_ADDRESS, IMPLEMENTATION_ADDRESS } from 'constants/beep'
import { chain } from 'constants/chain'

import { useOwnedBeepTbaDeployedStatus } from 'hooks/use_owned_beep_tba_deployed_status'

import classes from './styles.module.css'

import type { ThirdWebError } from 'types'

export default function Undeployed({ tokenId, tbaAddresss }: { tokenId: string; tbaAddresss: string }) {
  const currentChain = useChain()
  const switchChain = useSwitchChain()
  const { contract } = useContract('0x02101dfB77FDE026414827Fdc604ddAF224F0921')
  const { mutateAsync, isLoading } = useContractWrite(contract, 'createAccount')

  const { setAccountDeployedStatus } = useOwnedBeepTbaDeployedStatus({ tokenId })

  const deployTba = async () => {
    if (currentChain?.chainId !== chain.chainId) {
      notifications.show({
        title: 'Error',
        message: `Please switch to ${chain.name} network`,
        color: 'red',
      })
      return switchChain(chain.chainId)
    }

    try {
      await mutateAsync({
        args: [IMPLEMENTATION_ADDRESS, chain.chainId, CONTRACT_ADDRESS, tokenId ?? '', 0, '0x'],
      })
      setAccountDeployedStatus('Deployed')

      const res = await fetch(`/api/beep/profile/${tbaAddresss}`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: (e as unknown as ThirdWebError)?.reason ?? 'Failed to deploy',
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
      <Button
        color="rgba(0, 0, 0, 1)"
        loading={isLoading}
        onClick={() => deployTba()}
        radius="xl"
        variant="white"
      >
        Deploy token bound account
      </Button>
    </Box>
  )
}
