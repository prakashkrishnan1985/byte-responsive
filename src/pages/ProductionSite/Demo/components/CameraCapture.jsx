import React, { useEffect } from 'react';
import "../styles/CameraCapture.css"

const CameraCapture = ({
  isModelLoading,
  smileDetected,
  cameraError,
  videoRef,
  canvasRef,
  onInitialize,
  onStartDetection,
  isProcessingImage
}) => {
  useEffect(() => {
    onInitialize();
  }, [onInitialize]);

  const getCameraStatus = () => {
    if (isModelLoading) return 'Loading face detection...';
    if (smileDetected) return 'Great smile! Capturing photo...';
    if (isProcessingImage) return 'Analyzing your photo...';
    return 'Please smile for the camera!';
  };

  return (
    <div className="camera-container">
      <div className="camera-status">
        {getCameraStatus()}
      </div>
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-video"
      />
      
      {cameraError && (
        <div className="camera-error">
          {cameraError}
        </div>
      )}

      {isProcessingImage && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <div>Analyzing your photo...</div>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;