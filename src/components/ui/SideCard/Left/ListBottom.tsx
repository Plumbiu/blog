import Button from '../../Button'
import Stack from '../../Stack'

const info = [
  {
    primary: '朋友们',
    href: '/friends',
  },
  {
    primary: '留言板',
    href: '/comments',
  },
  {
    primary: '开源之旅',
    href: '/opensource',
  },
]

const ListBottom = () => {
  return (
    <Stack>
      {info.map(({ primary, href }) => (
        <Button key={primary} link={href}>
          {primary}
        </Button>
      ))}
    </Stack>
  )
}

export default ListBottom
