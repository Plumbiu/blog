import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ShadowRootProps {
  children: ReactNode
  shadow?: boolean
  mode?: 'closed' | 'open'
  [key: string]: any
}

function ReactShadowRoot({
  children,
  shadow = true,
  mode = 'open',
  ...rest
}: ShadowRootProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | HTMLDivElement>()
  useEffect(() => {
    if (!shadow) {
      return
    }
    try {
      const dom = ref.current!
      const root = dom.attachShadow({
        mode,
      })
      setShadowRoot(root)
    } catch (error) {}
  }, [shadow])
  return (
    <div ref={ref} {...rest}>
      {shadow
        ? shadowRoot
          ? createPortal(children, shadowRoot)
          : null
        : children}
    </div>
  )
}

export default ReactShadowRoot
