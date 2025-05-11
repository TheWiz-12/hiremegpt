import React from 'react';
import ResourceLibrary from '../components/ResourceLibrary';

const ResourcesPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
        <p className="text-gray-600 mt-2">
          Discover curated learning materials to help you prepare for your interviews.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <ResourceLibrary />
      </div>
    </div>
  );
};

export default ResourcesPage;