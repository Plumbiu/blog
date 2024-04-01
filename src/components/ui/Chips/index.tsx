/* eslint-disable @stylistic/multiline-ternary */
import type { FC } from 'react'
import Tag from '@/components/ui/Tag'
import './index.css'

interface Props {
  chips: Tag[] | Category[]
  path: string
}

const Chips: FC<Props> = ({ chips, path }) => {
  return (
    <div className="Chips">
      {chips.map(({ name }) => (
        <Tag key={name} link={`/${path}/${name}`} text={name} />
      ))}
    </div>
  )
}

export default Chips
