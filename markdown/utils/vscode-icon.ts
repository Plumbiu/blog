import { DefaultFile } from '../plugins/remark/code/file-tree/file-tree-utils'
import { getSuffix } from '../plugins/utils'
import {
  FileNameIconMap,
  ExtensionIconMap,
  NamedIconMap,
} from './vscode-icon-map'

export function getIconExt(s: string) {
  if (FileNameIconMap[s]) {
    return s
  }
  const suffix = getSuffix(s, '')
  return suffix || '__'
}

export function getIconFromFileName(filename: string) {
  if (FileNameIconMap[filename]) {
    return FileNameIconMap[filename]
  }
  if (NamedIconMap[filename]) {
    return NamedIconMap[filename]
  }
  const extIdx = filename.lastIndexOf('.')
  if (extIdx === -1) {
    return DefaultFile
  }
  const ext = filename.slice(extIdx + 1)
  return ExtensionIconMap[ext] || DefaultFile
}
