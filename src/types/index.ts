export type ThirdWebError = {
  reason: string
}

export type TbaPrefs = {
  isActive: boolean
  lastBridge: number
  gasPref: number
  address: string
}

export type TbaUser = TbaPrefs & {
  balance: number
}
