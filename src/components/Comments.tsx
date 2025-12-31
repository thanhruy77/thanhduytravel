'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: false })
    if (data) setComments(data)
  }

  useEffect(() => { fetchComments() }, [postId])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !text) return
    await supabase.from('comments').insert([{ post_id: postId, user_name: name, content: text }])
    setName(''); setText(''); fetchComments()
  }

  return (
    <div className="mt-20 border-t pt-10">
      <h3 className="text-2xl font-black mb-8">Bình luận</h3>
      <form onSubmit={send} className="grid gap-4 mb-10">
        <input className="p-3 border rounded-xl" placeholder="Tên mày..." value={name} onChange={e => setName(e.target.value)} />
        <textarea className="p-3 border rounded-xl h-24" placeholder="Nói gì đó đi..." value={text} onChange={e => setText(e.target.value)} />
        <button className="bg-black text-white py-3 rounded-xl font-bold">Gửi</button>
      </form>
      <div className="space-y-4">
        {comments.map(c => (
          <div key={c.id} className="p-4 bg-gray-50 rounded-2xl">
            <p className="font-bold text-sm text-gray-500 mb-1">{c.user_name}</p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}