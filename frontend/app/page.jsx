'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [topCharges, setTopCharges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchTopCharges();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products?limit=12');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCharges = async () => {
    try {
      const response = await api.get('/api/charges/top');
      setTopCharges(response.data.charges);
    } catch (error) {
      console.error('Error fetching top charges:', error);
    }
  };

  const handleBuyClick = (product) => {
    // Thêm vào giỏ hàng
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <>
      <Header />

      {/* Banner Slider */}
      <div className="bg-gradient-pink-blue text-white py-12 my-6">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Chào Mừng Đến NiCueVN</h1>
            <p className="text-lg mb-8">Mua bán tài khoản game uy tín, giá rẻ, giao hàng tự động</p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-pink font-bold rounded-lg hover:opacity-90">
                Khám Phá Ngay
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-pink">
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Top Charges */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Top Nạp Thẻ</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Viettel', 'Mobi', 'Vina', 'Momo'].map((method, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">{['📱', '📞', '📡', '💳'][idx]}</div>
                <h3 className="font-bold text-gray-800 mb-2">{method}</h3>
                <p className="text-gray-600 text-sm">Nạp nhanh chóng</p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Section */}
          <main className="flex-1">
            {/* Featured Products */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⭐ Nick Ngon Giá Rẻ</h2>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Đang tải...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice(0, 6).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onBuyClick={handleBuyClick}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Lucky Spin */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎡 Thử Vận May - Vòng Quay</h2>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mb-4 text-6xl">🎰</div>
                <h3 className="text-xl font-bold mb-2">Vòng Quay May Mắn</h3>
                <p className="text-gray-600 mb-6">Quay ngay để có cơ hội chiến thắng giải thưởng lớn!</p>
                <button className="px-8 py-3 bg-gradient-pink-blue text-white font-bold rounded-lg hover:opacity-90">
                  Quay Ngay
                </button>
              </div>
            </section>

            {/* Mystery Box */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎁 Túi Mù</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[100000, 250000, 500000].map((price, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center cursor-pointer">
                    <div className="text-5xl mb-4">🎁</div>
                    <h3 className="font-bold text-gray-800 mb-2">Túi Mù {price.toLocaleString('vi-VN')} đ</h3>
                    <p className="text-sm text-gray-600 mb-4">Giá trị thực: {(price * 1.5).toLocaleString('vi-VN')} đ</p>
                    <button className="w-full px-6 py-2 bg-pink text-white font-bold rounded-lg hover:opacity-90">
                      Mua Ngay
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* All Products */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Tất Cả Sản Phẩm</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyClick={handleBuyClick}
                  />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
