import { DefaultFile } from '~/markdown/plugins/remark/code/file-tree/file-tree-utils'

const ImageIcon = ({ icon }: { icon: string }) => {
  return (
    <img
      data-no-view
      alt="icon"
      width="16"
      height="16"
      src={`/vscode-icons/${icon || DefaultFile}.svg`}
    />
  )
}

export default ImageIcon
