import { useMediaQuery, useTheme } from "@mui/system";
import React from "react";

const ToneSelector = ({ tones, selectedTone, onToneSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xl")); // Check if mobile screen

  return (
    <div className="tone-selection">
      {tones.map((tone) => (
        <button
          key={tone}
          className={selectedTone === tone ? "selected-tone" : ""}
          onClick={() => onToneSelect(tone)}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "1.2rem" : "1.8rem",
            }}
          >
            {tone}
          </Typography>
        </button>
      ))}
    </div>
  );
};

export default ToneSelector;
