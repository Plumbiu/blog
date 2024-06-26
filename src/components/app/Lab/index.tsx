import Card from '@/components/ui/Card'
import lab from '~/config/lab.json'

const LabCmp = () => {
  return (
    <div className="Lab">
      <div>
        <p className="Lab-Title">网站</p>
        <div>
          <div className="Lab-List">
            {lab.web.map(({ link, title, desc }) => (
              <Card
                key={title}
                width={240}
                height={158}
                link={link}
                title={title}
                desc={desc}
                bannerSrc={`/lab/${title.replace('/', '-')}.png`}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className="Lab-Title">工具</p>
        <div>
          <div className="Lab-List">
            {lab.tool.map(({ link, title, desc }) => (
              <Card
                key={title}
                width={280}
                height={158}
                link={link}
                title={title}
                desc={desc}
                bannerSrc={`/lab/${title.replace('/', '-')}.png`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabCmp
