export const LEGAL_REGX = /['"*<>\?\\\/\|:]/

export function isFileNameLegal(file: string) {
  return file.search(LEGAL_REGX) === -1 && file.length < 255
}
