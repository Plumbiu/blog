import { isString } from '@/lib/types'

export const getLanguage = (className?: any) => {
  if (className == null) {
    return 'txt'
  }
  if (isString(className)) {
    className = className.split(' ')
  }
  for (const classListItem of className) {
    if (isString(classListItem) && classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase()
    }
  }
  return 'txt'
}

export const HighLightWordClassName = 'highlight-word'
export const HighLightLineClassName = 'highlight-line'
export const DiffInsertedClassName = 'inserted'
export const DiffDeletedClassName = 'deleted'
