import React from 'react';
import InterviewPractice from '../components/InterviewPractice';

const PracticePage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interview Practice</h1>
        <p className="text-gray-600 mt-2">
          Practice answering interview questions tailored to your resume and target job.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <InterviewPractice />
      </div>
    </div>
  );
};

export default PracticePage;