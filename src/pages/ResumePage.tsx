import React from 'react';
import ResumeUploader from '../components/ResumeUploader';

const ResumePage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
        <p className="text-gray-600 mt-2">
          Upload your resume to get AI-powered feedback and suggestions for improvement.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <ResumeUploader />
      </div>
    </div>
  );
};

export default ResumePage;