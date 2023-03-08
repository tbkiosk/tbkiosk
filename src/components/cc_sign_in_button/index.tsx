import { useContext } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/client'
import cl from 'classnames'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

import Button from '../button'

import { LOGIN_GET_MESSAGE } from '@/graphql'
import LOGIN_VERIFY from '@/graphql/login_verify'

type CCSignInButtonProps = {
  classNames?: string
}

const CCSignInButton = ({ classNames }: CCSignInButtonProps) => {
  const { setAccessToken, connectWallet, checkNetwork } = useContext(CyberConnectAuthContext)

  const [loginGetMessage] = useMutation(LOGIN_GET_MESSAGE)
  const [loginVerify] = useMutation(LOGIN_VERIFY)

  const handleClick = async () => {
    try {
      const provider = await connectWallet()
      await checkNetwork(provider)

      const signer = provider.getSigner()
      const address = await signer.getAddress()

      const messageResult = await loginGetMessage({
        variables: {
          input: {
            address,
            domain: location.host,
          },
        },
      })
      const message = messageResult?.data?.loginGetMessage?.message

      const signature = await signer.signMessage(message)

      const accessTokenResult = await loginVerify({
        variables: {
          input: {
            address,
            domain: location.host,
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
      toast((err as Error)?.message || 'Failed to sign in')
    }
  }

  return (
    <Button
      className={cl([classNames])}
      onClick={handleClick}
      variant="outlined"
    >
      CyberConnect Sign in
    </Button>
  )
}

export default CCSignInButton
