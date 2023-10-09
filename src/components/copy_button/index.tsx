'use client'

import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

import CopyIcon from 'public/icons/copy.svg'
import CheckIcon from 'public/icons/check.svg'

const CopyButton = ({ copyText, children }: { copyText: string; children: React.ReactNode }) => {
  const [copied, setCopied] = useState(false)
  const [, copy] = useCopyToClipboard()

  const onCopy = () => {
    if (copied) return

    copy(copyText)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 500)
  }

  return (
    <button
      className="flex items-center gap-1 font-medium transition-colors hover:text-[#666666]"
      onClick={onCopy}
    >
      <span>{children}</span>
      <span className="h-4 w-4">{copied ? <CheckIcon /> : <CopyIcon />}</span>
    </button>
  )
}

export default CopyButton
