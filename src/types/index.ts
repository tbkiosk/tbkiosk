export type ThirdWebError = {
  reason: string
}

export type TbaPrefs = {
  active: boolean
  lastBridge: number
  preference: string
  tbaAddress: string
}

export type TbaUser = TbaPrefs & {
  balance: number
}
