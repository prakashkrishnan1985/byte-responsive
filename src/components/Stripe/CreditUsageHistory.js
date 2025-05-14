import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
};

const CreditUsageHistory = () => {
    const [customerId, setCustomerId] = useState('');
    const [creditHistory, setCreditHistory] = useState([]);
    const [creditPurchases, setCreditPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customerIdInput, setCustomerIdInput] = useState('');

    const fetchCreditData = async () => {
        try {
            setLoading(true);

            // Fetch usage history
            const historyResponse = await axios.get(
                `${API_BASE_URL}/api/credits/${customerId}/history`
            );

            // Fetch purchase history
            const purchasesResponse = await axios.get(
                `${API_BASE_URL}/api/credits/${customerId}/purchases`
            );

            if (historyResponse.data.success) {
                setCreditHistory(historyResponse.data.history);
            }

            if (purchasesResponse.data.success) {
                setCreditPurchases(purchasesResponse.data.purchases);
            }

            setLoading(false);
        } catch (err) {
            setError('Failed to load credit history');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchCreditData();
        }
    }, [customerId]);

    const handleSubmitCustomerId = (e) => {
        e.preventDefault();
        setCustomerId(customerIdInput);
    };

    if (!customerId) {
        return (
            <div className="customer-id-input">
                <h2>Enter Customer ID</h2>
                <form onSubmit={handleSubmitCustomerId}>
                    <input
                        type="text"
                        value={customerIdInput}
                        onChange={(e) => setCustomerIdInput(e.target.value)}
                        placeholder="Enter customer ID"
                        required
                    />
                    <button type="submit">Load Customer</button>
                </form>
            </div>
        );
    }

    if (loading) return <div>Loading credit history...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="credit-history-container">
            <h2>Credit Activity</h2>
            <p>Customer ID: {customerId}</p>

            <h3>Purchases</h3>
            <div className="credit-purchases">
                {creditPurchases.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Product</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditPurchases.map((purchase, index) => (
                                <tr key={index}>
                                    <td>{formatDate(purchase.created)}</td>
                                    <td>{purchase.product}</td>
                                    <td>{purchase.type === 'recurring' ? 'Subscription' : 'One-time'}</td>
                                    <td>{purchase.status}</td>
                                    <td>{purchase.amount ? `$${purchase.amount.toFixed(2)}` : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No credit purchases found.</p>
                )}
            </div>

            <h3>Usage History</h3>
            <div className="credit-usage">
                {creditHistory.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditHistory.map((record, index) => (
                                <tr key={index} className={record.type === 'add' ? 'credit-add' : 'credit-use'}>
                                    <td>{new Date(record.timestamp).toLocaleString()}</td>
                                    <td>{record.type === 'add' ? 'Added' : record.type === 'use' ? 'Used' : 'Set'}</td>
                                    <td>{record.amount}</td>
                                    <td>{record.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No credit usage history found.</p>
                )}
            </div>
        </div>
    );
};

export default CreditUsageHistory;