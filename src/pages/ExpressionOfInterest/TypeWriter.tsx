import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ByteIcon from "./ByteIcon";
import Logo from "../../assets/logo.svg";
import "./TypeWriter.scss";

interface TypeWriterProps {
  sentences: any;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ sentences }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    const sentenceChangeInterval = setInterval(() => {
      setCurrentSentenceIndex((prevIndex) => prevIndex + 1);
    }, 4000);

    return () => clearInterval(sentenceChangeInterval);
  }, [sentences.length]);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [currentSentenceIndex]);

  return (
    <div className="eoi-page">
      <Box
        sx={{ display: "flex", alignItems: "center", position: "relative" }}
        px={10}
      >
        <Box sx={{ position: "absolute" }}>
          <ByteIcon size={72} />
        </Box>
        <Box
          key={key}
          sx={{
            width: { xs: "8.5rem", sm: "16rem", md: "16.5rem", lg: "16.5rem" },
            display: "flex",
            alignItems: "center",
            paddingLeft: { xs: "40px", sm: "80px" },
          }}
        >
          {sentences[currentSentenceIndex]}
        </Box>
      </Box>
    </div>
  );
};

export default TypeWriter;
