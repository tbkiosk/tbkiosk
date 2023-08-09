import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/discover')
  }, [])

  return (
    <>
      <Head>
        <title>Kiosk</title>
      </Head>
    </>
  )
}

export default Index
