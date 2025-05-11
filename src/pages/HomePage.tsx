import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, FileText, MessageSquare, BookOpen, ArrowRight, Video } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Ace Your Next Interview with <span className="text-primary-600">HireMeGPT</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                AI-powered interview preparation that helps you practice, improve, and land your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn btn-primary text-center py-3 px-6">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary text-center py-3 px-6">
                  Log In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Interview preparation" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How HireMeGPT Helps You</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resume Analysis</h3>
              <p className="text-gray-600">
                Get detailed feedback on your resume with AI-powered analysis and improvement suggestions.
              </p>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interview Practice</h3>
              <p className="text-gray-600">
                Practice with personalized interview questions based on your resume and target job.
              </p>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mock Interviews</h3>
              <p className="text-gray-600">
                Schedule realistic mock interviews with AI-powered interviewers for real-time practice.
              </p>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
              <p className="text-gray-600">
                Access curated learning materials to strengthen your skills and knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white rounded-lg shadow-md p-6 relative z-10">
                <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-gray-600">
                  Upload your resume and get AI-powered analysis and improvement suggestions.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-1 bg-primary-200 -translate-y-1/2 z-0"></div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg shadow-md p-6 relative z-10">
                <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Practice Questions</h3>
                <p className="text-gray-600">
                  Get personalized interview questions based on your resume and target job.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-1 bg-primary-200 -translate-y-1/2 z-0"></div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg shadow-md p-6 relative z-10">
                <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Mock Interviews</h3>
                <p className="text-gray-600">
                  Schedule and participate in realistic mock interviews with AI-powered interviewers.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-1 bg-primary-200 -translate-y-1/2 z-0"></div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg shadow-md p-6 relative z-10">
                <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">Land Your Dream Job</h3>
                <p className="text-gray-600">
                  Receive feedback, improve your skills, and confidently ace your interviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their interview skills and landed their dream jobs.
          </p>
          <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 py-3 px-8 text-lg inline-flex items-center">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;