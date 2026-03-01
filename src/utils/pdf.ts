import type { SeatOrientation } from '@/types/seat'
import jsPDF from 'jspdf'
import 'svg2pdf.js'

const PDF_FORMAT = 'a4'
export const PDF_MIME_TYPE = 'application/pdf'

const FONT_FILE_URL = `${import.meta.env.BASE_URL}fonts/happiness-sans-print.ttf`
const FONT_FILENAME = 'HappinessSans.ttf'
const FONT_NAME = 'HappinessSans'

const PAPER_SAFE_PADDING = 20

export const generateSeatPDF = async (
  svgElement: SVGSVGElement,
  orientation: SeatOrientation,
): Promise<Blob> => {
  const doc = new jsPDF({
    orientation,
    format: PDF_FORMAT,
    putOnlyUsedFonts: true,
  })

  const { width: pageWidth, height: pageHeight } = doc.internal.pageSize

  // Load font file
  const fontData = await loadFontFile(FONT_FILE_URL)
  doc.addFileToVFS(FONT_FILENAME, fontData)
  doc.addFont(FONT_FILENAME, FONT_NAME, 'normal')
  doc.setFont(FONT_NAME)

  const element = svgElement.cloneNode(true) as SVGSVGElement
  element.setAttribute('font-family', FONT_NAME)
  element.removeAttribute('font-weight') // It breaks text rendering

  const width = pageWidth - PAPER_SAFE_PADDING * 2
  const height = pageHeight - PAPER_SAFE_PADDING * 2

  await doc.svg(element, {
    // Center
    x: doc.internal.pageSize.width / 2 - width / 2,
    y: doc.internal.pageSize.height / 2 - height / 2,

    width,
    height,
  })

  return doc.output('blob')
}

/**
 * Loads font file that can be used for PDF generation.
 * @param url Font file URL
 * @returns Base64-encoded font file data
 */
const loadFontFile = async (url: string): Promise<string> => {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  const array = new Uint8Array(arrayBuffer)

  let binary = ''
  for (let i = 0; i < array.length; i++) {
    binary += String.fromCharCode(array[i]!)
  }

  return btoa(binary)
}

export const generatePDFFileName = (): string => {
  const now = new Date()
  const dateString = now.toISOString().replace(':', '')

  return `자리배치-${dateString}.pdf`
}
