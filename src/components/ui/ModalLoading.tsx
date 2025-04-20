import { LoadingIcon } from '../Icons'
import Modal from './Modal'

interface ModalLoadingProps {
  hide: () => void
}

export default function ModalLoading({ hide }: ModalLoadingProps) {
  return (
    <Modal className="fcc" onClick={hide}>
      <LoadingIcon fontSize={64} />
    </Modal>
  )
}
