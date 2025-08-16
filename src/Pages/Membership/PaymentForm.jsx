import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Authantication/Context/AuthContext';
import useAuth from '../../Hooks/AxiosSeure/useAuth';
import useAxiosSesure from '../../Hooks/AxiosSeure/useAxiosSecure';

const PaymentForm = ({ darkMode }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSesure();
  const { UserData } = useAuth();
  const { darkMode: contextDarkMode } = useContext(AuthContext);
  
  // Use prop if available, otherwise fallback to context
  const isDarkMode = darkMode ?? contextDarkMode;

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fixedAmount = 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    setSuccessMessage('');

    if (!stripe || !elements) {
      setError('Stripe is not loaded');
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });

      if (methodError) {
        setError(methodError.message);
        setProcessing(false);
        return;
      }

      const { data } = await axiosSecure.post('/create-payment-intent', {
        amountInCents: fixedAmount * 100,
      });

      const clientSecret = data.clientSecret;

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: UserData?.displayName || 'Unknown',
            email: UserData?.email || 'no-email@example.com',
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccessMessage('✅ Payment successful!');

        await axiosSecure.patch(`/users/payment-status/${UserData.email}`, {
          payment_status: 'Gold Badge',
        });

        await Swal.fire({
          icon: 'success',
          title: 'You are now a Member!',
          html: `<strong>Transaction ID:</strong> <code>${paymentIntent.id}</code>`,
          confirmButtonText: 'Go to Home',
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
        });

        navigate('/');
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto shadow-md rounded p-6 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Become a Member
      </h2>
      <p className={`mb-4 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Pay <strong className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}>৳100</strong> to get the Gold badge and post unlimited!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: isDarkMode ? '#ffffff' : '#424770',
                '::placeholder': {
                  color: isDarkMode ? '#9ca3af' : '#aab7c4',
                },
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                iconColor: isDarkMode ? '#f59e0b' : '#d97706',
              },
              invalid: {
                color: isDarkMode ? '#f87171' : '#9e2146',
              },
            },
            hidePostalCode: true,
          }}
          className={`p-3 border rounded ${
            isDarkMode
              ? 'border-gray-600 bg-gray-700'
              : 'border-gray-300 bg-gray-50'
          }`}
        />

        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-2 rounded transition ${
            isDarkMode
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
        >
          {processing ? 'Processing...' : `Pay ৳${fixedAmount}`}
        </button>

        {error && (
          <p className={`text-sm ${
            isDarkMode ? 'text-red-400' : 'text-red-500'
          }`}>
            {error}
          </p>
        )}
        {successMessage && (
          <p className={`text-sm ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;