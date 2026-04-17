'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    game: '',
    accountId: '',
    rank: '',
    level: '',
    skinsCount: '',
    originalPrice: '',
    discountedPrice: '',
    inStock: true,
    description: '',
    images: [],
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock API call
      setStats({
        totalRevenue: 125000000,
        totalOrders: 1250,
        totalUsers: 5400,
        totalProducts: 300,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100">
        <div className="container py-8">
          {/* Admin Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Quản lý hệ thống NiCueVN</p>
          </div>

          {/* Stats Cards */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tổng Doanh Thu</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.totalRevenue.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tổng Đơn Hàng</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tổng Người Dùng</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tổng Sản Phẩm</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                  </div>
                  <div className="text-4xl">🎮</div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b flex">
              {['dashboard', 'products', 'users', 'orders', 'payments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold ${
                    activeTab === tab
                      ? 'text-pink border-b-2 border-pink'
                      : 'text-gray-600 hover:text-pink'
                  }`}
                >
                  {tab === 'dashboard' ? '📊 Dashboard' : 
                   tab === 'products' ? '🎮 Sản Phẩm' :
                   tab === 'users' ? '👥 Người Dùng' :
                   tab === 'orders' ? '📦 Đơn Hàng' :
                   '💳 Thanh Toán'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Thống Kê Hôm Nay</h2>
                  <div className="space-y-4">
                    <p>🔄 Đơn hàng mới: 45</p>
                    <p>💳 Giao dịch thành công: 128</p>
                    <p>📱 Người dùng mới: 23</p>
                    <p>⭐ Đánh giá trung bình: 4.8/5</p>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Quản Lý Sản Phẩm</h2>
                    <button 
                      onClick={() => setShowAddProduct(!showAddProduct)}
                      className="px-4 py-2 bg-pink text-white rounded-lg hover:bg-pink-600"
                    >
                      {showAddProduct ? '✕ Hủy' : '➕ Thêm Sản Phẩm'}
                    </button>
                  </div>

                  {showAddProduct && (
                    <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                      <h3 className="text-lg font-bold mb-4">Thêm Sản Phẩm Mới</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Game</label>
                          <select
                            value={productForm.game}
                            onChange={(e) => setProductForm({...productForm, game: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                          >
                            <option value="">-- Chọn game --</option>
                            <option value="Free Fire">Free Fire</option>
                            <option value="Liên Quân">Liên Quân</option>
                            <option value="Roblox">Roblox</option>
                            <option value="Liên Minh">Liên Minh</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Account ID</label>
                          <input
                            type="text"
                            value={productForm.accountId}
                            onChange={(e) => setProductForm({...productForm, accountId: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                            placeholder="VD: FF12345678"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Rank</label>
                          <input
                            type="text"
                            value={productForm.rank}
                            onChange={(e) => setProductForm({...productForm, rank: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                            placeholder="VD: Titanium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Level</label>
                          <input
                            type="number"
                            value={productForm.level}
                            onChange={(e) => setProductForm({...productForm, level: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                            placeholder="VD: 50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Số Skin</label>
                          <input
                            type="number"
                            value={productForm.skinsCount}
                            onChange={(e) => setProductForm({...productForm, skinsCount: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                            placeholder="VD: 25"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Giá Gốc (đ)</label>
                          <input
                            type="number"
                            value={productForm.originalPrice}
                            onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                            placeholder="VD: 500000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Giá Khuyến Mãi (đ)</label>
                          <input
                            type="number"
                            value={productForm.discountedPrice}
                            onChange={(e) => setProductForm({...productForm, discountedPrice: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                            placeholder="VD: 400000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Trạng Thái</label>
                          <select
                            value={productForm.inStock ? 'true' : 'false'}
                            onChange={(e) => setProductForm({...productForm, inStock: e.target.value === 'true'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                          >
                            <option value="true">Còn Hàng</option>
                            <option value="false">Hết Hàng</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">Mô Tả</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink"
                          rows="4"
                          placeholder="Mô tả chi tiết tài khoản..."
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">Upload Ảnh (Firebase)</label>
                        <ImageUploader 
                          folder="products"
                          onUploadSuccess={(url) => {
                            setProductForm({
                              ...productForm,
                              images: [...productForm.images, url]
                            });
                          }}
                        />
                        
                        {productForm.images.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-2">Ảnh đã upload:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {productForm.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                  <img 
                                    src={img} 
                                    alt="product" 
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => setProductForm({
                                      ...productForm,
                                      images: productForm.images.filter((_, i) => i !== idx)
                                    })}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            // Save product logic
                            console.log('Saving product:', productForm);
                            alert('✅ Sản phẩm đã lưu! (Demo - cần kết nối API)');
                            setShowAddProduct(false);
                          }}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          💾 Lưu Sản Phẩm
                        </button>
                        <button 
                          onClick={() => setShowAddProduct(false)}
                          className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600">Danh sách sản phẩm sẽ hiển thị ở đây</p>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Quản Lý Người Dùng</h2>
                  <p className="text-gray-600">Danh sách người dùng sẽ hiển thị ở đây</p>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Quản Lý Đơn Hàng</h2>
                  <p className="text-gray-600">Danh sách đơn hàng sẽ hiển thị ở đây</p>
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Quản Lý Thanh Toán</h2>
                  <p className="text-gray-600">Danh sách thanh toán sẽ hiển thị ở đây</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
