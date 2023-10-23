import BannerCard from '@/components/ui/Banner/Card'
import './index.css'

const tool = [
  {
    title: 'html2toc',
    link: 'https://github.com/Plumbiu/html2toc',
    desc: '将平铺的 html 结构生成目录树(toc)',
  },
  {
    title: '@plumbiu/md',
    link: 'https://github.com/Plumbiu/md',
    desc: '自己的 markdown 工具，支持 md 转 html，md 和 html 生成目录树(toc)和高亮语法',
  },
  {
    title: 'running-app',
    link: 'https://github.com/Plumbiu/running-app',
    desc: '监控 windows 程序的切换，显示其句柄标题，支持自定义配置',
  },
  {
    title: 'truth-cli',
    link: 'https://github.com/truthRestorer/truth-cli',
    desc: '引力图和树图展示依赖关系，支持 npm、yarn 和 pnpm',
  },
  {
    title: 'string-line',
    link: 'https://github.com/Plumbiu/string-line',
    desc: '查看字符串的增加和减少内容',
  },
  {
    title: 'read-glob-file',
    link: 'https://github.com/Plumbiu/read-glob-file',
    desc: '递归读取符合要求的所有文件内容',
  },
  {
    title: 'v-web',
    link: 'https://github.com/Plumbiu/v-web',
    desc: '通过 cli 命令行工具查看 vue 组件引用情况，支持在线编辑代码',
  },
  {
    title: 'readme-word-cloud',
    link: 'https://github.com/Plumbiu/readme-word-cloud',
    // eslint-disable-next-line @stylistic/max-len
    desc: '为 GitHub Profile 生成词云',
  },
  {
    title: 'js-benchmark',
    link: 'https://github.com/Plumbiu/js-benchmark',
    // eslint-disable-next-line @stylistic/max-len
    desc: 'JavaScript 中各种 API 的速度基准测试',
  },
]

const web = [
  {
    title: 'nextjs_tensorflow',
    link: 'https://nextjs-tensorflow.vercel.app/',
    desc: '使用 nextjs 和 tensorflow JavaScript API 构建的深度学习 WebUI',
  },
  {
    title: 'fe_tensorflow',
    link: 'https://fe-tensorflow.vercel.app/',
    desc: '使用 vue 和 tensorflow JavaScript API 构建的深度学习 WebUI',
  },
  {
    title: 'truth-cli-web',
    link: 'https://truth-cli.vercel.app/',
    desc: 'truth-cli 的 web 展示，采用 vue + echarts 开发',
  },
]

const LabCmp = () => {
  return (
    <div className="Lab">
      <p className="Lab-Title">工具</p>
      <div>
        <div className="Lab-List">
          {tool.map(({ link, title, desc }) => (
            <BannerCard
              width={280}
              height={158}
              key={title}
              link={link}
              title={title}
              desc={desc}
              bannerSrc={`/lab/${title.replace('@plumbiu/', '')}.png`}
            />
          ))}
        </div>
      </div>
      <p className="Lab-Title">网站</p>
      <div>
        <div className="Lab-List">
          {web.map(({ link, title, desc }) => (
            <BannerCard
              width={280}
              height={158}
              key={title}
              link={link}
              title={title}
              desc={desc}
              bannerSrc={`/lab/${title.replace('@plumbiu/', '')}.png`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LabCmp
