'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken, removeToken } from '@/lib/auth';
import api from '@/lib/api';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container">
        {/* Top bar */}
        <div className="flex justify-between items-center py-3 text-sm border-b">
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-pink">Tải App</a>
            <a href="#" className="text-gray-600 hover:text-pink">Hỗ trợ</a>
          </div>
          <div className="flex gap-4">
            {isLoggedIn && user ? (
              <span className="text-gray-600">Tài khoản: {user.username}</span>
            ) : null}
          </div>
        </div>

        {/* Main header */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <div className="w-10 h-10 gradient-pink-blue rounded-lg flex items-center justify-center text-white">
              N
            </div>
            <span className="text-gray-800">NiCueVN</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 mx-8">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tài khoản, dịch vụ..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-pink text-white rounded-r-lg hover:opacity-90"
              >
                Tìm
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-6">
            {/* Balance */}
            {isLoggedIn && user ? (
              <Link href="/wallet" className="flex items-center gap-1 hover:text-pink">
                <span className="text-gray-600">💰</span>
                <span className="text-sm">{user.balance || 0} đ</span>
              </Link>
            ) : null}

            {/* Cart */}
            <Link href="/cart" className="flex items-center gap-1 hover:text-pink relative">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            {isLoggedIn ? (
              <div className="flex gap-3">
                <Link href="/account">
                  <button className="text-gray-600 hover:text-pink">Tài khoản</button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-pink text-white rounded-lg hover:opacity-90 text-sm"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login">
                  <button className="px-4 py-2 border border-pink text-pink rounded-lg hover:bg-pink hover:text-white text-sm">
                    Đăng nhập
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-4 py-2 bg-pink text-white rounded-lg hover:opacity-90 text-sm">
                    Đăng ký
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
