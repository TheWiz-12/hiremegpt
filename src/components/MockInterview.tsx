import React, { useState, useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import { Calendar, Building, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    Calendly?: any;
  }
}

const MockInterview: React.FC = () => {
  const { userProfile, scheduleMockInterview, deleteMockInterview } = useUserData();
  const [jobTitle, setJobTitle] = useState(userProfile?.jobTitle || '');
  const [company, setCompany] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const mockInterviews = userProfile?.mockInterviews || [];

  // Load Calendly script only once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Inject Calendly widget when jobTitle and company are filled
  useEffect(() => {
    if (jobTitle && company && window.Calendly) {
      const widgetContainer = document.getElementById('calendly-widget');
      if (widgetContainer) {
        widgetContainer.innerHTML = ''; // Clear previous widget
        window.Calendly.initInlineWidget({
          url: `https://calendly.com/sks547?name=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(company)}`,
          parentElement: widgetContainer,
          prefill: {
            customAnswers: {
              a1: jobTitle,
              a2: company,
            },
          },
          utm: {},
        });
      }
    }
  }, [jobTitle, company]);

  const handleCalendlyEventScheduled = async (e: any) => {
    try {
      setScheduling(true);
      const eventDetails = e.data.payload;
      const dateTime = eventDetails.event.startTime;

      await scheduleMockInterview(jobTitle, company, dateTime);
      toast.success('Mock interview scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Schedule a Mock Interview</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="input w-full p-2 border rounded"
            placeholder="e.g., Software Engineer"
            required
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input w-full pl-10 p-2 border rounded"
              placeholder="e.g., Google, Amazon, Microsoft"
              required
            />
          </div>
        </div>
      </div>

      {jobTitle && company ? (
        <div className="border rounded-lg overflow-hidden mt-4">
          <div
            id="calendly-widget"
            style={{ minWidth: '320px', height: '700px' }}
          ></div>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-500">Please enter job title and company to schedule an interview.</p>
        </div>
      )}

      {mockInterviews.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4 mt-6">Your Mock Interviews</h3>
          <div className="space-y-4">
            {mockInterviews.map((interview) => (
              <div
                key={interview.id}
                className={`border rounded-lg p-4 ${
                  interview.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : interview.status === 'cancelled'
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{interview.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{interview.company}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" /> {interview.date}
                    </p>
                  </div>
                  {interview.status !== 'completed' && (
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteMockInterview(interview.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
