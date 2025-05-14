import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load your Stripe Publishable Key
const stripePromise = loadStripe("pk_test_51R20NAQOROvrhhgV2Vzf63WiRALVwweX4gqesvqJHQEnoygF0rlo5Pecif3flqhuWGmDQ8l7Hj2N7BvEjA7DgAQt00ZadhS8GJ");

const StripeProvider = ({ children }) => {
    return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
