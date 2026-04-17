'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">NiCueVN</h3>
            <p className="text-sm text-gray-400">
              Nền tảng bán tài khoản game hàng đầu với tự động hóa, giá rẻ, và đáng tin cậy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên Kết</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><Link href="/" className="hover:text-pink">Trang Chủ</Link></li>
              <li><Link href="/products" className="hover:text-pink">Sản Phẩm</Link></li>
              <li><Link href="/services" className="hover:text-pink">Dịch Vụ</Link></li>
              <li><Link href="/blog" className="hover:text-pink">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Hỗ Trợ</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><Link href="/faq" className="hover:text-pink">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-pink">Liên Hệ</Link></li>
              <li><Link href="/terms" className="hover:text-pink">Điều Khoản</Link></li>
              <li><Link href="/privacy" className="hover:text-pink">Bảo Mật</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên Hệ</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>📧 support@nicuevn.com</p>
              <p>💬 Facebook: /nicuevn</p>
              <p>📞 Hotline: 1900-xxxx</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 NiCueVN. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-pink">Điều Khoản Sử Dụng</a>
            <a href="#" className="hover:text-pink">Chính Sách Bảo Mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
