import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import RotatingImage from "../Sppiner/RotatingImage";
import MagneticCircleButton from "../MagnetBtn/MagneticCircleButton";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  // Use MUI's useTheme and useMediaQuery for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box
        sx={{
          height: isMobile ? "300px" : "480px", // Adjust height for mobile
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"} // Adjust typography for mobile
          sx={{
            color: "black",
            font: "Mulish",
            size: isMobile ? "2rem" : "3.35rem", // Adjust font size for mobile
            marginBottom: isMobile ? "-10px" : "-25px", // Adjust margin for mobile
          }}
        >
          <b>
            {" "}
            AI CURATED <i>BY YOU</i>
          </b>
        </Typography>
        <RotatingImage height={isMobile ? "200" : "380"} />{" "}
        {/* Adjust image size for mobile */}
        <Typography
          variant={isMobile ? "h4" : "h2"} // Adjust typography for mobile
          sx={{
            color: "black",
            font: "Mulish",
            size: isMobile ? "2rem" : "3.35rem", // Adjust font size for mobile
            marginTop: isMobile ? "-15px" : "-35px", // Adjust margin for mobile
          }}
        >
          <b>FOR YOU</b>
        </Typography>
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            textAlign: "center",
            color: "#F5F1F9",
            fontSize: isMobile ? "4rem" : "14rem", // Adjust font size for mobile
            fontWeight: "bold",
            zIndex: -1,
            letterSpacing: isMobile ? "5px" : "10px", // Adjust letter spacing for mobile
          }}
        >
          AI STUDIO
        </Typography>
      </Box>
      <Box
        sx={{
          width: "auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // Stack vertically on mobile
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "20px" : "0", // Add padding for mobile
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "30%", // Full width on mobile
            textAlign: isMobile ? "center" : "left", // Center text on mobile
            marginLeft: isMobile ? "0" : "30px", // Remove margin on mobile
            marginTop: isMobile ? "0" : "-11rem", // Adjust margin for mobile
            padding: isMobile ? "10px" : "0", // Add padding for mobile
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            You’ve Seen AI Work{" "}
            <span style={{ color: "purple" }}>—Now Make AI Agents</span> Work
            for You
          </Typography>

          <Typography style={{ marginBottom: "10px", color: "#000" }}>
            AI Agents use AI to automate tasks, make decisions, and improve your
            product stack. With ByteSized AI Studio, drag and drop pre-trained
            models to create, adapt, and deploy tailored agents for your unique
            business needs.
          </Typography>
          <Typography style={{ marginBottom: "40px", color: "#000" }}>
            Forget one-size-fits-all solutions; these agents work the way you
            do, empowering your vision. Let’s build smarter, together!
          </Typography>
        </Box>

        <Box
          sx={{
            width: isMobile ? "100%" : "60%", // Full width on mobile
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Stack buttons vertically on mobile
            justifyContent: "flex-end",
            alignItems: isMobile ? "center" : "flex-end", // Center buttons on mobile
            gap: isMobile ? "10px" : "0", // Add gap between buttons on mobile
            padding: isMobile ? "10px" : "0", // Add padding for mobile
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "row" : "row", // Stack buttons vertically on mobile
              gap: isMobile ? "10px" : "0", // Add gap between buttons on mobile
            }}
          >
            <MagneticCircleButton
              size={isMobile ? 100 : 140} // Adjust button size for mobile
              name="Apply for Beta"
              defaultColor="#800080"
              actionEvent={() => {
                navigate("/beta");
              }}
              isMob={isMobile}
            />
            <MagneticCircleButton
              size={isMobile ? 80 : 115} // Adjust button size for mobile
              name="INTERESTED AS AI DEV"
              defaultColor="#000000"
              actionEvent={() => {
                navigate("/calltoactions");
              }}
              isMob={isMobile}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Header;
