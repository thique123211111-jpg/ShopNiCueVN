'use client';

import Link from 'next/link';

export default function ProductCard({ product, onBuyClick }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Product Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>Không có ảnh</span>
          </div>
        )}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-pink text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Game Type */}
        <div className="text-xs text-gray-500 mb-2">{product.game}</div>

        {/* Account ID */}
        <h3 className="font-semibold text-gray-800 truncate mb-2">
          ID: {product.accountId}
        </h3>

        {/* Rank/Level Info */}
        {product.rank && (
          <div className="text-sm text-gray-600 mb-2">
            <span className="inline-block bg-blue bg-opacity-10 text-blue px-2 py-1 rounded">
              {product.rank}
            </span>
          </div>
        )}

        {/* Skins Count */}
        {product.skinsCount > 0 && (
          <div className="text-sm text-gray-600 mb-3">
            Skins: <span className="font-semibold">{product.skinsCount}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex justify-between items-center mb-3">
          <div>
            {product.discountedPrice ? (
              <>
                <div className="text-lg font-bold text-pink">
                  {product.discountedPrice.toLocaleString('vi-VN')} đ
                </div>
                <div className="text-xs text-gray-400 line-through">
                  {product.originalPrice.toLocaleString('vi-VN')} đ
                </div>
              </>
            ) : (
              <div className="text-lg font-bold text-pink">
                {product.originalPrice.toLocaleString('vi-VN')} đ
              </div>
            )}
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={() => onBuyClick(product)}
          className={`w-full py-2 rounded-lg font-semibold transition-all text-white ${
            product.inStock
              ? 'bg-gradient-pink-blue hover:opacity-90 cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Mua Ngay' : 'Hết Hàng'}
        </button>

        {/* Status */}
        <div className="text-xs text-center mt-2 text-gray-500">
          {product.sales} lượt mua
        </div>
      </div>
    </div>
  );
}
