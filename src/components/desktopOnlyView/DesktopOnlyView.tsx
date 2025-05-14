
import React from 'react';
import { useMediaQuery, Box, Typography, Button } from '@mui/material';

const DesktopOnlyView: React.FC = () => {
  // Check if the screen width matches the mobile or tablet size
  const isMobileOrTablet = useMediaQuery('(max-width: 1024px)');

  if (isMobileOrTablet) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 9999,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          This application is only compatible with desktop devices.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          Please access this app on a desktop or laptop to continue.
        </Typography>
      </Box>
    );
  }

  return null;
};

export default DesktopOnlyView;
