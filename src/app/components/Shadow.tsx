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
  const [root, setRoot] = useState<ShadowRoot | HTMLDivElement>()
  useEffect(() => {
    try {
      const dom = ref.current!
      let root: any
      if (shadow) {
        root = dom.attachShadow({
          mode,
        })
        setRoot(root)
      } else {
        setRoot(dom)
      }
    } catch (error) {}
  }, [])
  return (
    <div ref={ref} {...rest}>
      {!!root && createPortal(children, root)}
    </div>
  )
}

export default ReactShadowRoot
