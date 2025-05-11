import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc, updateDoc, enableNetwork, disableNetwork } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface UserProfile {
  displayName: string;
  email: string;
  resumeUrl?: string;
  jobTitle?: string;
  skills?: string[];
  interviewHistory?: {
    date: string;
    questions: { question: string; answer: string; feedback: string }[];
  }[];
  mockInterviews?: {
    id: string;
    date: string;
    jobTitle: string;
    company: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    feedback?: string;
  }[];
}

interface UserDataContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  uploadResume: (file: File) => Promise<string>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  saveInterviewSession: (questions: { question: string; answer: string; feedback: string }[]) => Promise<void>;
  scheduleMockInterview: (jobTitle: string, company: string, date: string) => Promise<string>;
  updateMockInterview: (id: string, data: Partial<UserProfile['mockInterviews'][0]>) => Promise<void>;
  deleteMockInterview: (id: string) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleNetworkStatus = async (online: boolean) => {
    try {
      if (online) {
        await enableNetwork(db);
      } else {
        await disableNetwork(db);
      }
    } catch (error) {
      console.error('Error handling network status:', error);
    }
  };

  useEffect(() => {
    const handleOnline = () => handleNetworkStatus(true);
    const handleOffline = () => handleNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
          };
          
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);
        }

        setRetryCount(0);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, delay);
        } else {
          toast.error("Unable to connect to the server. Please check your internet connection.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [currentUser, retryCount]);

  async function uploadResume(file: File) {
    if (!currentUser) throw new Error("User not authenticated");
    
    try {
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;
      const fileRef = ref(storage, `resumes/${currentUser.uid}/${fileName}`);
      
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        resumeUrl: downloadUrl
      });
      
      setUserProfile(prev => prev ? {...prev, resumeUrl: downloadUrl} : null);
      
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw error;
    }
  }

  async function updateProfile(data: Partial<UserProfile>) {
    if (!currentUser) throw new Error("User not authenticated");
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, data);
      
      setUserProfile(prev => prev ? {...prev, ...data} : null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
      throw error;
    }
  }

  async function saveInterviewSession(questions: { question: string; answer: string; feedback: string }[]) {
    if (!currentUser) throw new Error("User not authenticated");
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const interviewHistory = userData.interviewHistory || [];
        
        interviewHistory.push({
          date: new Date().toISOString(),
          questions
        });
        
        await updateDoc(userDocRef, {
          interviewHistory
        });
        
        setUserProfile(prev => prev ? {
          ...prev, 
          interviewHistory
        } : null);
        
        toast.success("Interview session saved!");
      }
    } catch (error) {
      console.error("Error saving interview session:", error);
      toast.error("Failed to save interview session. Please try again.");
      throw error;
    }
  }

  async function scheduleMockInterview(jobTitle: string, company: string, date: string) {
    if (!currentUser) throw new Error("User not authenticated");
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const mockInterviews = userData.mockInterviews || [];
        
        const id = `mock-${Date.now()}`;
        
        mockInterviews.push({
          id,
          date,
          jobTitle,
          company,
          status: 'scheduled'
        });
        
        await updateDoc(userDocRef, {
          mockInterviews
        });
        
        setUserProfile(prev => prev ? {
          ...prev, 
          mockInterviews
        } : null);
        
        toast.success("Mock interview scheduled!");
        return id;
      }
      throw new Error("User profile not found");
    } catch (error) {
      console.error("Error scheduling mock interview:", error);
      toast.error("Failed to schedule mock interview. Please try again.");
      throw error;
    }
  }

  async function updateMockInterview(id: string, data: Partial<UserProfile['mockInterviews'][0]>) {
    if (!currentUser) throw new Error("User not authenticated");
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const mockInterviews = userData.mockInterviews || [];
        
        const updatedInterviews = mockInterviews.map(interview => 
          interview.id === id ? { ...interview, ...data } : interview
        );
        
        await updateDoc(userDocRef, {
          mockInterviews: updatedInterviews
        });
        
        setUserProfile(prev => prev ? {
          ...prev, 
          mockInterviews: updatedInterviews
        } : null);
        
        toast.success("Mock interview updated!");
      }
    } catch (error) {
      console.error("Error updating mock interview:", error);
      toast.error("Failed to update mock interview. Please try again.");
      throw error;
    }
  }

  async function deleteMockInterview(id: string) {
    if (!currentUser) throw new Error("User not authenticated");
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const mockInterviews = userData.mockInterviews || [];
        
        const updatedInterviews = mockInterviews.filter(interview => interview.id !== id);
        
        await updateDoc(userDocRef, {
          mockInterviews: updatedInterviews
        });
        
        setUserProfile(prev => prev ? {
          ...prev, 
          mockInterviews: updatedInterviews
        } : null);
        
        toast.success("Mock interview cancelled!");
      }
    } catch (error) {
      console.error("Error deleting mock interview:", error);
      toast.error("Failed to cancel mock interview. Please try again.");
      throw error;
    }
  }

  const value = {
    userProfile,
    loading,
    uploadResume,
    updateProfile,
    saveInterviewSession,
    scheduleMockInterview,
    updateMockInterview,
    deleteMockInterview
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}