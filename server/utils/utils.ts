export const addressShortener = (address: string) => {
  const maxLength = 6
  const start = address.substring(0, maxLength)
  const end = address.substring(address.length - maxLength, address.length)
  return `${start}…${end}`
}
