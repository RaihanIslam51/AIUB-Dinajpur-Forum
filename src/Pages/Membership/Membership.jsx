import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe("pk_test_51RhpkKRh9Db7MzPj1GmZV5NgN5b7Hlsbvu4APLQIpvz4muwImMc09T02YSnQgggseHnLCDlvvgxyj3zv2GJvViuE00bHRp5fIo");

const Membership = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm mt-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment</h2>
        <p className="text-gray-600">Enter your payment details below</p>
      </div>
      
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        Your payment is secure and encrypted
      </div>
    </div>
  );
};

export default Membership;