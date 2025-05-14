import React, { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import DevelopInbound from "./DevelopInbound";
import DevelopOutbound from "./DevelopOutbound";
import { useOrchestration } from "../../providers/OrchestrationProvider";
import Carousel, { CarouselSlideData } from "../ui/Carousel";
import "./Develop.scss";

const Develop: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"inbound" | "outbound">("inbound");
  const { conceptData } = useOrchestration();
  const [category, setCategory] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentNodeId, setCurrentNodeId] = useState<string>();

  // Map conceptTable to carousel slides
  const mapConceptTableToCarouselSlides = (
    conceptTable: { nodeId: string; nodeName: string, source:string }[]
  ) => {
    return conceptTable?.flatMap((node, index) => [
      { content: `act${index + 1} Inbound`, nodeId: node.source },
      { content: `act${index + 1} Outbound`, nodeId: node.source },
    ]);
  };

  const carouselSlidesData = mapConceptTableToCarouselSlides(
    (conceptData as any)?.conceptTable
  );


  // Effect to update active tab based on category content
  React.useEffect(() => {
    if (category?.toLowerCase().includes("inbound")) {
      setActiveTab("inbound");
    } else if (category?.toLowerCase().includes("outbound")) {
      setActiveTab("outbound");
    }

    // Find and log nodeId for the selected category
    const matchingNode = carouselSlidesData.find(
      (slide) => slide.content === category
    );

    if (matchingNode) {
      setCurrentNodeId(matchingNode.nodeId)
    }

  }, [category]);

  return (
    <>
      <div className="carousel-container">
        <Carousel
          slides={carouselSlidesData}
          setCategory={setCategory}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
      <Box
        sx={{
          width: "1388px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          boxSizing: "border-box",
        }}
      >
        {/* Content */}
        <Box>
          {activeTab === "inbound" ? <DevelopInbound  nodeData={conceptData?.conceptTable
[Number(currentNodeId)]}/> : <DevelopOutbound currentNodeId={currentNodeId} nodeData={conceptData?.conceptTable
[Number(currentNodeId)]}/>}
        </Box>
      </Box>
    </>
  );
};

export default Develop;
