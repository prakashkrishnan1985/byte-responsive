import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import HoverCard from "../UseCasesSection/HoverCards";
import C1 from "../../../assets/usecase/useCase_1.png";
import C2 from "../../../assets/usecase/useCase_2.png";
import C3 from "../../../assets/usecase/useCase_3.png";
import C4 from "../../../assets/usecase/useCase_4.png";
import C5 from "../../../assets/usecase/useCase_5.png";
import PopupModal from "../DialogBox/DialogBox";

interface cardProps {
  item: any;
}

const WritingRelatedFlow: React.FC<cardProps> = (props: cardProps) => {
  const { item } = props;

  function selectRandomValue() {
    const values = [C1, C2, C3, C4, C5];
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
  }
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [content, setContent]: any = useState({});
  const handleEvent = (item: any) => {
    setContent(item);
    setOpen(true);
  };
  const cards = [
    {
      id: 1,
      frontText: "GENERATOR",
      backText: "DYNAMIC DESCRIPTION GENERATOR",
      backgroundImage: C1,
      width: "500",
      height: "200",
      action: handleEvent,
    },
    {
      id: 2,
      frontText: "GENERATOR",
      backText: "DYNAMIC DESCRIPTION GENERATOR",
      backgroundImage: C2,
      width: "500",
      height: "200",
      action: handleEvent,
    },
    {
      id: 3,
      frontText: "GENERATOR",
      backText: "DYNAMIC DESCRIPTION GENERATOR",
      backgroundImage: C2,
      width: "500",
      height: "200",
      action: handleEvent,
    },
    {
      id: 4,
      frontText: "GENERATOR",
      backText: "DYNAMIC DESCRIPTION GENERATOR",
      backgroundImage: C3,
      width: "500",
      height: "200",
      action: handleEvent,
    },
    {
      id: 5,
      frontText: "GENERATOR",
      backText: "DYNAMIC DESCRIPTION GENERATOR",
      backgroundImage: C4,
      width: "500",
      height: "200",
      action: handleEvent,
    },
    {
      id: 6,
      frontText: "GENERATOR",
      backText: "DYNAMIC DESCRIPTION GENERATOR",
      backgroundImage: C5,
      width: "500",
      height: "200",
      action: handleEvent,
    },
  ];
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: { xs: "0rem", md: "1rem 4rem" },
          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
          },
          mx: "auto", // center horizontally
          textAlign: "left", // align text to the left if needed
          width: "100%",
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          sx={{
            fontSize: "3rem",
            fontWeight: 600,
            marginBottom: "1rem",
            textAlign: { xs: "center", md: "left" },
            width: "100%",
            paddingX: "1rem",
          }}
        >
          {item?.section_header}
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: "#000",
            marginBottom: "2rem",
            maxWidth: "800px",
            textAlign: { xs: "center", md: "left" },
            marginLeft: { xs: "auto", md: "0" },
            marginRight: { xs: "auto", md: "0" },
            paddingX: "1rem",
            fontSize: { xs: "2rem" },
          }}
        >
          {item?.section_description}
        </Typography>

        {/* Grid Layout */}
        <Grid
          container
          justifyContent="left"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            flexDirection: { xs: "column", md: "column", lg: "row" },
          }}
        >
          {item?.articles.map((card: any, index: any) => (
            <Grid
              item
              key={card.id + index}
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem",
              }}
            >
              <HoverCard
                {...{
                  ...card,
                  ...{
                    backgroundImage: selectRandomValue(),
                    action: handleEvent,
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <PopupModal
        title="Test"
        content={content}
        setOpen={setOpen}
        open={open}
      />
    </>
  );
};

export default WritingRelatedFlow;
