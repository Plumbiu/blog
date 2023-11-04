import Link from 'next/link'
import './index.css'

const Footer = () => {
  return (
    <div className="Footer">
      <div className="Footer-First">©2023 Plumbiu</div>
      <div className="Footer-CopyRight">
        <div>框架 <b>Nextjs</b></div>
        <span>|</span>
        <Link
          // eslint-disable-next-line @stylistic/max-len
          href="https://creativecommons.org/licenses/by-nc-sa/3.0/cn/deed.zh-hans"
        >
          Copyright
        </Link>
      </div>
    </div>
  )
}

export default Footer
