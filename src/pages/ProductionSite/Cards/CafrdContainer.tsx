import React, { Suspense } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";

const Cards1 = React.lazy(() => import("./Cards1"));
const Cards2 = React.lazy(() => import("./Cards2"));
const Cards3 = React.lazy(() => import("./Cards3"));

const CardContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row", // Stack vertically on mobile, horizontally on desktop
        gap: isMobile ? "8px" : "40px", // Adjust gap for mobile
        alignItems: "center", // Center items on mobile
        justifyContent: "center",
        padding:{xs:"50px", lg:"0px", md:"0px", sm:"0px", xl:"0px 30px"},
      }}
    >
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Cards1 />
      </Suspense>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Cards2 />
      </Suspense>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Cards3 />
      </Suspense>
    </Box>
  );
};

export default CardContainer;
