'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      setUser(response.data.user);
      
      // Fetch transactions
      const transResponse = await api.get(`/api/payment/history/${response.data.user.id}`);
      setTransactions(transResponse.data.transactions || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-100">
          <div className="container py-8">Đang tải...</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-pink-blue rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: '👤 Hồ Sơ' },
                  { id: 'wallet', label: '💰 Ví Tiền' },
                  { id: 'orders', label: '📦 Đơn Hàng' },
                  { id: 'transactions', label: '💳 Giao Dịch' },
                  { id: 'security', label: '🔒 Bảo Mật' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-pink text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Thông Tin Cá Nhân</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Đăng Nhập</label>
                      <input
                        type="text"
                        value={user?.username}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày Đăng Ký</label>
                      <input
                        type="text"
                        value={new Date(user?.created_at).toLocaleDateString('vi-VN')}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <button className="w-full py-2 bg-pink text-white rounded-lg hover:opacity-90 mt-4">
                      Cập Nhật Thông Tin
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'wallet' && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Ví Tiền</h2>
                  <div className="bg-gradient-pink-blue text-white p-8 rounded-lg mb-6">
                    <p className="text-sm opacity-90 mb-2">Số dư hiện tại</p>
                    <p className="text-4xl font-bold">{user?.balance?.toLocaleString('vi-VN')} đ</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="py-3 bg-pink text-white rounded-lg hover:opacity-90 font-semibold">
                      Nạp Thẻ Cào
                    </button>
                    <button className="py-3 bg-blue text-white rounded-lg hover:opacity-90 font-semibold">
                      Nạp Momo
                    </button>
                    <button className="py-3 bg-green-500 text-white rounded-lg hover:opacity-90 font-semibold">
                      Chuyển Khoản
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Đơn Hàng Của Tôi</h2>
                  <p className="text-gray-600">Hiện tại không có đơn hàng nào</p>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Lịch Sử Giao Dịch</h2>
                  {transactions.length === 0 ? (
                    <p className="text-gray-600">Không có giao dịch nào</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mã GD</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Số Tiền</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phương Thức</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ngày</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map(tx => (
                            <tr key={tx.id} className="border-t">
                              <td className="px-4 py-2">#{tx.id}</td>
                              <td className="px-4 py-2 font-semibold text-pink">
                                {tx.amount.toLocaleString('vi-VN')} đ
                              </td>
                              <td className="px-4 py-2 text-gray-600">{tx.paymentMethod}</td>
                              <td className="px-4 py-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {tx.status === 'completed' ? 'Thành Công' :
                                   tx.status === 'pending' ? 'Đang Xử Lý' : 'Thất Bại'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-gray-600 text-sm">
                                {new Date(tx.created_at).toLocaleDateString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Bảo Mật</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">Mật Khẩu</p>
                        <p className="text-sm text-gray-600">Thay đổi mật khẩu của bạn</p>
                      </div>
                      <button className="px-4 py-2 border border-pink text-pink rounded-lg hover:bg-pink hover:text-white">
                        Thay Đổi
                      </button>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">Xác Minh 2 Lớp</p>
                        <p className="text-sm text-gray-600">Bảo vệ tài khoản với 2FA</p>
                      </div>
                      <button className="px-4 py-2 border border-blue text-blue rounded-lg hover:bg-blue hover:text-white">
                        Kích Hoạt
                      </button>
                    </div>
                  </div>
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
