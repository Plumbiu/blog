import Link from 'next/link'
import './index.css'

const AboutCmp = () => {
  return (
    <div className="About">
      <div>
        <span>文章作者</span>
        <Link href="https://github.com/Plumbiu">Plumbiu(Guo Xingjun)</Link>
      </div>
      <div>
        <span>文章链接首页</span>
        <Link href="/">https://blog.plumbiu.top/</Link>
      </div>
      <div>
        <span>版权声明</span>
        <Link href="https://creativecommons.org/licenses/by-nc-sa/3.0/cn/deed.zh-hans">CC BY-NC-SA 3.0 CN DEED</Link>
      </div>
    </div>
  )
}

export default AboutCmp
