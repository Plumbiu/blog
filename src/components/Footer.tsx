import Link from 'next/link'
import { cn } from '@/utils/client'
import { BlogAuthor } from '~/data/site'
import styles from './Footer.module.css'

function Footer() {
  return (
    <div className={cn('center', styles.wrap)}>
      <div>
        <Link
          className="link"
          target="_blank"
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          CC BY-NC-SA 4.0
        </Link>
        <span> 2024 © {BlogAuthor}</span>
      </div>
    </div>
  )
}

export default Footer
