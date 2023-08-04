import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/discover')
  }, [])

  return <></>
}

export default Index
