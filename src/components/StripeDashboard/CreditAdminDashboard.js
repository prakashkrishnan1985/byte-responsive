import React, { useState } from 'react';
import axios from 'axios';
import './CreditAdminDashboard.css';

const API_URL = 'http://localhost:5000/api';

const CreditAdminDashboard = () => {
    const [customerId, setCustomerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // State for add credits form
    const [addAmount, setAddAmount] = useState('');
    const [addDescription, setAddDescription] = useState('');

    // State for enterprise credits form
    const [enterpriseCustomerId, setEnterpriseCustomerId] = useState('');
    const [enterpriseCredits, setEnterpriseCredits] = useState('');
    const [enterpriseDescription, setEnterpriseDescription] = useState('Custom enterprise allocation');

    // Add credits to customer
    const handleAddCredits = async (e) => {
        e.preventDefault();

        if (!customerId || !addAmount || isNaN(parseInt(addAmount, 10))) {
            setError('Please enter a valid customer ID and amount');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post(`${API_URL}/credits/${customerId}/add`, {
                amount: parseInt(addAmount, 10),
                description: addDescription || 'Manual credit addition by admin'
            });

            if (response.data.success) {
                setSuccessMessage(`Successfully added ${addAmount} credits to customer ${customerId}`);
                setAddAmount('');
                setAddDescription('');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Error adding credits:', err);
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Set enterprise credits
    const handleSetEnterpriseCredits = async (e) => {
        e.preventDefault();

        if (!enterpriseCustomerId || !enterpriseCredits || isNaN(parseInt(enterpriseCredits, 10))) {
            setError('Please enter a valid customer ID and amount');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post(`${API_URL}/credits/enterprise/set`, {
                customerId: enterpriseCustomerId,
                credits: parseInt(enterpriseCredits, 10),
                description: enterpriseDescription || 'Enterprise credits allocation'
            });

            if (response.data.success) {
                setSuccessMessage(`Successfully set ${enterpriseCredits} credits for enterprise customer ${enterpriseCustomerId}`);
                setEnterpriseCustomerId('');
                setEnterpriseCredits('');
                setEnterpriseDescription('Custom enterprise allocation');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Error setting enterprise credits:', err);
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="credit-admin-dashboard">
            <div className="admin-header">
                <h1>Credits Admin Dashboard</h1>
                <p className="header-subtitle">Manage customer credits</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="admin-cards">
                <div className="admin-card">
                    <h2>Add Credits to Customer</h2>
                    <form onSubmit={handleAddCredits}>
                        <div className="form-group">
                            <label htmlFor="customerId">Customer ID:</label>
                            <input
                                type="text"
                                id="customerId"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                placeholder="Enter customer ID"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="addAmount">Amount:</label>
                            <input
                                type="number"
                                id="addAmount"
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                placeholder="Enter credit amount"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="addDescription">Description:</label>
                            <input
                                type="text"
                                id="addDescription"
                                value={addDescription}
                                onChange={(e) => setAddDescription(e.target.value)}
                                placeholder="Optional description"
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-button"
                            disabled={loading || !customerId || !addAmount}
                        >
                            {loading ? 'Adding...' : 'Add Credits'}
                        </button>
                    </form>
                </div>

                <div className="admin-card">
                    <h2>Set Enterprise Credits</h2>
                    <form onSubmit={handleSetEnterpriseCredits}>
                        <div className="form-group">
                            <label htmlFor="enterpriseCustomerId">Enterprise Customer ID:</label>
                            <input
                                type="text"
                                id="enterpriseCustomerId"
                                value={enterpriseCustomerId}
                                onChange={(e) => setEnterpriseCustomerId(e.target.value)}
                                placeholder="Enter enterprise customer ID"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="enterpriseCredits">Credits Amount:</label>
                            <input
                                type="number"
                                id="enterpriseCredits"
                                value={enterpriseCredits}
                                onChange={(e) => setEnterpriseCredits(e.target.value)}
                                placeholder="Enter credit amount"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="enterpriseDescription">Description:</label>
                            <input
                                type="text"
                                id="enterpriseDescription"
                                value={enterpriseDescription}
                                onChange={(e) => setEnterpriseDescription(e.target.value)}
                                placeholder="Optional description"
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-button enterprise"
                            disabled={loading || !enterpriseCustomerId || !enterpriseCredits}
                        >
                            {loading ? 'Setting...' : 'Set Enterprise Credits'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="admin-info">
                <h3>Admin Functions</h3>
                <p>Use this dashboard responsibly to manage customer credits. All actions are logged and audited.</p>
                <ul>
                    <li><strong>Add Credits</strong>: Add additional credits to an existing customer's account</li>
                    <li><strong>Set Enterprise Credits</strong>: Set a specific credit amount for enterprise customers</li>
                </ul>
            </div>
        </div>
    );
};

export default CreditAdminDashboard;