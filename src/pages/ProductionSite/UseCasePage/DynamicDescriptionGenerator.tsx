import React from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";

const DynamicDescriptionGenerator = () => {
  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          What is Dynamic Description Generator?
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Flow Preview:</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            DESCRIPTION
          </Typography>
          <Typography variant="body1">ACT 1</Typography>
          <Typography variant="body1">ACT 2</Typography>
          <Typography variant="body1">ACT 3</Typography>
          <Typography variant="body1">ACT 4</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">
            Analyses customer feedback and social media comments to understand
            overall sentiment toward each product (scalable, neutral, or
            negative).
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Synthesises the output of Sentiment Analysis and Keyword Extraction
            to generate a cohesive, engaging product description.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">
            This use case is crafted especially for SaaS businesses.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">
            Bytes: Social Studio manages and upgrades all deployed models,
            ensuring they remain cutting-edge and keep your business ahead in AI
            innovation.
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary">
            GOT IT!
          </Button>
          <Button
            variant="outlined"
            color="primary"
          >
            Express interest
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DynamicDescriptionGenerator;
