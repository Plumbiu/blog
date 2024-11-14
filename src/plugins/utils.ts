interface CommonReamrkNode {
  data?: {
    hProperties?: any
  }
}

export function addNodeClassName(node: CommonReamrkNode, className: string) {
  const props = node?.data?.hProperties
  if (!props) {
    return
  }
  const originClassName = props.class?.trim() ?? ''
  props.class = `${originClassName} ${className} `
}

export function makeProperties(node: CommonReamrkNode) {
  if (!node.data) {
    node.data = {}
  }
  if (!node.data.hProperties) {
    node.data.hProperties = {}
  }
}

export function buildPlaygroundHandlerFunction<T>(key: string, fn?: Function) {
  return (props: any, value?: string | boolean | number): T => {
    const v = props[key]
    if (value == null) {
      if (fn) {
        return fn(v)
      }
    } else {
      props[key] = value
    }
    return v
  }
}
