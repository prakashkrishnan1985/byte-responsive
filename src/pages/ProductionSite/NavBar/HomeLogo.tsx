import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import logoWithText from "../../../assets/logo-black.png";
import logoWithText1 from "../../../assets/logo/ByteSizedAI.png";
import logoWithText2 from "../../../assets/logo/ByteSizedAI2.png";
import { useNavigate, useLocation } from "react-router-dom";
const HomeLogo: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <Typography
      variant="h6"
      sx={{
        color: "black",
        fontWeight: "bold",
        cursor: "pointer",
        alignItems: "center",
        display: "flex",
      }}
      onClick={() => navigate(`/`)}
    >
      {/* <span style={{fontSize:"10px"}}>v2</span> */}
      <img
        src={
          location.pathname === "/privacy" ||
          location.pathname === "/calltoactions" ||
          location.pathname.startsWith("/blog/")
            ? logoWithText2
            : logoWithText1
        }
        height={isMobile ? "65" : "85"}
        alt="logo"
      />
    </Typography>
  );
};

export default HomeLogo;
