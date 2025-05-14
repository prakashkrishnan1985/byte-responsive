import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCredits, getCreditsHistory, getSubscriptionStatus, usingCredits, getPricingTiers, purchaseCredits } from '../../services/subscriptionService';
import './PurchaseCredits.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const PurchaseCreditsPage = ({ customerId: propCustomerId }) => {
    const [customerId, setCustomerId] = useState(propCustomerId || '');
    const [creditOptions, setCreditOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [purchaseType, setPurchaseType] = useState('one_time');
    const [customerIdInput, setCustomerIdInput] = useState('');
    const [processingId, setProcessingId] = useState(null); // Track the ID of the currently processing credit option

    useEffect(() => {
        const fetchCreditOptions = async () => {
            try {
                setLoading(true);
                const response = await getPricingTiers()

                if (response.success) {
                    setCreditOptions(response.tiers);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load credit options');
                setLoading(false);
                console.error(err);
            }
        };

        fetchCreditOptions();
    }, []);

    const handleSubmitCustomerId = (e) => {
        e.preventDefault();
        setCustomerId(customerIdInput);
    };

    const handlePurchaseCredits = async (priceId) => {
        try {


            setProcessingId(priceId);
            setLoading(true);

            const response = await purchaseCredits(priceId, purchaseType);

            if (response.success && response.url) {
                window.location.href = response.url;
            } else {
                setError('Failed to create checkout session');
            }

            setLoading(false);
            setProcessingId(null); 
        } catch (err) {
            setError('Failed to process purchase');
            setLoading(false);
            setProcessingId(null); 
            console.error(err);
        }
    };

    if (loading && !creditOptions.length) 
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px" }}>
        <div className="filling-box-container">
              <div className="filling-box"></div>
              <h2 style={{ color: 'black', position: 'relative', zIndex: 1 }}>Loading credit options...</h2>
            </div>
    </div>;        

    if (error) return <div className="error">{error}</div>;

    const filteredOptions = creditOptions.filter(option => {
        if (purchaseType === 'one_time') {
            return option.type === 'one_time' ||
                (option.product && option.product.name && option.product.name.includes('One Time'));
        } else {
            return option.type === 'recurring';
        }
    });

    return (
        <div className="purchase-credits-container">
            <h2 className='purchase-credit'>Purchase Credits</h2>
            <div className="purchase-type-selector">
                <div className="radio-option">
                    <input
                        id="one-time-option"
                        type="radio"
                        name="purchase-type"
                        value="one_time"
                        checked={purchaseType === 'one_time'}
                        onChange={() => setPurchaseType('one_time')}
                    />
                    <label htmlFor="one-time-option">One-time Purchase</label>
                </div>

                <div className="radio-option">
                    <input
                        id="recurring-option"
                        type="radio"
                        name="purchase-type"
                        value="recurring"
                        checked={purchaseType === 'recurring'}
                        onChange={() => setPurchaseType('recurring')}
                    />
                    <label htmlFor="recurring-option">Recurring Monthly Credits</label>
                </div>
            </div>

            <div className="separator"></div>

            <div className="credit-options">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => (
                        <div key={option.id} className="credit-option-card">
                            <h3>{option.product?.name || option.nickname || 'Credit Package'}</h3>
                            <p className="price">${(option.unit_amount / 100).toFixed(2)} {option.type === 'recurring' ? '/month' : ''}</p>
                            {option.credits && <p className="credits">{option.credits} Credits</p>}
                            <button
                                onClick={() => handlePurchaseCredits(option.id)}
                                disabled={processingId === option.id} // Disable button for the card being processed
                            >
                                {processingId === option.id ? 'Processing...' : 'Purchase'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No credit options available for {purchaseType === 'recurring' ? 'subscription' : 'one-time purchase'}.</p>
                )}
            </div>
        </div>
    );
};

export default PurchaseCreditsPage;
