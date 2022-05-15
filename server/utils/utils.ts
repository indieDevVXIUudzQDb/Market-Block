export const addressShortener = (address: string, maxLength: number) => {
  const start = address.substring(0, maxLength)
  const end = address.substring(address.length - maxLength, address.length)
  return `${start}…${end}`
}

export const textShortener = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    const start = text.substring(0, maxLength)
    return `${start}…`
  }
  return text
}

export function readFileAsync(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as ArrayBuffer)
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(file)
  })
}
