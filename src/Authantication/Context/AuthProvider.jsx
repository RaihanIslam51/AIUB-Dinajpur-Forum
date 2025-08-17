import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../Firebase.init";
import { AuthContext } from "./AuthContext";

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [UserData, setUserData] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Theme setup
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Auth Functions
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
      await signOut(auth);
      setUserData(null);
      localStorage.removeItem("access-token");
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

  // 🔑 Main Fix: Fetch Firebase ID Token
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        setUserData({ ...currentUser, accessToken: token });
        localStorage.setItem("access-token", token); // optional
      } else {
        setUserData(null);
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
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
    darkMode,
    setDarkMode,
    toggleDarkMode,
  };

  return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
