import { useContext } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/client'
import cl from 'classnames'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

import Button from '../button'

import { LOGIN_GET_MESSAGE } from '@/graphql'
import LOGIN_VERIFY from '@/graphql/login_verify'

import type { ButtonProps } from '../button'

type CCSignInButtonProps = {
  classNames?: string
} & ButtonProps

const CCSignInButton = ({ classNames, ...restProps }: CCSignInButtonProps) => {
  const { address, accessToken, setAccessToken, connectWallet, checkNetwork } = useContext(CyberConnectAuthContext)

  const [loginGetMessage] = useMutation(LOGIN_GET_MESSAGE)
  const [loginVerify] = useMutation(LOGIN_VERIFY)

  const handleClick = async () => {
    if (address && accessToken) return

    try {
      const provider = await connectWallet()
      await checkNetwork(provider)

      const signer = provider.getSigner()
      const address = await signer.getAddress()

      const messageResult = await loginGetMessage({
        variables: {
          input: {
            address,
            domain: 'morphis.network',
          },
        },
      })
      const message = messageResult?.data?.loginGetMessage?.message

      const signature = await signer.signMessage(message)

      const accessTokenResult = await loginVerify({
        variables: {
          input: {
            address,
            domain: 'morphis.network',
            signature: signature,
          },
        },
      })
      const accessToken = accessTokenResult?.data?.loginVerify?.accessToken
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        setAccessToken(accessToken)
      }
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to sign in')
    }
  }

  return (
    <Button
      className={cl([classNames])}
      onClick={handleClick}
      variant="outlined"
      {...restProps}
    >
      {address && accessToken ? `cyberconnect : ${address}` : 'CyberConnect'}
    </Button>
  )
}

export default CCSignInButton
