import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { imageUrls } = await req.json();
    if (!imageUrls || !Array.isArray(imageUrls)) return NextResponse.json({ success: true });

    // Hàm lấy Public ID từ URL bất kỳ của Cloudinary
    const getPublicId = (url: string) => {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1]; // "abcxyz.jpg"
      const fileName = lastPart.split('.')[0];   // "abcxyz"
      
      // Nếu ảnh nằm trong folder (ví dụ: /blog/anh1.jpg)
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
        const folderParts = parts.slice(uploadIndex + 2, parts.length - 1);
        return folderParts.length > 0 ? `${folderParts.join('/')}/${fileName}` : fileName;
      }
      return fileName;
    };

    // Chạy vòng lặp xóa từng ảnh một cho chắc cú
    const deletePromises = imageUrls.map(url => {
      const publicId = getPublicId(url);
      console.log("Đang xóa ảnh:", publicId);
      return cloudinary.uploader.destroy(publicId);
    });

    const results = await Promise.all(deletePromises);
    
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Lỗi xóa ảnh:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}