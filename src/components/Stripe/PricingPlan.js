import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PricingPlans.css"; // Import the CSS file

const API_URL = "http://localhost:5000/api";

const generateUniqueEmail = () => {
    const timestamp = new Date().getTime();
    return `test-user-${timestamp}@example.com`;
};

// Feature data (mocked based on your image)
const features = [
    { name: "Agents", values: ["3", "10", "20", "Unlimited"] },
    { name: "Models per Agent", values: ["3", "4", "5", "Unlimited"] },
    { name: "Included Credits", values: ["500", "1,500", "3,000", "Custom"] },
    { name: "Extra Credit Purchases", values: ["✅", "✅", "✅", "✅"] },
    { name: "Text-Based Models", values: ["✅", "✅", "✅", "✅"] },
    { name: "Image Models", values: ["❌", "✅", "✅", "✅"] },
    { name: "Voice Models", values: ["❌", "❌", "✅", "✅"] },
    { name: "Video Models", values: ["❌", "❌", "❌", "✅"] },
    { name: "Knowledge Hub", values: ["Up to 10 Docs", "Up to 50 Docs", "Up to 100 Docs", "Unlimited"] },
    { name: "Support Turnaround", values: ["Community", "3-4 Days", "3-4 Days", "Immediate"] }
];

const plans = [
    { name: "Starter", price: "Free", index: 0 },
    { name: "Growth", price: "$19.99", index: 1 },
    { name: "Pro", price: "$29.99", index: 2 },
    { name: "Enterprise", price: "Custom Pricing", index: 3 }
];

function usePricingPlans(user) {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerId, setCustomerId] = useState(null);
    const [generatedEmail, setGeneratedEmail] = useState(generateUniqueEmail());
    const [isCopied, setIsCopied] = useState(false);
    const [planPriceMap, setPlanPriceMap] = useState({});

    useEffect(() => {
        fetchPricingTiers();
    }, []);

    const fetchPricingTiers = async () => {
        try {
            const response = await axios.get(`${API_URL}/pricing-tiers`);
            const tiersData = response.data.tiers.sort((a, b) => a.unit_amount - b.unit_amount);
            setTiers(tiersData);

            // Create mapping of plan names to price IDs
            const priceMap = {};
            tiersData.forEach(tier => {
                if (tier.nickname) {
                    priceMap[tier.nickname] = tier.id;
                    console.log(`Mapped ${tier.nickname} to price ID: ${tier.id}`);
                }
            });
            setPlanPriceMap(priceMap);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching pricing tiers:", error);
            setLoading(false);
        }
    };

    const createCustomer = async () => {
        try {
            console.log(`Creating customer with email: ${generatedEmail}`);
            const response = await axios.post(`${API_URL}/customers`, {
                email: generatedEmail,
                name: user?.name || "Test User",
            });

            const newCustomerId = response.data.customer.id;
            console.log(`Customer created with ID: ${newCustomerId}`);
            setCustomerId(newCustomerId);
            setIsCopied(false); // Reset copy state
            return newCustomerId;
        } catch (error) {
            console.error("Error creating customer:", error);
            console.error("Error details:", error.response?.data || error.message);
            return null;
        }
    };

    const copyCustomerId = () => {
        if (customerId) {
            navigator.clipboard.writeText(customerId);
            setIsCopied(true); // Enable subscription buttons
        }
    };

    const handleSubscribe = async (planName) => {
        if (!isCopied) {
            alert("Please copy customer ID first");
            return;
        }

        try {
            const priceId = planPriceMap[planName];
            if (!priceId) {
                console.error(`No price ID found for plan: ${planName}`);
                alert(`Could not find price ID for ${planName} plan. Available plans: ${Object.keys(planPriceMap).join(', ')}`);
                return;
            }

            console.log(`Subscribing to ${planName} with price ID: ${priceId}`);

            const cid = customerId || (await createCustomer());
            if (!cid) {
                alert("Failed to get customer ID");
                return;
            }

            console.log(`Creating checkout session for customer: ${cid}`);
            const response = await axios.post(`${API_URL}/create-checkout-session`, {
                priceId,
                customerId: cid
            });

            if (!response.data.success) {
                throw new Error(response.data.error || "Failed to create checkout session");
            }

            console.log("Redirecting to checkout:", response.data.url);
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error creating checkout session:", error);
            console.error("Error details:", error.response?.data || error.message);
            alert("Something went wrong. Please check the console for details.");
        }
    };

    return {
        tiers,
        loading,
        handleSubscribe,
        currentEmail: generatedEmail,
        currentCustomerId: customerId,
        createCustomer,
        copyCustomerId,
        isCopied,
        planPriceMap
    };
}

const PricingPlans = ({ user }) => {
    const {
        tiers,
        loading,
        handleSubscribe,
        currentEmail,
        currentCustomerId,
        createCustomer,
        copyCustomerId,
        isCopied,
        planPriceMap
    } = usePricingPlans(user);

    if (loading) return <div className="loading">Loading pricing plans...</div>;

    // Debug available tiers
    const availablePlans = Object.keys(planPriceMap).length > 0
        ? Object.keys(planPriceMap).join(", ")
        : "No plans with price IDs found";

    return (
        <div className="pricing-container">
            <h1>BytesizedAI Pricing Plans</h1>

            <div className="test-mode">
                <p><strong>Test Mode:</strong> Using email: {currentEmail}</p>
                {currentCustomerId ? (
                    <div>
                        <p><strong>Customer ID:</strong> {currentCustomerId}</p>
                        <button className="copy-btn" onClick={copyCustomerId}>
                            {isCopied ? "Copied!" : "Copy Customer ID"}
                        </button>
                        <p><small>Available plans with price IDs: {availablePlans}</small></p>
                    </div>
                ) : (
                    <button className="create-customer-btn" onClick={createCustomer}>
                        Generate Customer ID
                    </button>
                )}
            </div>

            <div className="pricing-grid">
                {plans.map((plan) => (
                    <div key={plan.index} className="pricing-card">
                        <h2>{plan.name}</h2>
                        <div className="price">{plan.price}</div>
                        <button
                            onClick={() => handleSubscribe(plan.name)}
                            className="subscribe-btn"
                            disabled={!isCopied}
                        >
                            {plan.name === "Enterprise" ? "Contact Sales" : "Subscribe"}
                        </button>
                        <ul className="features-list">
                            {features.map((feature) => (
                                <li key={feature.name}>
                                    <span className="feature-label">{feature.name}</span>
                                    <span className="feature-value">{feature.values[plan.index]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPlans;