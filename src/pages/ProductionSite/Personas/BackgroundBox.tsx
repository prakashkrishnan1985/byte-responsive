import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import IMG from "../../../assets/bg-blur_1.svg";
import IMG1 from "../../../assets/bg-blur.png";
import IMG3 from "../../../assets/noaicodeneeded.png";
import "./personas.css";
const BackgroundBox = ({
  blur = "20%", // Blur intensity
  opacity = 0, // Opacity of the background
  rotate = 0, // Rotation angle in degrees
  children, // Content to be displayed on top of the background
}: any) => {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 1) % 360);
    }, 10);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Box
      sx={{
        height: { xs: "100vh", md: "58vh" },
        position: "relative",
        backgroundImage: `url(${IMG1})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "180px",
        width: "100%",
        overflow: "auto",
      }}
    >
      {/* Overlay with rotation and opacity */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${IMG})`,
          backgroundSize: "90%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transform: `rotate(${angle}deg)`,
          transition: "transform 10s ease-out",
          filter: `blur(${blur})`,
          opacity: opacity,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1, // Ensure content is above the background
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BackgroundBox;
