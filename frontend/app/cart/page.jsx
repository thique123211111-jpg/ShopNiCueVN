'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setLoading(false);
  }, []);

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.discountedPrice || item.originalPrice;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ Hàng</h1>

          {loading ? (
            <p>Đang tải...</p>
          ) : cartItems.length === 0 ? (
            <div className="bg-white p-12 rounded-lg text-center">
              <p className="text-2xl text-gray-600 mb-4">🛒 Giỏ hàng trống</p>
              <a href="/" className="text-pink hover:underline font-semibold">
                Tiếp tục mua sắm
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sản Phẩm</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số Lượng</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thành Tiền</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item.id} className="border-t">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-800">{item.accountId}</p>
                              <p className="text-sm text-gray-600">{item.game}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-pink">
                                {(item.discountedPrice || item.originalPrice).toLocaleString('vi-VN')} đ
                              </p>
                              {item.discount > 0 && (
                                <p className="text-sm text-gray-500 line-through">
                                  {item.originalPrice.toLocaleString('vi-VN')} đ
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-800">
                              {((item.discountedPrice || item.originalPrice) * item.quantity).toLocaleString('vi-VN')} đ
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 font-semibold"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-6">Tóm Tắt Đơn Hàng</h2>

                  <div className="space-y-4 mb-6 border-b pb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền hàng:</span>
                      <span className="font-semibold">{totalPrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="text-green-500">Miễn phí</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6 text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-pink">{totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <button className="w-full py-3 bg-gradient-pink-blue text-white font-bold rounded-lg hover:opacity-90 mb-3">
                    Tiếp Tục Thanh Toán
                  </button>
                  <a href="/" className="block text-center py-2 border border-pink text-pink rounded-lg hover:bg-pink hover:text-white transition-colors">
                    Tiếp Tục Mua Sắm
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
