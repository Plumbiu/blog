/* eslint-disable @stylistic/quotes */
import { writeFileSync } from 'fs'
import vitesseDark from 'tm-themes/themes/vitesse-dark.json'
import vitesseLight from 'tm-themes/themes/vitesse-light.json'

function generateColorsMap(theme: typeof vitesseDark | typeof vitesseLight) {
  const colorsMap: Record<string, string> = {}
  const perfix = 's'
  let count = 0
  for (const token of theme.tokenColors) {
    const foreground = token.settings.foreground
    if (foreground && !colorsMap[foreground]) {
      colorsMap[foreground] = `${perfix}${count}`
      count++
    }
  }

  for (const foreground of Object.values(theme.semanticTokenColors)) {
    if (foreground && !colorsMap[foreground]) {
      colorsMap[foreground] = `${perfix}${count}`
      count++
    }
  }

  return colorsMap
}

function css(map: Record<string, string>, { prefix = '', suffix = '' }) {
  let style = prefix
  for (const [color, className] of Object.entries(map)) {
    style += `
.${className.toLocaleLowerCase()} {
  color: ${color};
}`
  }
  style += suffix
  return style
}

function generateCss() {
  const darkColorsMap = generateColorsMap(vitesseDark)

  const darkStyle = css(darkColorsMap, {
    prefix: "html[data-theme='dark'] {",
    suffix: '}',
  })
  const lightColorsMap = generateColorsMap(vitesseLight)
  const lightStyle = css(lightColorsMap, {})

  writeFileSync('src/shiki-map.json', JSON.stringify(lightColorsMap))
  writeFileSync(
    'src/app/posts/components/Markdown/shiki.css',
    darkStyle + lightStyle,
  )
}

generateCss()
