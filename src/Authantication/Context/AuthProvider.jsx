import axios from 'axios';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../Firebase.init';
import { AuthContext } from './AuthContext';

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_URL;
  const [UserData, setUserData] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Firebase Auth Functions
  const createUser = async (email, password, displayName) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return userCredential;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const SignInUser = async (email, password) => {
    try {
      setLoading(true);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const SignOutUser = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      await signOut(auth);
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const GoogleLogin = async () => {
    try {
      setLoading(true);
      return await signInWithPopup(auth, provider);
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updateData) => {
    try {
      setLoading(true);
      await updateProfile(auth.currentUser, updateData);
      setUserData({ ...auth.currentUser, ...updateData });
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Auth State Change Listener
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUserData(currentUser);
      
      if (currentUser) {
        try {
          const response = await axios.post(
            `${BASE_URL}/jwt`, 
            { email: currentUser.email },
            { withCredentials: true }
          );
          
          const token = response.data.token;
          localStorage.setItem('accessToken', token);
          setAccessToken(token);
          
          // Refresh token before it expires (optional)
          const expiresIn = response.data.expiresIn || 3600;
          setTimeout(() => {
            axios.post(`${BASE_URL}/refresh-token`, {}, { withCredentials: true });
          }, (expiresIn - 60) * 1000);
          
        } catch (error) {
          console.error("Error fetching JWT:", error);
          toast.error("Session initialization failed");
        }
      } else {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
      }
      
      setLoading(false);
    });

    return () => unSubscribe();
  }, [BASE_URL]);

  // Add axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          try {
            const response = await axios.post(`${BASE_URL}/refresh-token`, {}, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.token);
            error.config.headers.Authorization = `Bearer ${response.data.token}`;
            return axios(error.config);
          } catch (refreshError) {
            await SignOutUser();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [BASE_URL, SignOutUser]);

  const userInfo = {
    GoogleLogin,
    updateUser,
    Loading,
    UserData,
    setUserData,
    SignOutUser,
    SignInUser,
    createUser,
    darkMode,
    setDarkMode,
    toggleDarkMode,
    accessToken
  };

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;