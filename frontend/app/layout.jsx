import './globals.css';
import NotificationListener from '@/components/NotificationListener';

export const metadata = {
  title: 'NiCueVN - Shop Bán Tài Khoản Game',
  description: 'Nền tảng bán tài khoản game hàng đầu với tự động hóa, giá rẻ, và đáng tin cậy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        {children}
        <NotificationListener />
      </body>
    </html>
  );
}
