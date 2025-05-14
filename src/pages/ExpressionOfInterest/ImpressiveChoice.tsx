import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import ByteIcon from "./ByteIcon";
import TypeWriterEffect from "./TypeWriterEffect";
import theme from "../../components/theme/theme";

const ImpressiveChoice = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div key="5" className="eoi-page">
      <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
        <Box sx={{ position: "absolute" }}>
          <ByteIcon size={72} />
        </Box>
        <Box
          sx={{
            width: { xs: "9.5rem", sm: "17.5rem", md: "17.5rem", lg: "17.5rem" },
            display: "flex",
            alignItems: "center",
            paddingLeft: { md: "80px", xs: "40px", sm:'80px' },
          }}
        >
          <TypeWriterEffect
            text="Impressive choices!"
            speed={50}
            customFontsize={isMobile ? "18px" : "33px"}
          />
        </Box>
      </Box>
    </div>
  );
};

export default ImpressiveChoice;
