import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ByteIcon from "./ByteIcon";

const MeetByteScreen = () => {
  const [showSecondText, setShowSecondText] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSecondText(true);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div key="5" className="eoi-page">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "250px" }}
        >
          <Box sx={{ position: "absolute" }}>
            <ByteIcon size={72} />
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", paddingLeft: "80px" }}
          >
            <Typography
              variant="subtitle1"
              className="typewriter"
              sx={{
                display: "inline-block",
                fontSize: {
                  xs: "16px",
                  sm: "30px",
                  md: "32px",
                }
              }}
            >
              What if enabling AI into your product stack is as easy as a few drag-and-drops?
            </Typography>
          </Box>
        </Box>

        {showSecondText && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "24px", sm: "30px", md: "32px" },
                textAlign: "center",
                width:'145px'
              }}
              className="typewriter"
            >
              What if...
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MeetByteScreen;
