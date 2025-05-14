import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubscriptionStatus, addCredits, usingCredits, getCredits, getCreditsHistory } from '../../services/subscriptionService';
import { Card, CardContent, Typography, Box, Button, CircularProgress, TextField, Grid, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Success() {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creditInput, setCreditInput] = useState(''); // State for input credit amount
  const [creditsUpdated, setCreditsUpdated] = useState(null); // State to track credit added/used
  const [creditError, setCreditError] = useState(null); // Error handling for credit input
  const [transactionHistory, setTransactionHistory] = useState([]); // State for storing transaction history

  useEffect(() => {
    // Function to fetch subscription status and transaction history on page load
    const fetchSubscriptionStatusAndHistory = async () => {
      try {
        const response = await getSubscriptionStatus(); // Get subscription data
        setSubscriptionStatus(response); // Set subscription data in state
        const historyResponse = await getCreditsHistory(); // Get transaction history
        setTransactionHistory(historyResponse.history); // Set transaction history
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscription status or transaction history", error);
        setError("Failed to load subscription status or transaction history.");
        setLoading(false);
      }
    };

    fetchSubscriptionStatusAndHistory(); // Call the function on component mount
  }, []); // Empty dependency array to run the effect only once

  // Handle credit input change
  const handleCreditInputChange = (event) => {
    setCreditInput(event.target.value);
  };

  // Fetch updated credits and transaction history after adding or using credits
  const fetchUpdatedCreditsAndHistory = async () => {
    try {
      const response = await getCredits(); // Call the service to get updated credits data
      setSubscriptionStatus((prevStatus) => ({
        ...prevStatus,
        credits: response.credits, // Update credits section with the new data
      }));

      const historyResponse = await getCreditsHistory(); // Fetch transaction history
      setTransactionHistory(historyResponse.history); // Update transaction history
    } catch (error) {
      setError('Failed to fetch updated credits or transaction history. Please try again later.');
    }
  };

  // Handle Add Credits
  const handleAddCredits = async () => {
    if (isNaN(creditInput) || creditInput <= 0) {
      setCreditError('Please enter a valid credit amount.');
      return;
    }
    try {
      await addCredits(creditInput, "feature_name"); // Replace "feature_name" as needed
      setCreditError(null); // Clear any existing errors
      setCreditsUpdated(`Added ${creditInput} credits successfully!`);
      setCreditInput(''); // Clear input field after successful operation
      await fetchUpdatedCreditsAndHistory(); // Fetch updated credits and history
    } catch (error) {
      setCreditError('Failed to add credits. Please try again later.');
    }
  };

  // Handle Use Credits
  const handleUseCredits = async () => {
    if (isNaN(creditInput) || creditInput <= 0) {
      setCreditError('Please enter a valid credit amount.');
      return;
    }
    if (creditInput > subscriptionStatus.credits?.available_credits) {
      setCreditError('Not enough credits available to use.');
      return;
    }
    try {
      await usingCredits(creditInput, "feature_name", "description"); // Replace as needed
      setCreditError(null); // Clear any existing errors
      setCreditsUpdated(`Used ${creditInput} credits successfully!`);
      setCreditInput(''); // Clear input field after successful operation
      await fetchUpdatedCreditsAndHistory(); // Fetch updated credits and history
    } catch (error) {
      setCreditError('Failed to use credits. Please try again later.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={4} maxWidth="1200px" margin="0 auto" textAlign="center">
      <Typography variant="h4" gutterBottom color="primary">
        Payment Successful! 🎉
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Thank you for subscribing. You can now start using ByteSizedAI.
      </Typography>

      {/* Subscription and Credits in the same row */}
      <Box my={4}>
        <Grid container spacing={4} justifyContent="center">
          {/* Subscription Box */}
          <Grid item xs={12} sm={6} md={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {subscriptionStatus.subscriptions[0]?.plan.nickname || "Enterprise"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Plan: {subscriptionStatus.subscriptions[0]?.plan.nickname}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Status: {subscriptionStatus.subscriptions[0]?.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Credits Box */}
          <Grid item xs={12} sm={6} md={5}>
            <Card>
              <CardContent>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <strong>Available Credits:</strong> {subscriptionStatus.credits?.available_credits}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <strong>Total Awarded:</strong> {subscriptionStatus.credits?.total_awarded}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  <strong>Total Used:</strong> {subscriptionStatus.credits?.total_used}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="body1" sx={{ fontSize: '1rem'}}>
        <h1>
          To view your credits.
          </h1>
          <Link to="/credit-dashboard" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: '50px', // Rounded edges for a modern feel
                backgroundColor: '#6200ea', // Modern purple color
                textTransform: 'none',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
                transition: 'background-color 0.3s, transform 0.3s', // Smooth transitions
                "&:hover": {
                  backgroundColor: '#3700b3', // Darker shade on hover
                  transform: 'scale(1.05)', // Slight scaling effect for hover
                },
                "&:focus": {
                  outline: 'none',
                  boxShadow: '0px 0px 5px 2px rgba(98, 0, 234, 0.8)', // Focus state with shadow
                },
                "&:active": {
                  backgroundColor: '#6200ea', // Keep the active state consistent with the base color
                  transform: 'scale(0.98)', // Slight shrinking effect when clicked
                },
              }}
            >
              Go To Dashboard
            </Button>
          </Link>
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="body1" sx={{ fontSize: '1rem'}}>
        <h1>
          To add more credits.
          </h1>
          <Link to="/purchase-credits" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: '50px', 
                backgroundColor: '#6200ea',
                textTransform: 'none',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', 
                transition: 'background-color 0.3s, transform 0.3s', 
                "&:hover": {
                  backgroundColor: '#3700b3', 
                  transform: 'scale(1.05)',
                },
                "&:focus": {
                  outline: 'none',
                  boxShadow: '0px 0px 5px 2px rgba(98, 0, 234, 0.8)', 
                },
                "&:active": {
                  backgroundColor: '#6200ea', 
                  transform: 'scale(0.98)', 
                },
              }}
            >
              Go To Purchase Credits
            </Button>
          </Link>
        </Typography>
      </Box>


      {/* Manage Credits in a new row */}
      {/* <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Manage Your Credits:
        </Typography>
        {creditError && <Alert severity="error">{creditError}</Alert>} 
        {creditsUpdated && <Alert severity="success">{creditsUpdated}</Alert>}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Credit Amount"
              variant="outlined"
              fullWidth
              type="number"
              value={creditInput}
              onChange={handleCreditInputChange}
              error={!!creditError}
              helperText={creditError}
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="stretch">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCredits}
                sx={{ marginBottom: 2 }} 
              >
                Add Credits
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUseCredits}
              >
                Use Credits
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box> */}

      {/* Transaction History Table */}
      {/* <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Transaction History:
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Feature</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionHistory.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
                  <TableCell>{transaction.type === 'add' ? 'Added' : 'Used'}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.feature || '-'}</TableCell>
                  <TableCell>{transaction?.source || '-'}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box> */}
    </Box>
  );
}

export default Success;
