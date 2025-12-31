import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 0

export default async function HomePage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*, comments(user_name, content)')
    .order('created_at', { ascending: false })

  if (!posts || posts.length === 0) return null

  const mainPost = posts[0];
  const subPosts = posts.slice(1, 4);
  const listPosts = posts.length > 4 ? posts.slice(4) : posts.slice(1);

  return (
    <main className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen selection:bg-[#38bdf8] selection:text-white">

      {/* HEADER: Masthead linh hoạt cho cả Mobile/PC */}
      <header className="max-w-[1400px] mx-auto pt-8 md:pt-10 px-4 md:px-6 text-center border-b-[6px] border-[#0284c7] pb-6 bg-white shadow-sm">
        <div className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400 mb-2 md:mb-4">
          The Daily Adventures
        </div>
        <h1 className="text-[15vw] md:text-9xl font-serif font-black uppercase tracking-tighter leading-[0.8] mb-6 text-[#0369a1] italic break-words">
          Thanh Duy  <span className="text-[#38bdf8] not-italic"> Travel</span>
        </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-center py-2 border-y border-slate-200 text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-slate-500 gap-2 md:gap-0">
          <div className="flex gap-4">
            <span>2025</span>
            <span className="hidden md:block">NO. 001</span>
          </div>
          <span className="text-[#0ea5e9] font-black italic">Journal by ThanhDuy</span>
          <span className="hidden sm:inline">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="sm:hidden">
             {new Date().toLocaleDateString('vi-VN')}
          </span>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Grid layout: 1 cột cho mobile, 12 cột cho PC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* CỘT GIỮA (BÀI CHÍNH): Hiển thị đầu tiên trên Mobile */}
          <section className="lg:col-span-6 lg:px-6 order-1 lg:order-2 border-b-2 lg:border-b-0 lg:border-x-2 border-slate-100 pb-10 lg:pb-0">
            <article className="group relative">
              <Link href={`/blog/${mainPost.slug}`} className="block">
                
                <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tighter leading-[0.9] text-[#0c4a6e] mb-6 group-hover:text-[#0ea5e9] transition-colors">
                  {mainPost.title}
                </h2>

                <div className="flex justify-between items-center border-y-2 border-slate-800 py-3 mb-8">
                  <div className="flex items-center gap-3 font-black text-[10px] md:text-[11px] uppercase tracking-widest">
                    <span>By ThanhDuy</span>
                  </div>
                  <div className="flex gap-4 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                    <span>{mainPost.views} Views</span>
                    <span>•</span>
                    <span>{new Date(mainPost.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="w-full aspect-video overflow-hidden border border-slate-200 p-1 bg-white mb-8 shadow-sm">
                  <img src={mainPost.thumbnail_url} className="w-full h-full object-cover" alt={mainPost.title} />
                </div>

                <p className="text-lg md:text-xl leading-relaxed text-slate-800 mb-12">
                  {mainPost.description}
                </p>

                {mainPost.comments && mainPost.comments.length > 0 && (
                  <div className="bg-[#f1f5f9] border-l-4 md:border-l-8 border-[#0c4a6e] p-6 md:p-10 mb-8 relative">
                    <div className="absolute top-2 right-6 text-6xl md:text-8xl font-serif text-[#cbd5e1] opacity-50 font-black leading-none select-none">“</div>
                    <p className="text-lg md:text-2xl font-serif font-bold leading-tight italic text-[#1e293b] relative z-10">
                      {mainPost.comments[0].content}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0ea5e9] mt-6">
                      — {mainPost.comments[0].user_name}, Reader Feedback
                    </p>
                  </div>
                )}
                
                <div className="text-center">
                  <span className="inline-block text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] py-3 px-8 md:px-10 border-2 border-slate-800 group-hover:bg-slate-800 group-hover:text-white transition-all">
                    Continue Reading
                  </span>
                </div>
              </Link>
            </article>
          </section>

          {/* CỘT TRÁI (TIN PHỤ): Xếp dưới bài chính trên Mobile */}
          <aside className="lg:col-span-3 space-y-10 order-2 lg:order-1 lg:border-r border-slate-100 lg:pr-6 border-b-2 lg:border-b-0 pb-10 lg:pb-0">
            <h4 className="text-[15px] font-black uppercase tracking-widest text-[#38bdf8] border-b-2 border-[#38bdf8] pb-1 mb-8">Chuyện bên lề</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-10">
              {subPosts.map((post) => (
                <article key={post.id} className="border-b border-slate-100 pb-8 last:border-0 group">
                  <Link href={`/blog/${post.slug}`} className="block space-y-4">
                    <h3 className="text-2xl font-serif font-black leading-tight group-hover:text-[#0ea5e9] transition-colors">
                      {post.title}
                    </h3>
                    <div className="w-full aspect-[4/3] overflow-hidden bg-slate-100 grayscale hover:grayscale-0 transition-all duration-500 shadow-sm border border-slate-200 p-0.5">
                      <img src={post.thumbnail_url} className="w-full h-full object-cover" alt="" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {post.description}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </aside>

          {/* CỘT PHẢI (TIN VẮN): Dưới cùng trên Mobile */}
          <aside className="lg:col-span-3 space-y-8 order-3 lg:border-l border-slate-100 lg:pl-6">
            <h4 className="text-[15px] font-black uppercase tracking-widest text-[#0369a1] border-b-2 border-[#0369a1] pb-1">Briefing</h4>

            <div className="divide-y divide-slate-100">
              {listPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="py-5 block group first:pt-0">
                  <h4 className="text-base font-serif font-bold leading-tight group-hover:underline decoration-[#0ea5e9] decoration-2 underline-offset-4 transition-all">
                    {post.title}
                  </h4>
                  <div className="flex justify-between items-center mt-3 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    <span className="text-[#0ea5e9] italic font-serif">Report</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* STATUS BOX: Phong cách Vintage Ads */}
            <div className="border-4 border-double border-slate-800 p-6 md:p-8 text-center bg-white shadow-sm">
              <h5 className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.4em] mb-4 border-b border-slate-200 pb-2">Travel Note</h5>
              <p className="text-xm font-serif italic font-bold leading-relaxed text-slate-700">
                "Bầu trời hôm nay rất xanh, và những chuyến đi vẫn đang chờ đợi bước chân bạn."
              </p>
              <p className="text-[9px] font-black uppercase mt-4 text-[#0ea5e9] tracking-widest">— ThanhDuy Dispatch</p>
            </div>
          </aside>

        </div>
      </div>

      <footer className="max-w-[1400px] mx-auto border-t-[6px] border-[#0c4a6e] py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400">
        <span className="text-center md:text-left">The Travel Report Journal © 2025</span>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link href="/admin" className="text-[#0ea5e9] hover:line-through">Editor Login</Link>
          <span className="italic font-serif normal-case tracking-normal hidden sm:inline">All stories verified.</span>
        </div>
      </footer>
    </main>
  )
}