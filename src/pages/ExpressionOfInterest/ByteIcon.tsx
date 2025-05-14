import React from 'react';
import { Box } from '@mui/material';
import { ReactComponent as MyIcon } from '../../assets/Byte-logo.svg';
import './ByteIcon.scss';

interface ByteIconProps {
  size: number;
}

const ByteIcon: React.FC<ByteIconProps> = ({ size }) => {
  const iconSize = size * 0.54;

  return (
    <Box
      sx={{
        width: { xs: `${size * 0.5}px`, sm: `${size}px`, md: `${size}px` },
        height: { xs: `${size * 0.5}px`, sm: `${size}px`, md: `${size}px` },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123, 255, 0, 0.75) 0%, rgba(0, 99, 48, 0.75) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: { xs: `${iconSize * 0.5}px`, sm: `${iconSize}px`, md: `${iconSize}px` },
          height: { xs: `${iconSize * 0.5}px`, sm: `${iconSize}px`, md: `${iconSize}px` },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'zoomInOut 2s ease-in-out infinite',
        }}
      >
        <MyIcon width="100%" height="100%" />
      </Box>
    </Box>
  );
};

export default ByteIcon;

const styles = {
  '@keyframes zoomInOut': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.2)', // Zoom in to 120%
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
};
