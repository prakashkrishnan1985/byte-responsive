import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPricingTiers } from '../../services/subscriptionService';
import { Skeleton } from '@mui/material';  // Import Skeleton component
import './SubscriptionPlans.css';


// can be moved to utils
function sortPricesByUnitAmount(prices) {
  return prices.sort((a, b) => a.unit_amount - b.unit_amount);
}

function SubscriptionPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state to manage when to show skeleton

  useEffect(() => {
    // Fetch pricing tiers from API and set it to state
    const fetchPlans = async () => {
      const data = await getPricingTiers();
      const sortedTiersData = sortPricesByUnitAmount(data?.tiers)
      setPlans(sortedTiersData);
      setLoading(false);  // Set loading to false when data is fetched
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (planId) => {
    navigate(`/checkout/${planId}`);
  };

  return (
    <div className='subscription-plan' style={{ backgroundColor: 'black', color: 'white', padding: '20px', height:'100vh' }}>
      <h1 style={{ textAlign: 'center' }}>Choose Your Plan</h1>

      {/* Loading placeholder table */}
      {loading ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Create a skeleton for each card */}
          {[...Array(3)].map((_, index) => (
            <div key={index} style={{
              backgroundColor: '#333',
              color: 'white',
              borderRadius: '8px',
              width: '250px',
              margin: '15px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}>
              {/* Skeleton for image (height set to 150px to match the actual image height) */}
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={150} 
                style={{ borderRadius: '5px', marginBottom: '10px', backgroundColor: '#555' }} 
              />
              {/* Skeleton for Plan Title */}
              <Skeleton 
                variant="text" 
                width="150px" 
                height={30} 
                style={{ backgroundColor: '#555', marginBottom: '10px' }} 
              />
              {/* Skeleton for Plan Description */}
              <Skeleton 
                variant="text" 
                width="200px" 
                height={20} 
                style={{ backgroundColor: '#555', marginBottom: '10px' }} 
              />
              {/* Skeleton for Credits */}
              <Skeleton 
                variant="text" 
                width="120px" 
                height={20} 
                style={{ backgroundColor: '#555', marginBottom: '10px' }} 
              />
              {/* Skeleton for Pricing */}
              <Skeleton 
                variant="text" 
                width="100px" 
                height={20} 
                style={{ backgroundColor: '#555', marginBottom: '10px' }} 
              />
              {/* Skeleton for Button (height set to match button's actual height) */}
              <Skeleton 
                variant="rectangular" 
                width="80%" 
                height={40} 
                style={{ backgroundColor: 'rgba(99, 48, 169, 1)', borderRadius: '5px' }} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
         {plans
  .filter((plan) => !plan.product.name.includes('One Time') && !plan.product.name.includes('Recurring'))
  .map((plan) => (
    <div
      key={plan.id}
      style={{
        backgroundColor: '#333',
        color: 'white',
        borderRadius: '8px',
        width: '250px',
        margin: '15px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <h2>{plan.nickname}</h2>
      <img
        src={plan.product.images[0]}
        alt={plan.product.name}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '5px',
          marginBottom: '10px',
        }}
      />
      <p>{plan.product.description}</p>
      <p>{plan.credits} credits</p>
      <p>${plan.unit_amount_decimal / 100} / month</p>
      <button
        onClick={() => handleSubscribe(plan.id)}
        style={{
          backgroundColor: 'rgba(99, 48, 169, 1)', 
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Subscribe
      </button>
    </div>
  ))}

        </div>
      )}
    </div>
  );
}

export default SubscriptionPlans;
