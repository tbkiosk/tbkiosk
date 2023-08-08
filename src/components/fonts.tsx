import { Global } from '@mantine/core'

const Fonts = () => {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'cera-variable',
            src: `url('/fonts/Cera-Variable-Demo.ttf')`,
          },
        },
        {
          '@font-face': {
            fontFamily: 'cera-variable',
            fontStyle: 'italic',
            src: `url('/fonts/Cera-Variable-Italic-Demo.ttf')`,
          },
        },
        {
          '@font-face': {
            fontFamily: 'pixeloid-mono',
            src: `url('/fonts/PixeloidMono.ttf')`,
          },
        },
      ]}
    />
  )
}

export default Fonts
