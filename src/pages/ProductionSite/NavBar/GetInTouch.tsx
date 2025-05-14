import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import logoWithText from "../../assets/logo-black.png";
import { useNavigate, useLocation } from "react-router-dom";
const GetInTouch: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Button
      style={{ color: "black" }}
      sx={{
        borderRadius: "30px",
        border: "1px solid #0000004D",
        marginLeft: "auto",
        marginRight: "40px",
        width: "130px",
        position: "relative",
        overflow: "hidden",
        transition: "color 0.3s ease, background-color 0.3s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          zIndex: -1,
          transition: "transform 0.3s ease",
          transform: "scaleX(0)",
          transformOrigin: "left",
        },
        "&:hover::before": {
          transform: "scaleX(1)",
        },
        "&:hover": {
          color: "#800080", // Change text color on hover
        },
        "&:active::before": {
          backgroundColor: "#800080", // Change background color on click
        },
      }}
    >
      Get in touch
    </Button>
  );
};

export default GetInTouch;
