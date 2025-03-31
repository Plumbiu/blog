// based on https://github.com/vordgi/classnames-minifier/blob/main/src/lib/ConverterMinified.ts
// LICENSE: https://github.com/vordgi/classnames-minifier/blob/main/LICENSE
class ConverterMinified {
  private prefix: string
  private reservedNames: string[]
  private symbols: string[] = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ]

  freeClasses: string[] = []

  lastIndex = 0

  private nextLoopEndsWith = 26

  private currentLoopLength = 0

  private nameMap = [0]

  constructor({ prefix = '', reservedNames = [] }: any) {
    this.prefix = prefix
    this.reservedNames = reservedNames
  }

  reset = () => {
    this.freeClasses = []
    this.lastIndex = 0
    this.nextLoopEndsWith = 26
    this.currentLoopLength = 0
    this.nameMap = [0]
  }

  private generateClassName() {
    const symbolsCount = 62
    if (this.lastIndex >= this.nextLoopEndsWith) {
      if (this.nextLoopEndsWith === 26) {
        this.nextLoopEndsWith = 62 * symbolsCount
      } else {
        this.nextLoopEndsWith *= symbolsCount
      }
      this.nameMap.push(0)
      this.currentLoopLength += 1
    }

    const currentClassname =
      this.prefix + this.nameMap.map((e) => this.symbols[e]).join('')

    for (let i = this.currentLoopLength; i >= 0; i--) {
      if (
        this.nameMap[i] === symbolsCount - 1 ||
        (i === 0 && this.nameMap[i] === 25)
      ) {
        this.nameMap[i] = 0
      } else {
        this.nameMap[i] += 1
        break
      }
    }

    return currentClassname
  }

  private getTargetClassName(origName: string) {
    let targetClassName = this.generateClassName()

    if (this.reservedNames.includes(targetClassName)) {
      targetClassName = this.getTargetClassName(origName)
      this.lastIndex += 1
    }

    return targetClassName
  }

  getId(origName: string) {
    const targetClassName = this.getTargetClassName(origName)

    this.lastIndex += 1
    return targetClassName
  }
}

const minifier = new ConverterMinified({ prefix: '' })
// xxxName should not use this
export function generatePluginKey(devName: string) {
  if (process.env.NODE_ENV === 'development') {
    return devName
  }
  return minifier.getId(devName)
}
