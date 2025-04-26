import type { Link, Text } from 'mdast'
import { getRawValueFromPosition } from './utils'
import keywordsMap, { type KeywordValue } from '~/markdown/config/keywords'
import { isString } from '@/lib/types'
import type { RemarkParent } from '../types'

const KeywordsKeys = Object.keys(keywordsMap)
function replaceKeywords(
  node: Text,
  code: string,
  index: number | undefined,
  parent: RemarkParent,
) {
  if (!parent || index == null || parent.type === 'link') {
    return
  }
  const rawValue = getRawValueFromPosition(code, node)
  if (!rawValue) {
    return
  }
  for (const key of KeywordsKeys) {
    const regx = new RegExp(key, 'g')
    let m: RegExpExecArray | null = null
    const valueData: (string | KeywordValue)[] = []
    let lastIndex = 0
    while ((m = regx.exec(`${rawValue}`))) {
      const [match] = m
      if (match && rawValue[m.index - 1] !== '\\') {
        const data = keywordsMap[match]
        if (data) {
          valueData.push(node.value.slice(lastIndex, m.index))
          valueData.push({ ...data, value: data.value ?? key })
          lastIndex = m.index + key.length
          // node.value = value
        }
      }
    }
    lastIndex !== 0 && valueData.push(node.value.slice(lastIndex))
    if (valueData.length) {
      const children: (Text | Link)[] = valueData.map((item) => {
        if (isString(item)) {
          return {
            type: 'text',
            value: item,
          }
        }
        return {
          type: 'link',
          properties: item.properties,
          url: item.url,
          children: [
            {
              type: 'text',
              value: item.value!,
            },
          ],
        }
      })
      parent.children.splice(index, 1, ...children)
    }
  }
}

export default replaceKeywords
