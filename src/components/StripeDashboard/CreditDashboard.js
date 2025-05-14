import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './CreditDashboard.css';
import { getCredits, getCreditsHistory, getSubscriptionStatus, usingCredits } from '../../services/subscriptionService';

const CreditDashboard = () => {
    // Get customer ID from URL if available (for redirect from successful checkout)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    const [customerId, setCustomerId] = useState('');
    const [customerIdInput, setCustomerIdInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for dashboard data
    const [credits, setCredits] = useState(null);
    const [history, setHistory] = useState([]);
    const [subscription, setSubscription] = useState(null);

    // State for credit usage
    const [useAmount, setUseAmount] = useState('');
    const [useFeature, setUseFeature] = useState('api_call');
    const [useDescription, setUseDescription] = useState('');

    // Check for session ID on initial load
    useEffect(() => {
            loadCustomerData();
    }, []);

    // Load customer data
    const loadCustomerData = async (id) => {
        // if (!id) return;
        setLoading(true);
        setError(null);

        try {
            // Fetch credits
            const creditsResponse = await getCredits();
            setCredits(creditsResponse.credits);

            // Fetch credit history
            const historyResponse = await getCreditsHistory();
            setHistory(historyResponse.history || []);

            // Fetch subscription status
            const subscriptionResponse = await getSubscriptionStatus();
            setSubscription(subscriptionResponse);

            setCustomerId(id);
            setCustomerIdInput(id);

            // Save customer ID to local storage for convenience
            localStorage.setItem('customerId', id);
        } catch (err) {
            console.error('Error loading customer data:', err);
            setError(err.response?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle credit usage
    const handleUseCredits = async (e) => {
        e.preventDefault();
    

        if (!useAmount || isNaN(parseInt(useAmount, 10))) {
            return;
        }

        setLoading(true);

        try {
            const amount = parseInt(useAmount, 10);
            const feature = useFeature;
            const description = useDescription || `Used for ${useFeature}`;
            const response = await usingCredits(amount, feature, description);  
            if (response.success) {
                // Update credits
                setCredits(response.credits);

                // Refresh history
                const historyResponse = getCreditsHistory();
                setHistory(historyResponse.history || []);

                // Reset form
                setUseAmount('');
                setUseDescription('');

                setError(null);
            } else {
                setError(response.message);
            }
        } catch (err) {
            console.error('Error using credits:', err);
            setError(err.response?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Format dates
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch (e) {
            return dateString;
        }
    };

    // Get plan name from subscription
    const getPlanName = () => {
        if (!subscription || !subscription.subscriptions || subscription.subscriptions.length === 0) {
            return 'No active plan';
        }

        const sub = subscription.subscriptions[0];

        if (sub.items && sub.items.data && sub.items.data.length > 0) {
            const price = sub.items.data[0].price;
            return price.nickname || 'Unknown Plan';
        }

        return 'Unknown Plan';
    };

    // Get expiration date
    const getExpirationDate = () => {
        if (!subscription || !subscription.subscriptions || subscription.subscriptions.length === 0) {
            return 'N/A';
        }

        const sub = subscription.subscriptions[0];
        return formatDate(new Date(sub.current_period_end * 1000));
    };
    

    return (
        <div className="credit-dashboard-container">
            <div className="credit-dashboard-header">
                <h1>Credits Dashboard</h1>
                <p className="dashboard-subtitle">Monitor your credits and subscription status</p>
            </div>
            <div className="separator"></div>
            { credits && (
                <div className="dashboard-content">
                    <div className="dashboard-summary">
                        <div className="summary-card subscription-card">
                            <h2>Subscription</h2>
                            <div className="card-content">
                                <div className="info-row">
                                    <span className="info-label">Plan:</span>
                                    <span className="info-value">{getPlanName()}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Status:</span>
                                    <span className="info-value">{subscription?.hasActiveSubscription ? 'Active' : 'Inactive'}</span>
                                </div>
                                {subscription?.hasActiveSubscription && (
                                    <div className="info-row">
                                        <span className="info-label">Expires:</span>
                                        <span className="info-value">{getExpirationDate()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="summary-card credits-card">
                            <h2>Credits</h2>
                            <div className="card-content">
                                <div className="credit-balance">
                                    <span className="balance-number">{credits.available_credits}</span>
                                    <span className="balance-label">Available Credits</span>
                                </div>
                                <div className="credit-stats">
                                    <div className="stat">
                                        <span className="stat-label">Total Awarded:</span>
                                        <span className="stat-value">{credits.total_awarded}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Total Used:</span>
                                        <span className="stat-value">{credits.total_used}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="summary-card usage-card">
                            <h2>Use Credits</h2>
                            <form onSubmit={handleUseCredits} className="use-credits-form">
                                <div className="form-group">
                                    <label htmlFor="amount">Amount:</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={useAmount}
                                        onChange={(e) => setUseAmount(e.target.value)}
                                        min="1"
                                        max={credits.available_credits}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="feature">Feature:</label>
                                    <select
                                        id="feature"
                                        value={useFeature}
                                        onChange={(e) => setUseFeature(e.target.value)}
                                    >
                                        <option value="api_call">API Call</option>
                                        <option value="content_generation">Content Generation</option>
                                        <option value="image_processing">Image Processing</option>
                                        <option value="analysis">Data Analysis</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description:</label>
                                    <input
                                        type="text"
                                        id="description"
                                        value={useDescription}
                                        onChange={(e) => setUseDescription(e.target.value)}
                                        placeholder="Optional description"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="use-credits-btn"
                                    disabled={loading || !useAmount || isNaN(parseInt(useAmount, 10)) || parseInt(useAmount, 10) > credits.available_credits}
                                >
                                    Use Credits
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="history-section">
                        <h2>Credit History</h2>
                        {history.length === 0 ? (
                            <p className="no-history">No credit history found.</p>
                        ) : (
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((entry, index) => (
                                        <tr key={index} className={`history-row ${entry.type}`}>
                                            <td>{formatDate(entry.created_at)}</td>
                                            <td className="history-type">
                                                {entry.type === 'add' ? 'Added' : entry.type === 'use' ? 'Used' : 'Set'}
                                            </td>
                                            <td className="history-amount">{entry.amount}</td>
                                            <td>{entry.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditDashboard;