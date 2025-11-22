import React, { useRef, useState } from 'react';

export default function ImageUploader({ onImageUrlChange, imagePreview, disabled }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'diubwrdz5';
  const uploadPreset = 'rental-cars';

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    uploadToCloudinary(file);
  }

  async function uploadToCloudinary(file) {
    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onImageUrlChange(response.secure_url);
          setUploadProgress(0);
          setUploading(false);
          setUploadSuccess(true);
          setUploadError(null);
          // Clear success message after 2 seconds
          setTimeout(() => setUploadSuccess(false), 2000);
        } else {
          setUploadError('Failed to upload image');
          setUploading(false);
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        setUploadError('Upload failed. Please try again.');
        setUploading(false);
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
      xhr.send(formData);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image');
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || disabled}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || disabled}
          className="w-full px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: uploading ? '#E5E7EB' : '#DBEAFE',
            color: uploading ? '#9CA3AF' : '#0C4A6E',
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'Uploading...' : 'Choose Car Image'}
        </button>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs" style={{ color: '#64748B' }}>
            <span>Uploading</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: '#3B82F6'
              }}
            />
          </div>
        </div>
      )}

      {uploadError && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
        >
          {uploadError}
        </div>
      )}

      {uploadSuccess && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
        >
          ✓ Image uploaded successfully
        </div>
      )}
    </div>
  );
}
