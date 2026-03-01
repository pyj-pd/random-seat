export const downloadFile = (fileName: string, blob: Blob, type: string): void => {
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = fileName

  document.body.appendChild(a)
  a.click()

  URL.revokeObjectURL(url)
  document.body.removeChild(a)
  a.remove()
}
