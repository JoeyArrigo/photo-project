import React, { useState, useEffect } from 'react';
import PhotoUploader from './components/PhotoUploader';
import DescriptionViewer from './components/DescriptionViewer';

interface Photo {
  id: string;
  file_name: string;
  description: string;
  created_at: string;
}

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch photos on component mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/photos`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      const data = await response.json();
      setPhotos(data);
      setError(null);
    } catch (err) {
      setError('Error fetching photos. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = (newPhoto: Photo) => {
    setPhotos([newPhoto, ...photos]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Photo Description Generator</h1>
      
      <PhotoUploader onPhotoUploaded={handlePhotoUploaded} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Photo Descriptions</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {photos.length === 0 && !loading ? (
          <p>No photos uploaded yet.</p>
        ) : (
          <DescriptionViewer photos={photos} />
        )}
      </div>
    </div>
  );
};

export default App;
