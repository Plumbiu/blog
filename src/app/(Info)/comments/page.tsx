'use client'
import Title from '@/components/ui/Title'
import { usePost } from '@/lib/api'
import { formatTime } from '@/lib/time'
import React, { useState } from 'react'

const Comments = () => {
  const [payload, setPayload] = useState<Pick<IComment, 'name' | 'words'>>({
    name: '',
    words: '',
  })
  async function handleComment() {
    if (payload.name && payload.words) {
      const raw = await usePost<{
        message: string
      }>('comments', {
        ...payload,
        date: formatTime(Date.now()).split(' ')[0],
      })
      if (raw.message === 'error') {
        console.log('error')
      }
    }
  }
  return (
    <>
      <Title>留言板</Title>
      <div>
        <input
          type="text"
          onChange={e => {
            setPayload({
              ...payload,
              name: e.currentTarget.value,
            })
          }}
          value={payload.name}
          placeholder="输入您的github账户"
        />
        <input
          type="text"
          onChange={e => {
            setPayload({
              ...payload,
              words: e.currentTarget.value,
            })
          }}
          value={payload.words}
          placeholder="您想对我说的话"
        />
        <button
          onClick={() => {
            void handleComment()
          }}
        >
          留言板功能还在开发中.....
        </button>
      </div>
    </>
  )
}

export default Comments
