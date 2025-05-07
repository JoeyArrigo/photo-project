import React from 'react';

interface Photo {
  id: string;
  file_name: string;
  description: string;
  created_at: string;
}

interface DescriptionViewerProps {
  photos: Photo[];
}

const DescriptionViewer: React.FC<DescriptionViewerProps> = ({ photos }) => {
  return (
    <div className="space-y-6">
      {photos.map((photo) => (
        <div key={photo.id} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">{photo.file_name}</h3>
          <p className="text-gray-600 mb-4">
            {new Date(photo.created_at).toLocaleString()}
          </p>
          <div className="bg-gray-100 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Description:</h4>
            <p className="text-gray-800">{photo.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DescriptionViewer;
