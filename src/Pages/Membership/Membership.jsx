import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { useContext } from 'react';
import { AuthContext } from "../../Authantication/Context/AuthContext";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe("pk_test_51RhpkKRh9Db7MzPj1GmZV5NgN5b7Hlsbvu4APLQIpvz4muwImMc09T02YSnQgggseHnLCDlvvgxyj3zv2GJvViuE00bHRp5fIo");

const Membership = () => {
  const { darkMode } = useContext(AuthContext);

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-sm mt-10 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-semibold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Payment
        </h2>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Enter your payment details below
        </p>
      </div>
      
      <Elements stripe={stripePromise}>
        <PaymentForm darkMode={darkMode} />
      </Elements>
      
      <div className={`mt-6 text-center text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Your payment is secure and encrypted
      </div>
    </div>
  );
};

export default Membership;