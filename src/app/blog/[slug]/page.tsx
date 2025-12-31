import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import Comments from '@/components/Comments'
import LikeButton from '@/components/LikeButton'
import Link from 'next/link'

export const revalidate = 0

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // 1. Tăng lượt xem & Lấy dữ liệu bài viết + Bài liên quan
  await supabase.rpc('increment_views', { post_slug: slug })

  const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single()
  const { data: relatedPosts } = await supabase.from('posts').select('*').neq('slug', slug).limit(4)

  if (!post) return (
    <div className="py-40 text-center">
      <h2 className="text-4xl font-serif font-black text-slate-300 uppercase italic">404 - Post Not Found</h2>
      <Link href="/" className="text-[#0ea5e9] underline mt-4 inline-block uppercase font-black text-[10px] tracking-widest">Quay lại trang chính</Link>
    </div>
  )

  return (
    <article className="bg-[#fcfcfc] min-h-screen selection:bg-[#38bdf8] selection:text-white">
      
      {/* HEADER: Ảnh bìa khổng lồ (Hero) */}
      <header className="relative h-[65vh] md:h-[85vh] w-full bg-slate-900 overflow-hidden">
        <img 
          src={post.thumbnail_url} 
          className="w-full h-full object-cover opacity-60 scale-105" 
          alt={post.title} 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Link href="/" className="group flex items-center gap-2 text-white/70 hover:text-white text-[10px] font-black uppercase tracking-[0.5em] mb-8 transition-all">
            <span className="group-hover:-translate-x-2 transition-transform">←</span> Back to Journal
          </Link>
          <h1 className="text-4xl md:text-8xl font-serif font-black text-white leading-[0.85] tracking-tighter max-w-5xl uppercase italic drop-shadow-2xl">
            {post.title}
          </h1>
          <div className="mt-10 flex items-center gap-6 text-white/80 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] bg-black/20 backdrop-blur-md px-6 py-2 rounded-full">
            <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
            <div className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full"></div>
            <span>{post.views.toLocaleString()} Views</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* CỘT TRÁI (8/12): NỘI DUNG CHÍNH */}
          <section className="lg:col-span-8">
            <div className="prose prose-slate prose-xl max-w-none 
              prose-headings:font-serif prose-headings:font-black prose-headings:text-[#0c4a6e]
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-8git">
              
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* HIỂN THỊ ALBUM ẢNH TỪ CỘT IMAGES (Database Array) */}
            {post.images && post.images.length > 0 && (
              <div className="mt-20 pt-16 border-t border-slate-100">
                <div className="flex items-center gap-4 mb-12">
                  <h3 className="text-3xl font-serif font-black text-[#0c4a6e] uppercase italic">The Journey Gallery</h3>
                  <div className="flex-1 h-[1px] bg-slate-200"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {post.images.map((img: string, idx: number) => (
                    <div key={idx} className="group relative rounded-[2rem] overflow-hidden border-[12px] border-white shadow-xl aspect-square md:aspect-[4/5]">
                      <img 
                        src={img} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={`ThanhDuy Travel Photo ${idx}`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TƯƠNG TÁC */}
            <div className="mt-20 py-10 border-y border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yêu thích bài viết?</span>
                <LikeButton postId={post.id} />
              </div>
            </div>

            {/* BÌNH LUẬN */}
            <div id="comments" className="mt-24 bg-white p-8 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-3xl font-serif font-black text-[#0c4a6e] mb-12 border-b border-slate-50 pb-6">Độc giả phản hồi</h3>
              <Comments postId={post.id} />
            </div>
          </section>

          {/* CỘT PHẢI (4/12): SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-10 space-y-12">
              
              {/* Tác giả ThanhDuy */}
              <div className="bg-[#0c4a6e] text-white p-10 rounded-[3rem] shadow-2xl">
                <div className="w-20 h-20 bg-[#38bdf8] rounded-full mb-6 flex items-center justify-center text-3xl font-black shadow-lg">TD</div>
                <h4 className="text-2xl font-serif font-black mb-2 uppercase italic tracking-tighter text-[#38bdf8]">ThanhDuy</h4>
                <p className="text-sm text-white/60 leading-relaxed mb-6 italic">
                  "Chụp ảnh để giữ lại khoảnh khắc, viết bài để lưu lại cảm xúc. Đây là nhật ký những ngày xanh của tôi."
                </p>
                <div className="pt-6 border-t border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                  Journalist & Traveler
                </div>
              </div>

              {/* Gợi ý bài khác */}
              <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0ea5e9] border-b-2 border-[#0ea5e9] pb-2">Đọc tiếp hành trình</h4>
                <div className="flex flex-col gap-8">
                  {relatedPosts?.map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className="group flex gap-5 items-center">
                      <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-white">
                        <img src={p.thumbnail_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold leading-tight text-[#0c4a6e] group-hover:text-[#0ea5e9] transition-colors line-clamp-2 uppercase">
                          {p.title}
                        </h5>
                        <p className="text-[9px] font-black text-slate-300 uppercase">
                          {new Date(p.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0c4a6e] py-24 px-6 text-center">
         <h3 className="text-white/5 text-7xl md:text-[10rem] font-serif font-black mb-12 select-none">THANHDUY</h3>
         <Link href="/" className="inline-block px-12 py-5 border border-[#38bdf8] text-[#38bdf8] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-[#38bdf8] hover:text-white transition-all rounded-full">
           Về trang chủ
         </Link>
      </footer>
    </article>
  )
}