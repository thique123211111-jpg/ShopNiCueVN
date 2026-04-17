'use client';

import Link from 'next/link';
import { useState } from 'react';

const categories = [
  { id: 1, name: 'Free Fire', icon: '🔫' },
  { id: 2, name: 'Liên Quân', icon: '⚔️' },
  { id: 3, name: 'Roblox', icon: '🎮' },
  { id: 4, name: 'Liên Minh', icon: '👑' },
  { id: 5, name: 'Tính Năng Khác', icon: '⭐' },
];

const services = [
  { id: 1, name: 'Cày Thuê', path: '/services/farm' },
  { id: 2, name: 'Mua Vật Phẩm', path: '/services/items' },
  { id: 3, name: 'Nhận Cũng Cấp', path: '/services/upgrade' },
  { id: 4, name: 'Boosting', path: '/services/boost' },
];

export default function Sidebar() {
  const [expandedCategory, setExpandedCategory] = useState(null);

  return (
    <aside className="w-64 bg-white rounded-lg shadow-md p-4 h-fit sticky top-24">
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Danh Mục Game</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/game/${category.id}`}>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-pink hover:text-white text-gray-700 transition-colors flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>

      <hr className="my-4" />

      {/* Services */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Dịch Vụ</h3>
        <div className="space-y-2">
          {services.map((service) => (
            <Link key={service.id} href={service.path}>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue hover:text-white text-gray-700 transition-colors">
                {service.name}
              </button>
            </Link>
          ))}
        </div>
      </div>

      <hr className="my-4" />

      {/* Filters */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Bộ Lọc</h3>

        {/* Price Filter */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Giá</label>
          <div className="space-y-2 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Dưới 100k</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>100k - 500k</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>500k - 1M</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Trên 1M</span>
            </label>
          </div>
        </div>

        {/* Rank Filter */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rank</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Tất Cả Rank</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
            <option value="diamond">Diamond</option>
            <option value="mythic">Mythic</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sắp Xếp</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="newest">Mới Nhất</option>
            <option value="price-asc">Giá Thấp Nhất</option>
            <option value="price-desc">Giá Cao Nhất</option>
            <option value="popular">Nổi Tiếng</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
