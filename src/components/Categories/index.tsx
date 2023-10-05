import type { FC } from 'react'
import Badge from '../ui/Badge'
import Stack from '../ui/Stack'
import Tag from '../ui/Tag'

interface Props {
  categories: Category[]
}

const CategoriesCmp: FC<Props> = ({ categories }) => {
  return (
    <Stack>
      {categories.map(({ name, count }) => (
        <Badge key={name} count={count}>
          <Tag link={'/categories/' + name} text={name} plain />
        </Badge>
      ))}
    </Stack>
  )
}

export default CategoriesCmp
