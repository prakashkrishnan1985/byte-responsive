import React from "react";
import { Box, Typography } from "@mui/material";
import { FaLeaf } from "react-icons/fa";
import Lottie from "lottie-react";
import handPlantAnimation from "./styles/animations/hand-plant-animation.json";
import "./styles/lottie.css";

const SustainabilityPresentation: React.FC<{
  sustainabilityPercentage: number;
}> = ({ sustainabilityPercentage }) => {
  const lottieRef = React.useRef<any>(null); // Ref for Lottie animation

  React.useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.stop();
      lottieRef.current.play(); // Start the animation immediately
    }
  }, []);

  return (
    <>
      {sustainabilityPercentage && (
        <Box
          sx={{
            backgroundColor: "transparent",
            padding: "0px 8px",
            borderRadius: "30px",
            textAlign: "center",
            maxWidth: "400px",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            boxShadow: 1,
          }}
        >
          {/* <FaLeaf size={19} color="#4caf50" /> */}
          <div style={{width:'30px'}}>
            <Lottie
              lottieRef={lottieRef}
              animationData={handPlantAnimation}
              loop={true}
              autoplay={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <Typography variant="subtitle2" mt={1} color="green" fontWeight={600}>
            {sustainabilityPercentage}%
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SustainabilityPresentation;
