import { ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ShadowRootProps {
  children: ReactNode
  mode?: 'closed' | 'open'
  [key: string]: any
}

function ReactShadowRoot({
  children,
  mode = 'open',
  ...rest
}: ShadowRootProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [root, setRoot] = useState<ShadowRoot>()
  useLayoutEffect(() => {
    try {
      const dom = ref.current
      if (dom) {
        const root = dom.attachShadow({
          mode,
        })
        setRoot(root)
      }
    } catch (error) {}
  }, [])
  return (
    <div ref={ref} {...rest}>
      {root && createPortal(children, root)}
    </div>
  )
}

export default ReactShadowRoot
