import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import HoverCard from "../UseCasesSection/HoverCards";
import C1 from "../../assets/usecase/useCase_3.png";
import C2 from "../../assets/usecase/useCase_6.png";

const PictureRelatedFlows: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cards = [
    {
      id: 1,
      frontText: "GENERATOR",
      backText: "DYNAMIC DESCRIPTION",
      backgroundImage: C1,
      width: "500",
      height: "200",
    },
    {
      id: 2,
      frontText: "GENERATOR",
      backText: "DYNAMIC DESCRIPTION",
      backgroundImage: C2,
      width: "500",
      height: "200",
    },
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
      <Typography variant="h4" sx={{ fontSize: "2.625rem" }}>
        Picture related flows
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          mt: 1,
          lineHeight: "normal",
          color: "gray",
          width: "500px",
          textAlign: "left",
          pb: "20px",
        }}
      >
        Lorem ipsum dolor sit amet consectetur. Pretium eu et purus pellentesque
        a tellus. Volutpat in sagittis tempor tempus pulvinar tellus. Turpis
        nul.
      </Typography>

      {/* Grid Layout: 3 columns and 2 rows */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: "xl" }}
      >
        {cards.map((card: any, index: any) => (
          <Grid
            item
            key={card.id}
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HoverCard {...card} />
          </Grid>
        ))}
        <Card
          sx={{
            width: "330px",
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "12px",
            margin: "25px 16px 0 16px",
          }}
        >
          <CardContent>
            <Typography
              variant="body1"
              sx={{
                color: "#fff",
                mb: 1,
                fontSize: "18px",
              }}
            >
              Dynamic description generator
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8,  fontSize: "14px", lineHeight:"1.2" , pb:5}}>
              Lorem ipsum dolor sit amet consectetur. Quis hendrerit viverra
              tristique ipsum amet sit ipsum sit. Et sed eu erat erat risus
              vitae netus.
            </Typography>
            <Typography
              component="a" // Make Typography render as an anchor tag
              href="/detail" // Set the href link
              sx={{
                color: "#fff",
                textDecoration: "none", 
                justifyContent: "end",
                display: "flex",
                fontSize: "16px",
              }}
            >
              {"See Detail ->"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default PictureRelatedFlows;
