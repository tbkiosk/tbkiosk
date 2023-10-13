import { useEffect, useState } from 'react'
import { useSigner } from '@thirdweb-dev/react'

export const useTbaDeployStatus = ({ tbaAddress }: { tbaAddress: string }) => {
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
