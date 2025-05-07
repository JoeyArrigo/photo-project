import React, { useState } from 'react';

interface PhotoUploaderProps {
  onPhotoUploaded: (photo: any) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onPhotoUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file is an image
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        setFile(null);
        setPreview(null);
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('photo', file);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/photos`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }
      
      const data = await response.json();
      onPhotoUploaded(data);
      
      // Reset form
      setFile(null);
      setPreview(null);
      setError(null);
    } catch (err) {
      setError('Error uploading photo. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h3 className="text-xl font-medium mb-4">Upload a Photo</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>
        
        {preview && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 rounded"
            />
          </div>
        )}
        
        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={!file || uploading}
          className={`px-4 py-2 rounded-md text-white ${
            !file || uploading
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {uploading ? 'Processing...' : 'Upload and Generate Description'}
        </button>
      </form>
    </div>
  );
};

export default PhotoUploader;
