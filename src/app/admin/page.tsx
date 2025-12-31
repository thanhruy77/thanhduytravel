'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CldUploadWidget } from 'next-cloudinary'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'write'>('list')
  const [posts, setPosts] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  const handleDelete = async (post: any) => {
    if (!confirm(`Xóa sạch bài "${post.title}" cùng toàn bộ ảnh, like và comment?`)) return
    setLoading(true)

    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    const allImages = post.thumbnail_url ? [post.thumbnail_url] : [];
    while ((match = imgRegex.exec(post.content)) !== null) {
      allImages.push(match[1]);
    }

    const { error: dbError } = await supabase.from('posts').delete().eq('id', post.id)
    if (dbError) {
      alert("Lỗi DB: " + dbError.message);
      setLoading(false);
      return;
    }

    try {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls: allImages })
      })
    } catch (e) { console.error("Lỗi xóa ảnh"); }

    alert("Đã xóa xong!");
    fetchPosts();
    setLoading(false);
  }

  const handlePublish = async () => {
    if (!title || !thumbnail || !content) return alert("Thiếu tiêu đề, nội dung hoặc ảnh bìa!")
    setLoading(true)

    // Tạo slug
    const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/([^0-9a-z-\s])/g, '').replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');

    // Gửi lên DB: thumbnail_url là ảnh bìa, images là mảng tất cả ảnh đã upload
    const { error } = await supabase.from('posts').insert([
      {
        title,
        slug,
        description,
        content,
        thumbnail_url: thumbnail,
        images: images // Đẩy cả mảng ảnh vào đây
      }
    ])

    if (!error) {
      alert("Đăng bài thành công!");
      window.location.reload();
    } else {
      alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* HEADER: Responsive linh hoạt */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-[#0369a1]">ADMIN_PANEL.</h1>
          <div className="flex bg-slate-200 p-1.5 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-[#0ea5e9]' : 'text-slate-500'}`}
            >
              Danh sách
            </button>
            <button
              onClick={() => setActiveTab('write')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase transition-all ${activeTab === 'write' ? 'bg-white shadow-sm text-[#0ea5e9]' : 'text-slate-500'}`}
            >
              Viết bài mới +
            </button>
          </div>
        </header>

        {activeTab === 'list' ? (
          <div className="grid gap-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={post.thumbnail_url || ''} className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0" alt="" />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-800 truncate">{post.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(post)} className="w-full sm:w-auto text-red-500 font-black text-[10px] uppercase px-6 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                  Xóa bài viết
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* CỘT TRÁI: SOẠN THẢO (12/12 trên mobile) */}
            <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <input
                  type="text"
                  placeholder="Tiêu đề hành trình..."
                  className="w-full text-2xl md:text-4xl font-black outline-none border-b-4 border-slate-100 focus:border-[#38bdf8] py-2 transition-colors"
                  onChange={e => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Mô tả ngắn gọn (hiển thị ở trang chủ)..."
                  className="w-full p-5 rounded-2xl bg-slate-50 border-none outline-none h-24 text-sm font-medium focus:ring-2 ring-[#38bdf8]"
                  onChange={e => setDescription(e.target.value)}
                />
                <textarea
                  placeholder="Nội dung chi tiết (Markdown)..."
                  className="w-full p-6 rounded-[2rem] bg-slate-50 border-none outline-none h-[400px] md:h-[600px] text-sm font-mono focus:ring-2 ring-[#38bdf8]"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full bg-[#0369a1] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200 disabled:bg-slate-300 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {loading ? 'Đang xuất bản...' : 'XUẤT BẢN BÀI VIẾT'}
                </button>
              </div>
            </div>

            {/* CỘT PHẢI: MEDIA (Hiện trên cùng khi ở mobile) */}
            <aside className="lg:col-span-4 space-y-6 order-1 lg:order-2">
              <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm lg:sticky lg:top-24">
                <h3 className="font-black text-[10px] uppercase tracking-widest text-[#0ea5e9] mb-4">Thư viện Media ({images.length})</h3>

                <CldUploadWidget
                  uploadPreset="x6bjatxk"
                  onSuccess={(res: any) => setImages(prev => [res.info.secure_url, ...prev])}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all mb-6"
                    >
                      + Tải ảnh lên
                    </button>
                  )}
                </CldUploadWidget>

                <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] md:max-h-[500px] pr-2 custom-scrollbar">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${thumbnail === img ? 'border-[#38bdf8]' : 'border-transparent shadow-sm'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="img" />

                      {/* Lớp phủ chứa 2 nút (Dễ bấm hơn trên Mobile) */}
                      <div className="absolute inset-0 bg-slate-900/60 flex flex-col gap-2 p-2 items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.preventDefault(); setThumbnail(img); }}
                          className="w-full bg-white text-[9px] font-black uppercase py-2 rounded-lg shadow-xl"
                        >
                          Làm bìa
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); setContent(prev => prev + `\n\n![anh](${img})\n`); }}
                          className="w-full bg-[#0ea5e9] text-white text-[9px] font-black uppercase py-2 rounded-lg shadow-xl"
                        >
                          Chèn bài
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[9px] text-slate-400 font-bold uppercase tracking-tighter text-center">Tap/Hover ảnh để thao tác</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}