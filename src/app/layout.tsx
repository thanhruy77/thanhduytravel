import type { Metadata } from "next";
import { Playfair_Display, Inter } from 'next/font/google';
import "./globals.css";
import Link from "next/link";

const playfair = Playfair_Display({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair', // Tên biến này phải khớp với globals.css
  weight: ['400', '700', '900'],
  style: ['italic', 'normal'],
})

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter', // Tên biến này phải khớp với globals.css
})

export const metadata: Metadata = {
  title: "THE TRAVEL TIMES",
  description: "All the journeys that fit to print",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#fdfdfb] text-[#1a1a1a] font-sans">
        {/* NAV BAR: Thiết kế lại theo lối tối giản báo chí */}
        <nav className="fixed top-0 w-full z-50 bg-[#fdfdfb]/90 backdrop-blur-md border-b-2 border-black/5">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-serif font-black italic text-xl tracking-tighter hover:opacity-70 transition">
              ThanhDuy Travel
            </Link>
            
            <div className="flex items-center gap-10 font-sans font-black text-[10px] uppercase tracking-[0.2em]">
              <Link href="/" className="hover:underline decoration-2 underline-offset-4 transition">Archive</Link>
              <Link href="/admin" className="bg-black text-white px-5 py-2 rounded-sm hover:bg-gray-800 transition italic font-serif normal-case tracking-normal">
                Admin
              </Link>
            </div>
          </div>
        </nav>

        {/* Padding top để không bị đè bởi Nav */}
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}