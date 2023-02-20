const DEFAULT_START_LENGTH = 5
const DEFAULT_END_LENGTH = 9
const DEFAULT_ELLIPSIS_LENGTH = 15

type EllipsisMiddleOptions = {
  minEllipsisLength?: number
  startLength?: number
  endLength?: number
}

export const ellipsisMiddle = (
  address: string,
  options?: EllipsisMiddleOptions
) => {
  const {
    minEllipsisLength = DEFAULT_ELLIPSIS_LENGTH,
    startLength = DEFAULT_START_LENGTH,
    endLength = DEFAULT_END_LENGTH,
  } = options || {}

  if (
    minEllipsisLength < 0 ||
    startLength < 0 ||
    endLength < 0 ||
    minEllipsisLength < startLength + endLength + 1
  ) {
    throw new Error('Wrong ellipsis middle options')
  }

  if (address.length <= minEllipsisLength) return address

  return `${address.substring(0, startLength)}...${address.substring(
    address.length - endLength
  )}`
}
