'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Để cho nhanh tao check pass 123, mày có thể đổi ADMIN_PASSWORD trong .env
    if (password === '123') {
      document.cookie = "is_admin=true; path=/; max-age=86400"
      window.location.href = '/admin'
    } else {
      alert("Mật khẩu này không dành cho người thường!")
    }
  }

  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-10 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter">BẢO MẬT.</h1>
          <p className="text-gray-400 mt-2 font-medium">Vui lòng nhập mã truy cập để tiếp tục</p>
        </div>
        
        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full bg-gray-100 border-none p-5 rounded-2xl text-center text-2xl tracking-[1em] focus:ring-2 ring-black transition outline-none"
            onChange={e => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            onClick={handleLogin} 
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-2xl shadow-black/20"
          >
            Xác nhận danh tính
          </button>
        </div>
      </div>
    </div>
  )
}