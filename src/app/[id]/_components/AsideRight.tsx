import Link from 'next/link'
import { ReactNode } from 'react'
import {
  JavaScriptIcon,
  TypeScriptIcon,
  CssIcon,
  HTMLIcon,
  GoIcon,
  VueIcon,
  ReactIcon,
  NodejsIcon,
  NextjsIcon,
  NuxtjsIcon,
  TauriIcon,
  ViteIcon,
  WebpackIcon,
  MarkdownIcon,
  PnpmIcon,
  YarnIcon,
  BiliBiliIcon,
  GithubIcon,
} from '@/app/_components/Icons'
import IconCard from '@/app/_components/IconCard'
import styles from './AsideRight.module.css'

const languages = [
  ['HTML', <HTMLIcon />],
  ['CSS', <CssIcon />],
  ['JavaScript', <JavaScriptIcon />],
  ['TypeScript', <TypeScriptIcon />],
  ['Golang', <GoIcon />],
  ['Vue', <VueIcon />],
  ['React', <ReactIcon />],
  ['Nodejs', <NodejsIcon />],
  ['Nextjs', <NextjsIcon />],
  ['Nuxtjs', <NuxtjsIcon />],
  ['Tauri', <TauriIcon />],
  ['Vite', <ViteIcon />],
  ['Webpack', <WebpackIcon />],
  ['Markdown', <MarkdownIcon />],
  ['Pnpm', <PnpmIcon />],
  ['Yarn', <YarnIcon />],
] as const

function AsideRight() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h4 className={styles.title}>Tech Stacks</h4>
        <div className={styles.tech}>
          {languages.map(([lang, icon], key) => (
            <IconCard text={lang} icon={icon} key={key} />
          ))}
        </div>
      </div>
      <div className={styles.card}>
        <h4 className={styles.title}>About Me</h4>
        <div className={styles.about}>
          <div className={styles.about_item}>
            👋 You can call me <b>Plumbiu, Xingjun/兴俊</b>
          </div>
          <div className={styles.about_item}>
            🌎 Live in <b>Zhejiang</b>
          </div>
          <div className={styles.about_item}>
            🌐 Often appears in{' '}
            <Link
              target="_blank"
              className="link"
              href="https://github.com/Plumbiu"
            >
              <GithubIcon />
            </Link>
            <Link
              target="_blank"
              className="link"
              href="https://github.com/Plumbiu"
            >
              <BiliBiliIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AsideRight
