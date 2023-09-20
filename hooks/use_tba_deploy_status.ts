import { useSigner } from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'

type Props = {
  tbaAddress: string
}

export const useTbaDeployStatus = ({ tbaAddress }: Props) => {
  const signer = useSigner()
  const [isDeployed, setIsDeployed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!signer?.provider) return
    signer.provider.getCode(tbaAddress).then(code => {
      setIsDeployed(code !== '0x')
      setIsLoading(false)
    })
  }, [tbaAddress, signer])

  return {
    isDeployed,
    isLoading,
  }
}
