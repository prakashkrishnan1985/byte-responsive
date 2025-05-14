import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import HoverCard from "../UseCasesSection/HoverCards";
import C1 from "../../assets/usecase/useCase_2.png";
import C2 from "../../assets/usecase/useCase_5.png";
import C3 from "../../assets/usecase/useCase_3.png";
import C4 from "../../assets/usecase/useCase_1.png";
import C5 from "../../assets/usecase/useCase_4.png";

const SpeachRelatedFlows: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Dynamic description generator
 const cards = [
    { id: 1, frontText: "GENERATOR", backText: "DYNAMIC DESCRIPTION GENERATOR", backgroundImage:C1, width:"500", height:"200" },
    { id: 2, frontText: "GENERATOR", backText: "DYNAMIC DESCRIPTION GENERATOR", backgroundImage:C2, width:"500", height:"200" },
    { id: 3, frontText: "GENERATOR", backText: "DYNAMIC DESCRIPTION GENERATOR", backgroundImage:C2, width:"500", height:"200" },
    { id: 4, frontText: "GENERATOR", backText: "DYNAMIC DESCRIPTION GENERATOR", backgroundImage:C3, width:"500", height:"200" },
    { id: 5, frontText: "GENERATOR", backText: "DYNAMIC DESCRIPTION GENERATOR", backgroundImage:C4, width:"500", height:"200" },
    { id: 6, frontText: "GENERATOR", backText: "DYNAMIC DESCRIPTION GENERATOR", backgroundImage:C5, width:"500", height:"200" },
  ];

  return (
    <Box
      sx={{
        backgroundImage: "url('https://via.placeholder.com/1920x1080')", // Replace with your image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "left",
        textAlign: "justify",
        padding: 4,
      }}
    >
        <Typography variant="h4" sx={{ fontSize:"2.625rem" }}>
        Speach related flows
      </Typography>
      
      {/* Description */}
      <Typography variant="body1" sx={{ mt: 1, lineHeight: "normal", color: "gray" , width: "500px",  textAlign: "left" , pb:"20px"}}>
      Lorem ipsum dolor sit amet consectetur. Pretium eu et purus pellentesque a tellus. Volutpat in sagittis tempor tempus pulvinar tellus. Turpis nul.
      </Typography>
    
      {/* Grid Layout: 3 columns and 2 rows */}
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: "xl" }}>
        {cards.map((card:any, index:any) => (
          <Grid item key={card.id} xs={4} 
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          >
              <HoverCard  {...card} />
          </Grid>
        ))}
      </Grid>

      
    </Box>
  );
};

export default SpeachRelatedFlows;