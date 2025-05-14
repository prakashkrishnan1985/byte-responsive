import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const AIOptimization = () => {
  return (
    <Box sx={{ textAlign: "center", py: 4, 
      display: "flex",
      flexDirection: "column", // Stack elements vertically
      justifyContent: "center", // Center vertically
    }}>
      {/* Top Links */}
      <Typography variant="body2" sx={{ color: "#A020F0", fontWeight: "bold", mb: 2 }}>
        EMAILS? ANALYTICS? REPORTS?
      </Typography>
      
      {/* Main Text Section */}
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        ONLY ONE TOOL <i>FOR ALL</i>
      </Typography>
      <Typography variant="h4" sx={{ fontStyle: "italic", fontWeight: "bold" }}>
        THE TASKS
      </Typography>
      
      {/* Description */}
      <Typography variant="body1" sx={{ mt: 2, color: "gray" , width: "300px",  textAlign: "center", margin:"0 auto"}}>
      Agents That Just Get It Done From chats to claims, carts to contracts, transcripts to tickets . AI agents built for real-world business tasks, not just demos.      </Typography>
    </Box>
  );
};

export default AIOptimization;
