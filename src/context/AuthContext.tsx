import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { toast } from 'react-toastify';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}
/*interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}*/

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Enable persistent auth state
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .catch(error => {
        console.error("Error setting auth persistence:", error);
      });
  }, []);

  async function signup(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already registered. Please try logging in instead.");
      } else {
        toast.error("Failed to create account. Please try again.");
      }
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password. Please check your credentials.");
      } else {
        toast.error("Failed to log in. Please try again.");
      }
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
      throw error;
    }
  }

  async function googleSignIn() {
    try {
      // Try popup first, fall back to redirect
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (popupError) {
        console.warn("Popup blocked, falling back to redirect:", popupError);
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          setCurrentUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error with redirect sign-in:", error);
        if (error.code !== 'auth/redirect-cancelled-by-user') {
          toast.error("Failed to complete sign in. Please try again.");
        }
      });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    googleSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}