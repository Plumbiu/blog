import { type Element } from 'hast'

function blankTargetPlugin(node: Element) {
  if (node.tagName === 'a') {
    node.properties.target = '_blank'
    node.properties.className = 'link'
  }
}

export default blankTargetPlugin
