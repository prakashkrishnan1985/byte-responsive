import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

const CalendarEmbed = () => {
  const mainRef: any = useRef(null);
  useEffect(() => {
    const iframe = document.querySelector("iframe");

    if (iframe && iframe.contentDocument) {
      const mainElement = iframe.contentDocument.querySelector("main");
      if (mainElement) {
        mainElement.style.background = "#fff";
      }
    }
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          background: "#0000",
          color: "#fff",
          marginBottom: '-3.4rem'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: 2,
            color: "#333",
            textAlign: "center",
            textTransform: "uppercase",
            fontStyle: "italic",
            width: "min(100%, 530px)",
            fontSize: "52px",
            margin: "0 auto;",
            
          }}
        >
          <span style={{ fontWeight: "800", fontStyle: "normal" }}>
            Your Time, Your Schedule – {" "}
          </span>
          let's talk!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            color: "#666",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          Book a time that works for you, and let’s dive into something exciting together...
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            color: "#666",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
        </Typography>
      </Box>
      <div
        style={{ width: "100%", height: "800px", border: "none"}}
        ref={mainRef}
      >
        <iframe
          src="https://cal.com/bytesized"
          width="100%"
          height="800px"
          style={{ border: "none", background: "#fff", display: "block" }}
          title="Cal.com Scheduler"
        ></iframe>
      </div>
    </>
  );
};

export default CalendarEmbed;
