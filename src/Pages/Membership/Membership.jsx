import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe("pk_test_51RhpkKRh9Db7MzPj1GmZV5NgN5b7Hlsbvu4APLQIpvz4muwImMc09T02YSnQgggseHnLCDlvvgxyj3zv2GJvViuE00bHRp5fIo");

const Membership = () => {
  return (
    <div className="p-4 max-w-xl mx-auto pt-25">
      <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm></PaymentForm>
      </Elements>
    </div>
  );
};

export default Membership;