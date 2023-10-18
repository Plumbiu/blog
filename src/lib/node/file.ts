export function isFileNameLegal(file: string) {
  return file.search(/['"*<>\?\\\/\|:]/) === -1 && file.length < 255
}
