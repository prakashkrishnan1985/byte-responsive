import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createCustomer, createCheckoutSession } from '../../services/subscriptionService'; 
import './Checkout.css';

function Checkout() {
  const { plan } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckout = async () => {
      try {
        // Step 1: Create Customer
        const customerResponse = await createCustomer();
        if (customerResponse.customer && customerResponse.customer.id) {
          // Step 2: Create Checkout Session after customer creation
          const checkoutResponse = await createCheckoutSession(plan);
          if (checkoutResponse.success && checkoutResponse.url) {
            // Redirect to the checkout page
            window.location.href = checkoutResponse.url;
          } else {
            setError("Failed to load checkout session.");
            setLoading(false);
          }
        } else {
          setError("Failed to create customer.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during the checkout process", error);
        setError("An error occurred while processing your request.");
        setLoading(false);
      }
    };

    handleCheckout();
  }, [plan]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {loading ? (
        <div className="filling-box-container">
          <div className="filling-box"></div>
          <h2 style={{ color: 'black', position: 'relative', zIndex: 1 }}>Redirecting to Stripe...</h2>
        </div>
      ) : (
        <h2>{error || "Failed to load checkout session."}</h2>
      )}
    </div>
  );
}

export default Checkout;
