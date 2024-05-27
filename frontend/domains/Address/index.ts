export type Address = string

declare const ChecksumAddressSymbol: unique symbol

export type ChecksumAddress = `0x${string}` & typeof ChecksumAddressSymbol
