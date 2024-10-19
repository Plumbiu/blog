import React, { ReactNode } from 'react'
import './Markdown.css'
import {
  BashIcon,
  JavaScriptIcon,
  JsonIcon,
  JsxIcon,
  ReactIcon,
  RustIcon,
  ShellIcon,
  TsxIcon,
  TypeScriptIcon,
  VueIcon,
} from '@/components/Icons'

import { transfrom2Jsx } from '@/utils/node/transfrom'

const iconMap: Record<string, ReactNode> = {
  javascript: <JavaScriptIcon />,
  typescript: <TypeScriptIcon />,
  rust: <RustIcon />,
  react: <ReactIcon />,
  jsx: <JsxIcon />,
  tsx: <TsxIcon />,
  vue: <VueIcon />,
  json: <JsonIcon />,
  shell: <ShellIcon />,
  bash: <BashIcon />,
}

function Markdown({ content }: { content: string }) {
  return <div className="md">{transfrom2Jsx(content)}</div>
}

export default Markdown
