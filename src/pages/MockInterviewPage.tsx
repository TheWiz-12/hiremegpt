import React from 'react';
import MockInterview from '../components/MockInterview';

const MockInterviewPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mock Interviews</h1>
        <p className="text-gray-600 mt-2">
          Schedule and participate in realistic mock interviews with AI-powered interviewers.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <MockInterview />
      </div>
    </div>
  );
};

export default MockInterviewPage;