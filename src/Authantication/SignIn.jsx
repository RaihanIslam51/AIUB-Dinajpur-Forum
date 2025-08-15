import { useContext, useRef } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from './Context/AuthContext';

const SignIn = () => {
  const emailRef = useRef();
  const { SignInUser, GoogleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    SignInUser(email, password)
      .then(() => {
        toast.success('Login successful');
        navigate(location?.state || '/');
      })
      .catch(() => {
        toast.error('Invalid email or password');
      });
  };

  const handleGoogleLogin = () => {
    GoogleLogin()
      .then((result) => {
        console.log(result.user);
        toast.success('Login successful');
        navigate(location?.state || '/');
      })
      .catch(() => {
        toast.error('Google login failed');
      });
  };

  // const handleForgetPassword = () => {
  //   const email = emailRef.current?.value;
  //   ForgetPassword(email)
  //     .then(() => {
  //       toast.success('Password reset email sent. Check your inbox.');
  //     })
  //     .catch((error) => toast.error(error.message));
  // };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-green-50 via-emerald-100 to-lime-100 p-4">
      <Helmet>
        <title>Login page</title>
        <meta name="description" content="Track your subscriptions easily." />
      </Helmet>
      {/* Decorative AI/Nature-inspired background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%">
          <circle cx="80%" cy="10%" r="120" fill="#a7f3d0" fillOpacity="0.25" />
          <ellipse cx="10%" cy="90%" rx="180" ry="80" fill="#bbf7d0" fillOpacity="0.18" />
          <circle cx="50%" cy="60%" r="90" fill="#4ade80" fillOpacity="0.10" />
        </svg>
      </div>
      <div className="relative z-10 bg-white/90 shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all duration-300 hover:shadow-emerald-200 border border-green-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-tr from-green-400 via-lime-400 to-emerald-500 rounded-full p-3 shadow-lg mb-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 7 8 7 12C7 15.3137 9.68629 18 13 18C16.3137 18 19 15.3137 19 12C19 8 12 2 12 2Z" fill="#22c55e"/>
              <circle cx="12" cy="12" r="9.5" stroke="#bbf7d0" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-emerald-700 mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-green-700 font-medium">Sign in to plant more trees!</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-green-800">Email</label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-green-50/60 placeholder-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-green-800">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-green-50/60 placeholder-green-400"
            />
        
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 via-lime-400 to-green-400 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-2 rounded-xl shadow-lg transition-all duration-200"
          >
            Login
          </button>
        </form>
        <div className="my-6 flex items-center justify-center gap-2 text-sm text-green-600">
          <span className="w-1/4 h-px bg-green-200"></span>
          OR
          <span className="w-1/4 h-px bg-green-200"></span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-green-200 rounded-xl py-2 bg-green-50 hover:bg-green-100 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          <span className="font-semibold text-green-700 text-sm">Continue with Google</span>
        </button>
        <p className="text-sm text-center mt-6 text-green-700">
          New user?{' '}
          <Link to="/auth/register" className="text-emerald-600 underline hover:underline font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
