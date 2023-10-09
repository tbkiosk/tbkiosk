'use client'

import TypewriterEffect from 'typewriter-effect'
import { useMediaQuery } from 'usehooks-ts'
import clsx from 'clsx'

const Typewriter = () => {
  const largeScreenFlag = useMediaQuery('(min-width: 48em)')

  return (
    <div className="h-[160px] px-4 text-center md:h-[172px]">
      <TypewriterEffect
        onInit={typewriter => {
          typewriter
            .typeString(`<span style="font-family: pixeloid-mono; font-size: ${largeScreenFlag ? '56px' : '24px'}">Discover  </span>`)
            .typeString(`<span style="color: #fd222a; font-size: ${largeScreenFlag ? '56px' : '24px'}">ERC-6551</span>`)
            .typeString('<br /><br />')
            .changeDelay(80)
            .typeString(
              `<span style="font-family: pixeloid-mono; font-size: ${
                largeScreenFlag ? '24px' : '16px'
              }">Finding and exploring the latest and greatest ERC-6551 projects</span>`
            )
            .start()
        }}
        options={{
          autoStart: true,
          cursorClassName: clsx('text-xl md:text-[32px]', 'Typewriter__cursor'),
          delay: 120,
        }}
      />
    </div>
  )
}

export default Typewriter
