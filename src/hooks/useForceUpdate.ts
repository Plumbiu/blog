import { useReducer } from 'react'

function useForceUpdate() {
  const [singal, forceUpdate] = useReducer((x) => (x = Math.random() + 0.1), 1)

  return [singal, forceUpdate] as const
}

export default useForceUpdate
