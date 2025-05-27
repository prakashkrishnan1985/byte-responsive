import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const acts = [
  {
    title: "ACT 1",
    desc: "Converts spoken feedback or audio recordings into text format for analysis, capturing customer input efficiently for further processing.",
    button: "Speech to Text",
  },
  {
    title: "ACT 2",
    desc: "Converts the retrieved text-based insights into natural-sounding speech, making information accessible through voice interfaces.",
    button: "Text To Speech",
  },
  {
    title: "ACT 3",
    desc: "Extracts names and other key entities from text using named entity recognition, enabling precise personalization and data extraction.",
    button: "NER",
  },
  {
    title: "ACT 4",
    desc: "Detects facial expressions and emotions from customer images or videos, adding a visual layer to sentiment analysis.",
    button: "Expression Recognition",
  },
  {
    title: "ACT 5",
    desc: "Transforms raw customer feedback into a cohesive narrative, extracting key themes to tell the story of demo experience.",
    button: "LLM",
  },
];


const DemonstratingNER = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xl")); 
  const isTablet = useMediaQuery("(max-width:800px)");
  return (
    <Box
    sx={{
      mt: { xs: 2, md: -10 },  
      px: 4,
      py: { xs: 4, md: 6 },   
      width: '100%',
      margin: 'auto',
    }}
  >
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#800080',   
          py: 1,                        
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 400,
            fontSize: isMobile ? '1.5rem' : '2.6rem',
            m: 0,                     
          }}
        >
          Powered by ByteSized AI
        </Typography>
      </Box>

      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{
          border: isTablet ? "1px solid #353434d7" : "",
        }}
      >
        {acts.map((act, index) => (
          <Grid
            item
            xs={12}
            // sm={12}
            md={2}
            key={index}
            sx={{
              maxWidth: !isTablet ? "20% !important" : "100%",
              flexBasis: !isTablet ? "20% !important" : "100%",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 4,
                ":hover": {
                  background:
                    "linear-gradient(0deg, rgba(94, 8, 134, 0.85), rgba(20, 19, 19, 0.95))",
                },
                height: "100%",
                borderRight: isTablet
                  ? "1px solid #353434d7"
                  : index === acts.length - 1
                    ? ""
                    : "1px solid #353434d7",
                borderTop: "1px solid #353434d7",
                borderBottom: isTablet
                  ? "1px solid #353434d7"
                  : index === 0 || index === acts.length - 1
                    ? ""
                    : "1px solid #353434d7",
                borderLeft: isTablet ? "0.5px solid #353434d7" : "",
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  mb: 2,
                  fontSize: isMobile ? "1.2rem" : "1.8rem",
                }}
              >
                {act.title}
              </Typography>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: "#ccc",
                  mb: 3,
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                }}
              >
                {act.desc}
              </Typography>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#9c27b0",
                    color: "white",
                    px: 3,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#ba68c8",
                    },
                    fontSize: isTablet ? "1.2rem" : "1rem",
                  }}
                >
                  {act.button}
                </Button>
              </Box>
              {!isTablet && index === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    right: "0%",
                    bottom: 0,
                    width: "90%",
                    borderBottom: "1px solid #353434d7",
                    paddingBottom: "1rem",
                  }}
                />
              )}
              {!isTablet && index === acts.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    left: "0%",
                    bottom: 0,
                    width: "90%",
                    borderBottom: "1px solid #353434d7",
                    paddingBottom: "1rem",
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DemonstratingNER;
