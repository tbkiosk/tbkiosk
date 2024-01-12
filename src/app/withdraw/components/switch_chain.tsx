import { Button } from '@nextui-org/react'
import { useNetwork, ChainId } from '@thirdweb-dev/react'

export const Network = () => {
  const [, switchNetwork] = useNetwork()

  return <div>{switchNetwork && <Button onClick={() => switchNetwork(ChainId.Mainnet)}>Switch to Mainnet</Button>}</div>
}
