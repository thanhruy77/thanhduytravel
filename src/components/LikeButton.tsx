'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchLikes = async () => {
      const { count } = await supabase.from('likes').select('*', { count: 'exact' }).eq('post_id', postId)
      setLikes(count || 0)
    }
    fetchLikes()
  }, [postId])

  const handleLike = async () => {
    if (isLiked) return
    const { error } = await supabase.from('likes').insert([{ post_id: postId }])
    if (!error) {
      setLikes(prev => prev + 1)
      setIsLiked(true)
    }
  }

  return (
    <button 
      onClick={handleLike}
      className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
        isLiked ? 'bg-red-50 text-red-500 scale-105' : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <span>{isLiked ? '❤️' : '🤍'}</span>
      <span>{likes}</span>
    </button>
  )
}