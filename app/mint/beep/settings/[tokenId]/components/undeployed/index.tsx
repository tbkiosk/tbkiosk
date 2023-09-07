import { useState } from 'react'
import { Box, Image, Text, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useChain, useSigner, useSwitchChain } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'

import { CONTRACT_ADDRESS, IMPLEMENTATION_ADDRESS } from 'constants/beep'
import { chain } from 'constants/chain'

import { useOwnedBeepTbaDeployedStatus } from 'hooks/use_owned_beep_tba_deployed_status'

import classes from './styles.module.css'

import type { ThirdWebError } from 'types'

export default function Undeployed({ tokenId }: { tokenId: string }) {
  const signer = useSigner()
  const currentChain = useChain()
  const switchChain = useSwitchChain()

  const { setAccountDeployedStatus } = useOwnedBeepTbaDeployedStatus({ tokenId })

  const [isDeploying, setIsDeploying] = useState(false)

  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })

  const deployTba = async () => {
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
      const tbaTransaction = await tokenboundClient.prepareCreateAccount({
        tokenContract: CONTRACT_ADDRESS,
        tokenId,
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
        loading={isDeploying}
        onClick={() => deployTba()}
        radius="xl"
        variant="white"
      >
        Deploy token bound account
      </Button>
    </Box>
  )
}
