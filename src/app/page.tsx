import { clsx } from 'clsx'
import { Fragment, ReactNode } from 'react'
import Link from 'next/link'
import {
  BiliBiliIcon,
  CssIcon,
  GithubIcon,
  GoIcon,
  HTMLIcon,
  JavaScriptIcon,
  MarkdownIcon,
  NextjsIcon,
  NodejsIcon,
  NuxtjsIcon,
  PnpmIcon,
  ReactIcon,
  TauriIcon,
  TypeScriptIcon,
  ViteIcon,
  VueIcon,
  WebpackIcon,
  YarnIcon,
} from './components/Icons'
import styles from './page.module.css'

const languages = [
  <JavaScriptIcon />,
  <TypeScriptIcon />,
  <CssIcon />,
  <HTMLIcon />,
  <GoIcon />,
]

const frameworks = [
  <VueIcon />,
  <ReactIcon />,
  <NodejsIcon />,
  <NextjsIcon />,
  <NuxtjsIcon />,
  <TauriIcon />,
]

const tools = [
  <ViteIcon />,
  <WebpackIcon />,
  <MarkdownIcon />,
  <PnpmIcon />,
  <YarnIcon />,
]

function App() {
  return (
    <div className={clsx('center', styles.wrap)}>
      <h1>Plumbiu</h1>
      <p>Hi, I'm Plumbiu, a frontend developer.</p>
      <div>
        <div className={styles.skill}>
          <div>Languages </div>
          {languages.map((lang, key) => (
            <Fragment key={key}>{lang}</Fragment>
          ))}
        </div>
        <div className={styles.skill}>
          <div>Framework/Runtime </div>
          {frameworks.map((lang, key) => (
            <Fragment key={key}>{lang}</Fragment>
          ))}
        </div>
        <div className={styles.skill}>
          <div>Tool </div>
          {tools.map((lang, key) => (
            <Fragment key={key}>{lang}</Fragment>
          ))}
        </div>
      </div>
      <h2>Some words</h2>
      <div>
        I've studied a lot of things, but I can't say I'm familiar with them. In
        my opinion, being familiar with some skills is not about how proficient
        you memorize them, but about being able to quickly review their
        documents.
      </div>
      <div>
        I spent two weeks learning rust and refactored a previous project with
        rust, but now I have almost forgotten the syntax of rust. It is a bad
        thing to forget what I have learned before. Fortunately, I can regain
        them in the future. But now I focus on the front end.
      </div>
      <h2>Connect Me</h2>
      <div>
        <div className={styles.links}>
          <span>Often appears in </span>
          <Link
            target="_blank"
            className="link"
            href="https://github.com/Plumbiu"
          >
            <GithubIcon />
            Github
          </Link>
          <Link
            target="_blank"
            className="link"
            href="https://github.com/Plumbiu"
          >
            <BiliBiliIcon />
            哔哩哔哩
          </Link>
        </div>
      </div>
      <div>
        Connect me at <strong>`plumbiuzz@gmail.com`</strong>. Or add an issue to
        my{' '}
        <Link
          target="_blank"
          className="link"
          href="https://github.com/Plumbiu/blog"
        >
          Blog repo
        </Link>{' '}
        so I can see it faster.
      </div>
      <h2>You may interested</h2>
      <ul>
        <li>
          <Link
            className="link"
            target="_blank"
            href="/posts/blog/How-I-Build-My-Blog"
          >
            How this blog works
          </Link>
        </li>
        <li>
          Some interesting tech:{' '}
          <Link className="link" target="_blank" href="/list/blog">
            Blog
          </Link>
        </li>
        <li>
          Learn/Review tech:{' '}
          <Link className="link" target="_blank" href="/list/blog">
            Note
          </Link>
        </li>
        <li>
          The annual summary:{' '}
          <Link className="link" target="_blank" href="/list/blog">
            Summary
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default App
