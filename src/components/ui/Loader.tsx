import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress sx={{ color: "#7bff004d" }} />
    </Box>
  );
};

export default Loader;
