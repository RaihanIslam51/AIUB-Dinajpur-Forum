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
import { auth } from '../Firebase.init';
import { AuthContext } from './AuthContext';


const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  // const BASE_URL = import.meta.env.VITE_URL;
  const [UserData, setUserData] = useState(null);
  const [Loading, setLoading] = useState(true);
  
  // const [darkMode, setDarkMode] = useState(false);

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme');
  //   setDarkMode(savedTheme === 'dark');
  // }, []);

  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add('dark');
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //     localStorage.setItem('theme', 'light');
  //   }
  // }, [darkMode]);




  // Firebase Auth Functions
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const SignInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const  SignOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const GoogleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const updateUser = (updateData) => {
    return updateProfile(auth.currentUser, updateData);
  };

  // Auth State Change Listener
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserData(currentUser)});
    //  axios.post(`${BASE_URL}/jwt`, {email: currentUser?.email},{
    //     withCredentials: true,
    //   }).then((data) => {
    //     localStorage.setItem('accessToken', data.data.token);
    //   }).catch((error) => {
    //     console.error("Error fetching JWT:", error);
    //  })
      setLoading(false);
    // });

    return () => unSubscribe();
  }, []);

  const userInfo = {
    GoogleLogin,
    updateUser,
    Loading,
    UserData,
    setUserData,
    SignOutUser,
    SignInUser,
    createUser,
    // darkMode,
    // setDarkMode,
    //  eventId, 
    // setEventId,  
  };

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
