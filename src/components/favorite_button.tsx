import { useState } from 'react'
import { ActionIcon, useMantineTheme } from '@mantine/core'

type FavoriteButtonProps = {
  defaultFavorited: boolean
  onFavorite: () => void | Promise<void>
  onUnfavorite: () => void | Promise<void>
}

const FavoriteButton = ({ defaultFavorited, onFavorite, onUnfavorite }: FavoriteButtonProps) => {
  const theme = useMantineTheme()

  const [isFavorited, setIsFavorited] = useState(defaultFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const isDarkTheme = theme.colorScheme === 'dark'

  const onFavoriteOrUnfavorite = async () => {
    setIsLoading(true)

    if (isFavorited) {
      await onUnfavorite()
      setIsFavorited(false)
    } else {
      await onFavorite()
      setIsFavorited(true)
    }

    setIsLoading(false)
  }

  return (
    <ActionIcon
      disabled={isLoading}
      onClick={() => onFavoriteOrUnfavorite()}
      size="lg"
      radius="xl"
      variant="transparent"
    >
      <i
        className="fa-regular fa-star"
        style={{ color: isFavorited ? theme.colors.yellow[3] : isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7] }}
      />
    </ActionIcon>
  )
}

export default FavoriteButton
