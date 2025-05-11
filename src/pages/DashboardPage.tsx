import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { FileText, MessageSquare, BookOpen, User, Clock, Video } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { userProfile } = useUserData();

  // Calculate stats
  const resumeUploaded = !!userProfile?.resumeUrl;
  const interviewCount = userProfile?.interviewHistory?.length || 0;
  const mockInterviewCount = userProfile?.mockInterviews?.length || 0;
  const lastInterviewDate = userProfile?.interviewHistory?.length 
    ? new Date(userProfile.interviewHistory[userProfile.interviewHistory.length - 1].date).toLocaleDateString() 
    : 'Never';

  // Get upcoming mock interviews
  const upcomingInterviews = userProfile?.mockInterviews
    ?.filter(interview => interview.status === 'scheduled' && new Date(interview.date) > new Date())
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    ?.slice(0, 1) || [];

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser?.displayName || 'User'}!</h1>
        <p className="text-gray-600 mt-2">
          Track your progress and continue your interview preparation journey.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Resume Status</p>
              <p className="text-2xl font-semibold mt-1">
                {resumeUploaded ? 'Uploaded' : 'Not Uploaded'}
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          {!resumeUploaded && (
            <Link to="/resume" className="text-primary-600 text-sm font-medium mt-4 inline-block hover:underline">
              Upload your resume →
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Practice Sessions</p>
              <p className="text-2xl font-semibold mt-1">{interviewCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Last session: {lastInterviewDate}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Mock Interviews</p>
              <p className="text-2xl font-semibold mt-1">{mockInterviewCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {upcomingInterviews.length > 0 ? (
            <p className="text-gray-500 text-sm mt-4">
              Next interview: {new Date(upcomingInterviews[0].date).toLocaleDateString()}
            </p>
          ) : (
            <Link to="/mock-interview" className="text-primary-600 text-sm font-medium mt-4 inline-block hover:underline">
              Schedule a mock interview →
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/resume" className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-center">
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium">Resume Analysis</h3>
              <p className="text-sm text-gray-500">Upload and analyze your resume</p>
            </div>
          </Link>
          
          <Link to="/practice" className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-center">
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <MessageSquare className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium">Practice Interview</h3>
              <p className="text-sm text-gray-500">Start a new interview session</p>
            </div>
          </Link>
          
          <Link to="/mock-interview" className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-center">
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <Video className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium">Mock Interview</h3>
              <p className="text-sm text-gray-500">Schedule a video interview</p>
            </div>
          </Link>
          
          <Link to="/resources" className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-center">
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <BookOpen className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium">Learning Resources</h3>
              <p className="text-sm text-gray-500">Find materials to improve your skills</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {(interviewCount > 0 || mockInterviewCount > 0) && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {userProfile?.mockInterviews?.slice(-2).reverse().map((interview, index) => (
                <li key={`mock-${index}`} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <Video className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Mock Interview: {interview.jobTitle}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(interview.date).toLocaleDateString()} • {interview.status}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              
              {userProfile?.interviewHistory?.slice(-2).reverse().map((session, index) => (
                <li key={`practice-${index}`} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="bg-primary-100 p-2 rounded-full mr-4">
                      <MessageSquare className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">Interview Practice Session</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleDateString()} • {session.questions.length} questions
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;