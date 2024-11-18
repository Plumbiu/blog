import { clsx } from 'clsx'
import Link from 'next/link'
import { BiliBiliIcon, CodeIcon, GithubIcon } from '@/app/components/Icons'
import IconCard from '@/app/components/IconCard'
import styles from './page.module.css'

function About() {
  return (
    <div className={clsx(styles.wrap, 'center')}>
      <div className={styles.left}>
        <h1 className={styles.hi}> Hi, I'm Plumbiu 👋</h1>
        <div className={styles.tag}>
          <IconCard icon="#" text="Developer" />
          <IconCard icon="#" text="Student" />
        </div>
        <div className={styles.desc}>
          I'm a college student from China, currently studying electronic
          information at Hangzhou Dianzi University. Passion for open source and
          recording my learning experience. I really hope you can give me
          constructive suggestions on my blog. THX !
        </div>
        <div className={styles.exp}>
          <ul>
            <li>I started learning programming in 2021.</li>
            <li>I landed my first job as a Web developer in 2024.03.16</li>
            <li>I started building this blog in 2024.10.01</li>
          </ul>
        </div>
        <div></div>
        <div className={styles.tag}>
          <IconCard icon="#" text="Web " />
          <IconCard icon="#" text="Programming" />
        </div>
        <div>
          If you are interested in this blog:{' '}
          <Link
            className="link"
            target="_blank"
            href="/posts/blog/How-I-Build-My-Blog"
          >
            How this blog works
          </Link>
        </div>
        <div className={styles.links}>
          <Link target="_blank" href="https://github.com/Plumbiu">
            <GithubIcon />
          </Link>
          <Link target="_blank" href="https://www.bilibili.com/">
            <BiliBiliIcon />
          </Link>
        </div>
        <div>Happy reading! 🍺</div>
      </div>
      <div className={styles.right}>{/* <CodeIcon /> */}</div>
    </div>
  )
}

export default About