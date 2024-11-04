const tokens = {
  size: {
    height: {
      header: 76,
    },
    width: {
      center: '50%',
      'max-center': 840,
    },
  },
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
  },
}

export const configColors = {
  ...tokens,
  bg: {
    hover: ['rgba(0, 0, 0, 0.06)', 'rgba(255, 255, 255, 0.08)'],
    pure: ['#fff', '#000'],
    pre: ['#fafafa', '#0e0e0e'],
    code: ['#ddeef8', '#272e35'],
    quote: {
      info: ['#e9eaff', '#272843'],
      warn: ['#fcf4dc', '#3d341b'],
      danger: ['#fde4e8', '#270a0f'],
    },
    canvas: {
      default: ['#fff', '#101010'],
      subtle: ['#f6f8fa', '#222'],
    },
    cube: ['#999', '#444'],
    'hightline-line': ['rgba(218, 230, 240, 0.5)', 'rgba(47, 55, 68, 0.5)'],
  },
  text: {
    pure: ['#000', '#fff'],
    1: ['rgb(60, 60, 68)', 'rgba(245, 245, 245, 0.86)'],
    2: ['rgba(60, 60, 67, 0.78)', 'rgba(235, 235, 245, 0.6)'],
    3: ['rgba(60, 60, 67, 0.56)', 'rgba(235, 235, 245, 0.38)'],
    hover: ['#333'],
    gray: [
      ['#dddde3', '#515c67'],
      ['#e4e4e9', '#414853'],
      ['#ebebef', '#32363f'],
    ],
    'gray-soft': ['rgba(142, 150, 170, 0.14)', 'rgba(101, 117, 133, 0.16)'],
    indigo: [
      ['#3451b2', '#a8b1ff'],
      ['#3a5ccc', '#5c73e7'],
      ['#5672cd', '#3e63dd'],
    ],
    'indigo-soft': ['rgba(100, 108, 255, 0.14)', 'rgba(100, 108, 255, 0.16)'],
    purple: [
      ['#6f42c1', '#a8b1ff'],
      ['#7e4cc9', '#5c73e7'],
      ['#8e5cd9', '#3e63dd'],
    ],
    'purple-soft': ['rgba(159, 122, 234, 0.14)', 'rgba(159, 122, 234, 0.16)'],
    green: [
      ['#18794e', '#3dd68c'],
      ['#299764', '#30a46c'],
      ['#30a46c', '#298459'],
    ],
    'green-soft': ['rgba(16, 185, 129, 0.14)', 'rgba(16, 185, 129, 0.16)'],
    yellow: [
      ['#915930', '#f9b44e'],
      ['#946300', '#da8b17'],
      ['#9f6a00', '#a46a0a'],
    ],
    'yellow-soft': ['rgba(234, 179, 8, 0.14)', 'rgba(234, 179, 8, 0.16)'],
    red: [
      ['#b8272c', '#f66f81'],
      ['#d5393e', '#f14158'],
      ['#e0575b', '#b62a3c'],
    ],
    'red-soft': ['rgba(244, 63, 94, 0.14)', 'rgba(244, 63, 94, 0.16)'],
  },
  border: { divider: ['#e2e2e5', '#2e2e32'] },
}

function makeThemeColors(colors: Record<string, any>) {
  const light: Record<string, any> = {}
  const dark: Record<string, any> = {}
  for (const key in colors) {
    if (!light[key]) {
      light[key] = {}
    }
    if (!dark[key]) {
      dark[key] = {}
    }
    const value = colors[key]
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (isPlainArr(value)) {
          if (value.length === 2) {
            light[key] = value[0]
            dark[key] = value[1]
          }
        } else {
          light[key] = makeThemeColors(value).light
          dark[key] = makeThemeColors(value).dark
        }
      } else {
        light[key] = makeThemeColors(value).light
        dark[key] = makeThemeColors(value).dark
      }
    } else {
    }
  }

  return { light, dark }
}

const colors = makeThemeColors(configColors)

const result = {
  colors,
  tokens,
}

export default result

function isPlainArr(arr: Array<any>) {
  return arr.flat(1).length === arr.length
}
