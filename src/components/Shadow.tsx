import { type ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ShadowRootProps {
  children: ReactNode
  shadow?: boolean
  mode?: 'closed' | 'open'
  [key: string]: any
}

function ReactShadowRoot({
  children,
  mode = 'open',
  ...rest
}: ShadowRootProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | HTMLDivElement>()
  useEffect(() => {
    try {
      const dom = ref.current!
      const root = dom.attachShadow({
        mode,
      })
      setShadowRoot(root)
    } catch (error) {}
  }, [])
  return (
    <div ref={ref} {...rest}>
      {shadowRoot ? createPortal(children, shadowRoot) : null}
    </div>
  )
}

export default ReactShadowRoot
