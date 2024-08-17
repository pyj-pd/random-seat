const SVG_BASE64_PREFIX = 'data:image/svg+xml;base64,'

export const convertSvgTextToBase64 = (svgText: string): string => {
  const encodedText = btoa(svgText)

  const result = SVG_BASE64_PREFIX + encodedText

  return result
}
