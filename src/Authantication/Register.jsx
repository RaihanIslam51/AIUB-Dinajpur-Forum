import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../Hooks/AxiosSeure/asiosInstance';
import { AuthContext } from './Context/AuthContext';

const Register = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || '/';

  const { createUser, GoogleLogin, setUserData, updateUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const photo = e.target.photo.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    setErrorMessage('');
    const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegEx.test(password)) {
      const msg = 'Password must include uppercase, lowercase, digit, and be at least 6 characters.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      const result = await createUser(email, password);
      const user = result.user;

      await updateUser({ displayName: name, photoURL: photo });
      setUserData({ ...user, displayName: name, photoURL: photo });

      // Save user to database
      const userInfo = {
        name,
        photo,
        email,
        role: 'user',
        payment_status: 'Bronze Badge',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString()
      };

      const res = await axiosInstance.post('/users', userInfo);
      console.log(res.data);

      toast.success('Account created successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      toast.error('Registration failed.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await GoogleLogin();
      const user = result.user;

      const userInfo = {
        name: user.displayName || 'No Name',
        photo: user.photoURL || '',
        email: user.email,
        role: 'user',
        payment_status: 'Bronze Badge',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString()
      };

      const res = await axiosInstance.post('/users', userInfo);
      console.log(res.data);

      setUserData(user);
      toast.success('Signed in with Google!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      toast.error('Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-200 via-green-400 to-emerald-600 p-4">
      <Helmet>
        <title>Register page</title>
        <meta name="description" content="Track your subscriptions easily." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md md:max-w-lg lg:max-w-xl p-8 md:p-12 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl border border-green-200"
      >
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-lime-600 to-emerald-500 mb-8 drop-shadow-lg">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-base font-semibold text-green-900 mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Raihan Islam"
              className="w-full px-5 py-3 rounded-2xl bg-white/80 focus:bg-white focus:ring-4 focus:ring-green-300 text-gray-900 shadow-md transition"
            />
          </div>
          <div>
            <label htmlFor="photo" className="block text-base font-semibold text-green-900 mb-1">Photo URL</label>
            <input
              id="photo"
              name="photo"
              type="text"
              placeholder="https://example.com/image.jpg"
              className="w-full px-5 py-3 rounded-2xl bg-white/80 focus:bg-white focus:ring-4 focus:ring-green-300 text-gray-900 shadow-md transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-base font-semibold text-green-900 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-5 py-3 rounded-2xl bg-white/80 focus:bg-white focus:ring-4 focus:ring-green-300 text-gray-900 shadow-md transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-semibold text-green-900 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={passwordShow ? 'text' : 'password'}
                required
                placeholder="Enter password"
                className="w-full px-5 py-3 rounded-2xl bg-white/80 focus:bg-white focus:ring-4 focus:ring-green-300 text-gray-900 shadow-md transition"
              />
              <span
                onClick={() => setPasswordShow(!passwordShow)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 text-sm font-semibold cursor-pointer select-none"
              >
                {passwordShow ? 'Hide' : 'Show'}
              </span>
            </div>
          </div>
          {errorMessage && (
            <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-700 via-lime-600 to-emerald-500 text-white py-3 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Register
          </button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent" />
          <span className="text-green-700 text-sm font-semibold">OR</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-green-400 to-transparent" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white/90 border border-green-100 py-3 rounded-2xl shadow-md hover:bg-green-50 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          <span className="font-semibold text-green-800">Sign up with Google</span>
        </button>

        <p className="mt-7 text-center text-base">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-green-700 underline font-bold hover:text-emerald-600 transition">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
