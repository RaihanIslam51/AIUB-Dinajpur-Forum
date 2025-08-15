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
 
  const [UserData, setUserData] = useState(null);
  const [Loading, setLoading] = useState(true);
  
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
      setUserData(currentUser)
     setLoading(false);
    });
  

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
  };

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
