import { type Element } from 'hast'

function blankTargetPlugin(node: Element) {
  if (node.tagName === 'a') {
    node.properties.target = '_blank'
  }
}

export default blankTargetPlugin
