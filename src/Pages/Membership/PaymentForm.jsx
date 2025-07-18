import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/AxiosSeure/useAuth';
import useAxiosSesure from '../../Hooks/AxiosSeure/useAxiosSecure';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSesure();
  const { UserData } = useAuth();

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

        // ✅ Update user payment_status to "paid"
        await axiosSecure.patch(`/users/payment-status/${UserData.email}`, {
          payment_status: 'Gold Badge',
        });

        await Swal.fire({
          icon: 'success',
          title: 'You are now a Member!',
          html: `<strong>Transaction ID:</strong> <code>${paymentIntent.id}</code>`,
          confirmButtonText: 'Go to Home',
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
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Become a Member</h2>
      <p className="mb-4 text-gray-600">
        Pay <strong>৳100</strong> to get the Gold badge and post unlimited!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
          className="p-3 border border-gray-300 rounded"
        />

        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
        >
          {processing ? 'Processing...' : `Pay ৳${fixedAmount}`}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
