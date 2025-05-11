import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ResumePage from './pages/ResumePage';
import PracticePage from './pages/PracticePage';
import ResourcesPage from './pages/ResourcesPage';
import MockInterviewPage from './pages/MockInterviewPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserDataProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/resume" 
                  element={
                    <PrivateRoute>
                      <ResumePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/practice" 
                  element={
                    <PrivateRoute>
                      <PracticePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/resources" 
                  element={
                    <PrivateRoute>
                      <ResourcesPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/mock-interview" 
                  element={
                    <PrivateRoute>
                      <MockInterviewPage />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </main>
            <footer className="bg-white border-t border-gray-200 py-6">
              <div className="container-custom">
                <p className="text-center text-gray-500">
                  © {new Date().getFullYear()} HireMeGPT. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
          <ToastContainer position="bottom-right" />
        </UserDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;