'use client'

import { useState } from 'react'
import { Slide, ToastContainer, toast } from 'react-toastify'
import { usePost } from '@/lib/api'
import { perfixTime } from '@/lib/time'
import './index.css'

const MessageCmp = () => {
  const [payload, setPayload] = useState<Pick<IMessage, 'name' | 'words'>>({
    name: '',
    words: '',
  })
  async function handleComment() {
    const message: IMessage = {
      ...payload,
      date: perfixTime(Date.now()),
    }
    const { msg, type } = await usePost<{
      msg: string
      type: 'success' | 'error'
    }>('message', message)
    toast(msg, {
      type,
    })
  }

  return (
    <div className="Message">
      <div className="Message-Ipt-Wrap">
        <input
          type="text"
          onChange={e => {
            setPayload({
              ...payload,
              name: e.currentTarget.value,
            })
          }}
          value={payload.name}
          placeholder="GitHub 用户名"
        />
      </div>
      <div className="Message-Ipt-Wrap">
        <input
          type="text"
          onChange={e => {
            setPayload({
              ...payload,
              words: e.currentTarget.value,
            })
          }}
          value={payload.words}
          placeholder="想对我说的话"
        />
      </div>
      <div
        className="Hover Btn-Link"
        onClick={() => {
          void handleComment()
        }}
      >
        留言
      </div>
      <ToastContainer transition={Slide} autoClose={250} hideProgressBar />
    </div>
  )
}

export default MessageCmp
