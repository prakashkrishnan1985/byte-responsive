import React, { Suspense } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import CardComponent from "./CardComponent";
import IMG1 from "../../../assets/coding-3d-icon-Photoroom2.png";
import IMG2 from "../../../assets/Trophy-minimal-Photoroom1.png";
import IMG3 from "../../../assets/Puzzle piece-Photoroom1.png";

const cardData = [
  {
    title: "BUILD, DON'T CONSULT",
    description:
      "BYTESIZED AI Studio is your ultimate tool for creating custom AI agents. No more waiting for consultants—just build your own AI solutions with our intuitive platform.",
    imageSrc: IMG1,
    subTitle: "innovation for success",
  },
  {
    title: "YOUR AGENTS, YOUR EXPERTISE",
    description:
      "Build agents designed for your product stack and workflows. They're yours to own, integrating seamlessly into your unique business ecosystem.",
    imageSrc: IMG2,
    subTitle: "Built for Your Stack, Owned by You",
  },
  {
    title: "MONETIZE OR OPEN SOURCE WITH THE MARKETPLACE",
    description:
      "AI developers can contribute modular agents and production-ready models to the ByteSizedAI Marketplace—either to monetize or open source. Help teams move faster with reusable components, and grow a trusted community of builders.",
    imageSrc: IMG3,
    subTitle: "REUSABLE. RELIABLE. REWARDED.",
  },
];

const CardContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detect mobile screens

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "24px",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "30px 20px",
        margin: "auto",
      }}
    >
      {cardData.map((card, index) => (
        <Suspense
          key={index}
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
          <CardComponent
            title={card.title}
            description={card.description}
            imageSrc={card.imageSrc}
            subTitle={card.subTitle}
          />
        </Suspense>
      ))}
    </div>
  );
};

export default CardContainer;
