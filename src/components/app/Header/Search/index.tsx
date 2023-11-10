'use client'

import { useState, type FC, useCallback, useRef } from 'react'
import { DocSearchButton } from '@docsearch/react/dist/esm/DocSearchButton'
import '@/styles/docsearch/button.css'
import dynamic from 'next/dynamic'
import { createPortal } from 'react-dom'
// eslint-disable-next-line @stylistic/max-len
import { useDocSearchKeyboardEvents } from '@docsearch/react/dist/esm/useDocSearchKeyboardEvents'

const DocSearchModal = dynamic(() =>
  // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
  import('@docsearch/react/dist/esm/DocSearchModal').then(
    (cmp) => cmp.DocSearchModal,
  ),
// eslint-disable-next-line @stylistic/function-paren-newline
)

interface Props {
  id: string
  apiKey: string
  name: string
}

const Search: FC<Props> = ({ id, apiKey, name }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')
  const searchButtonRef = useRef(null)
  // @ts-ignore
  import('@/styles/docsearch/modal.css')

  const onOpen = useCallback(
    function () {
      setIsOpen(true)
    },
    [setIsOpen],
  )
  const onClose = useCallback(
    function () {
      setIsOpen(false)
    },
    [setIsOpen],
  )
  const onInput = useCallback(
    function (event: { key: any }) {
      setIsOpen(true)
      setInitialQuery(event.key)
    },
    [setIsOpen, setInitialQuery],
  )
  useDocSearchKeyboardEvents({
    isOpen: isOpen,
    onOpen: onOpen,
    onClose: onClose,
    onInput: onInput,
    searchButtonRef: searchButtonRef,
  })

  return (
    <>
      <DocSearchButton ref={searchButtonRef} onClick={onOpen} />
      {isOpen &&
        createPortal(
          <DocSearchModal
            appId={id}
            apiKey={apiKey}
            indexName={name}
            onClose={onClose}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
          />,
          document.body,
        )}
    </>
  )
}

export default Search
