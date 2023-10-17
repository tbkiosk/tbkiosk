'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

import { Button } from '@nextui-org/button'

import Note from 'public/beep/note.svg'

const BeepAccountNotCreated = ({ tbaAddress, refetch }: { tbaAddress: string; refetch: () => Promise<unknown> }) => {
  const [creating, setCreating] = useState(false)

  const onCreateAccount = async () => {
    try {
      setCreating(true)

      const res = await fetch(`/api/beep/profile/${tbaAddress}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: null,
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      refetch()
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to create account')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-20 w-20 my-12">
        <Note />
      </div>
      <p className="mb-8 font-medium text-center">
        You have deployed your token bound account but the account creation has not be finished.
      </p>
      <Button
        className="h-12 w-full bg-white text-lg md:text:xl text-black rounded-full transition-colors hover:bg-[#e1e1e1]"
        isLoading={creating}
        onClick={() => onCreateAccount()}
      >
        Create account
      </Button>
    </div>
  )
}

export default BeepAccountNotCreated
