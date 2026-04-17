'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export default function ImageUploader({ onUploadSuccess, folder = 'products' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${filename}`);

      // Upload to Firebase Storage
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      // Call callback with URL
      onUploadSuccess(downloadUrl);
      setPreview(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center hover:border-pink-500 transition">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleFileChange(e);
            handleUpload(e);
          }}
          disabled={loading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer block"
        >
          <div className="text-4xl mb-2">📸</div>
          <p className="text-gray-600">
            {loading ? 'Đang upload...' : 'Click để upload ảnh'}
          </p>
          <p className="text-sm text-gray-400">Hoặc kéo thả ảnh vào đây</p>
        </label>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">Xem trước:</p>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
