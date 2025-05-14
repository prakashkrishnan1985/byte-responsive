import React, { useState } from 'react';
import { FormControl, FormLabel, TextField, Typography, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify'; // Make sure toast is properly imported

interface ConfirmSignUpProps {
  confirmSignUp: any;
  setStepSignUp: (step: string) => void;
  email: string;
}

const ConfirmSignUp = ({ confirmSignUp, setStepSignUp, email }: ConfirmSignUpProps) => {
  // State for confirmation code and error handling
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationCodeError, setConfirmationCodeError] = useState(false);
  const [confirmationCodeErrorMessage, setConfirmationCodeErrorMessage] = useState('');
  
  // Loader and loading state
  const [loading, setLoading] = useState(false);

  // Confirm Sign-Up Function
  const handleConfirmSignUp = async () => {
    try {
      // Basic validation for confirmation code
      if (confirmationCode.length === 0) {
        setConfirmationCodeError(true);
        setConfirmationCodeErrorMessage('Confirmation code is required.');
        return;
      }

      setLoading(true); // Start loading

      // Call confirmSignUp API (replace this with your actual confirmSignUp logic)
      await confirmSignUp({
        username: email,
        confirmationCode: confirmationCode,
      });

      console.log("Confirmation successful! User is now confirmed.");
      toast.info("Sign-up complete! You can now log in.");
      setStepSignUp("done"); // Move to the final step
      setConfirmationCode(""); // Clear confirmation code field

    } catch (error) {
      console.error("Confirmation error:", error);
      setConfirmationCodeError(true);
      setConfirmationCodeErrorMessage('Error during confirmation. Please try again.');
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <FormControl>
      <FormLabel htmlFor="confirmationCode">
        <Typography sx={{ fontSize: '18px'}}>
          5. Enter your confirmation code.
        </Typography>
      </FormLabel>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          error={confirmationCodeError}
          helperText={confirmationCodeErrorMessage}
          name="confirmationCode"
          placeholder="••••••"
          type="text"
          id="confirmationCode"
          autoComplete="off"
          required
          fullWidth
          variant="standard"
          color={confirmationCodeError ? 'error' : 'primary'}
          sx={{
            border: 'none',
          }}
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
      </Box>
      <button
        onClick={handleConfirmSignUp}
        disabled={loading} // Disable button while loading
        style={{
          marginTop: '16px',
          backgroundColor: 'transparent',
          border: '1px solid',
          padding: '8px 16px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          'Confirm Sign-Up'
        )}
      </button>
    </FormControl>
  );
};

export default ConfirmSignUp;
