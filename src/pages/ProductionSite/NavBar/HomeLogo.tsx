import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import logoWithText from "../../../assets/logo-black.png";
import logoWithText1 from "../../../assets/logo/ByteSizedAI.png";
import logoWithText2 from "../../../assets/logo/ByteSizedAI2.png";
import { useNavigate, useLocation } from "react-router-dom";
const HomeLogo: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Typography
      variant="h6"
      sx={{ color: "black", fontWeight: "bold", cursor: "pointer" }}
      onClick={() => navigate(`/`)}
    >
       {/* <span style={{fontSize:"10px"}}>v2</span> */}
      <img
        src={(location.pathname === "/privacy" || location.pathname === "/calltoactions" || location.pathname.startsWith("/blog/") ) ? logoWithText2 : logoWithText1}
        height="65"
      />
     
    </Typography>
  );
};

export default HomeLogo;
